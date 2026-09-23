"""Fit a long Pandoc bibliography on the final PowerPoint slide."""

import os
import re
import sys
import tempfile
from pathlib import Path
from xml.etree import ElementTree as ET
from zipfile import ZipFile


A = "http://schemas.openxmlformats.org/drawingml/2006/main"
P = "http://schemas.openxmlformats.org/presentationml/2006/main"
R = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
ET.register_namespace("a", A)
ET.register_namespace("p", P)
ET.register_namespace("r", R)


def fit(path):
    with ZipFile(path) as source:
        slides = sorted(
            (name for name in source.namelist() if re.fullmatch(r"ppt/slides/slide\d+\.xml", name)),
            key=lambda name: int(re.search(r"slide(\d+)", name).group(1)),
        )
        if not slides:
            return
        last_slide = slides[-1]
        root = ET.fromstring(source.read(last_slide))
        paragraphs = root.findall(f".//{{{A}}}p")
        text = "".join(node.text or "" for node in root.iter(f"{{{A}}}t"))
        if len(text) < 500 or len(paragraphs) < 3 or len(re.findall(r"\b(?:19|20)\d{2}\b", text)) < 3:
            return

        for paragraph in paragraphs:
            for run in paragraph.findall(f"{{{A}}}r"):
                properties = run.find(f"{{{A}}}rPr")
                if properties is None:
                    properties = ET.Element(f"{{{A}}}rPr")
                    run.insert(0, properties)
                properties.set("sz", "1400")
            end = paragraph.find(f"{{{A}}}endParaRPr")
            if end is not None:
                end.set("sz", "1400")

        revised = ET.tostring(root, encoding="utf-8", xml_declaration=True)
        handle, temp_name = tempfile.mkstemp(suffix=".pptx", dir=path.parent)
        os.close(handle)
        try:
            with ZipFile(temp_name, "w") as target:
                for member in source.infolist():
                    target.writestr(member, revised if member.filename == last_slide else source.read(member))
            os.replace(temp_name, path)
        finally:
            if os.path.exists(temp_name):
                os.unlink(temp_name)


if __name__ == "__main__":
    target = Path(sys.argv[1])
    if target.is_dir():
        for presentation in target.rglob("*.pptx"):
            fit(presentation)
    else:
        fit(target)
