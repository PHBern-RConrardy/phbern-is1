# PHBern Quarto extension

[English](README.md) | [Deutsch](README.de.md)

Branded Quarto formats for PHBern course websites, Reveal.js presentations,
PDF handouts, Word documents, and PowerPoint presentations. The extension is
maintained from the concrete publishing patterns used in the `PPD_1` and
`PPD_2` course projects.

The extension defaults to Swiss German metadata (`de-CH`), Arial-based
typography, PHBern colours and templates, and an APA citation style.

## Formats

| Format | Best suited for | Extension-specific behaviour |
|---|---|---|
| `phbern-html` | Course pages and web documents | PHBern colours, Arial typography, table of contents |
| `phbern-revealjs` | Teaching presentations | Branded title slide, semantic activity/science/pause slides, Padlet and worksheet links, bundled illustrations, legal and literature slides |
| `phbern-typst` | PDF handouts, readers, assignments | PHBern A4 header, numbered headings, tables, APA references, public website links, lock marker for protected resources |
| `phbern-docx` | Editable Word handouts | PHBern reference document and public website links |
| `phbern-pptx` | Editable PowerPoint slides | PHBern reference deck and predictable Pandoc slide layouts |

The examples under [`examples/`](examples/) are intentionally separate. The
rendered links become available after the `_site/` folder is published with
GitHub Pages:

| Use case | Source | Rendered example |
|---|---|---|
| Branded HTML | [`index.qmd`](examples/index.qmd) | [Open HTML](https://phbern-rconrardy.github.io/phbern-is1/examples/) |
| Reveal.js slide types | [`slides.qmd`](examples/slides.qmd) | [Open slides](https://phbern-rconrardy.github.io/phbern-is1/examples/slides.html) |
| Typst/PDF handout | [`handout.qmd`](examples/handout.qmd) | [Open PDF](https://phbern-rconrardy.github.io/phbern-is1/examples/handout.pdf) |
| Editable Word document | [`word.qmd`](examples/word.qmd) | [Download DOCX](https://phbern-rconrardy.github.io/phbern-is1/examples/word.docx) |
| Editable PowerPoint deck | [`powerpoint.qmd`](examples/powerpoint.qmd) | [Download PPTX](https://phbern-rconrardy.github.io/phbern-is1/examples/powerpoint.pptx) |

## Requirements

- Quarto `1.4.11` or newer
- Arial installed for the closest match to the PHBern templates
- The bundled central bibliography for existing PHBern course citations, or
  an additional project bibliography declared with `bibliography`

The repository is tested with the Quarto version used by the maintainers. The
extension bundles its central bibliography, CSL style, Office reference
documents, logo, slide backgrounds, and Soco St illustrations.

## Install

From the root of a Quarto project:

```bash
quarto add PHBern-RConrardy/phbern-is1
```

Confirm that Quarto sees the extension:

```bash
quarto list extensions
```

The extension ID is `phbern`, so its format names are `phbern-html`,
`phbern-revealjs`, `phbern-typst`, `phbern-docx`, and `phbern-pptx`.

Quarto installs extensions locally in the project. Commit the generated
`_extensions/` directory so the project remains reproducible.

## Quick start

Create `handout.qmd`:

```markdown
---
title: "Vorbereitungsauftrag"
subtitle: "Digitalität"
author: "Team Digitalität, Institut Sekundarstufe II"
institut: "Sekundarstufe II"
format: phbern-typst
toc: true
bibliography: library.bib
---

# Auftrag

Bearbeiten Sie den Auftrag und begründen Sie Ihre Entscheidung [@mayer2021].
```

Render it:

```bash
quarto render handout.qmd
```

For a ready-to-render project, clone this repository and run:

```bash
quarto render
```

The root [`_quarto.yml`](_quarto.yml) renders all source examples to `_site/`.

## Recommended project configuration

The PPD projects keep deployment metadata and default website settings in one
project file:

```yaml
project:
  type: website
  resources:
    - resources_free/**
    - resources_non_free/**

website:
  title: "Course title"
  site-url: "https://course.example.org"

institut: Sekundarstufe II

format:
  phbern-html:
    toc: true
```

`website.site-url` is especially important when a Typst/PDF or Word document
links to another course artefact. The extension converts relative links in
those exports into stable public URLs. See
[`docs/resources-and-cloudflare.md`](docs/resources-and-cloudflare.md).

## Reveal.js teaching slides

A minimal deck needs only the custom format:

```markdown
---
title: "PPD"
subtitle: "Wirkung, Gestaltung und Einsatz"
author: "Vorname Name, Funktion"
format: phbern-revealjs
bibliography: library.bib
---
```

The format adds two final slides automatically:

1. a legal/licensing slide for the bundled Soco St illustrations;
2. a scrollable literature slide containing `#refs`.

### Activity slide

```markdown
## Auftrag {.uebung}

1. Diskutieren Sie das Beispiel zu zweit.
2. Halten Sie zwei Erkenntnisse fest.
```

### Activity slide with Padlet

```markdown
## Auftrag {.uebung .padlet data-padlet-url="padlet.com/phbern/example"}

Dokumentieren Sie Ihre Ergebnisse auf Padlet.
```

The URL is made clickable and opened in a new tab. A scheme is optional;
`https://` is added when needed.

### Activity slide with worksheet

```markdown
## Auftrag {.uebung .paper data-paper-link="handout.pdf"}

Bearbeiten Sie das Übungsblatt.
```

The slide receives a centred **Übungsblatt** link. Do not use
`data-padlet-url` and `data-paper-link` on the same slide.

### Science and pause slides

```markdown
## Multimedia Learning {.science}

Eine wissenschaftlich eingeordnete Aussage [@mayer2021].

## {.pause}
```

`.science` uses the science background and `.pause` creates a full-slide
pause visual.

### Bundled Soco St illustrations

Within `phbern-revealjs`, use the short `soco-st/` path:

```markdown
![](soco-st/493141_a-woman-doing-research-and-experiments.svg){
  fig-alt="Forscherin mit Laborgeräten"
}
```

Always provide `fig-alt`. The short path is a Reveal.js convenience supplied
by this extension; use ordinary project-relative image paths in other formats.

For columns, fragments, centred quotations, speaker notes, and every custom
slide class, see [`docs/revealjs.md`](docs/revealjs.md) and the complete
[`examples/slides.qmd`](examples/slides.qmd).

## Typst/PDF handouts

`phbern-typst` creates A4 documents with the PHBern header, institute contact
details, logo, numbered headings, table styling, and APA references.

```yaml
format:
  phbern-typst:
    keep-typ: true
title: "Semesteraufbau"
subtitle: "Pädagogik, Psychologie, Digitalität"
author: "Team Digitalität"
institut: "Sekundarstufe II"
toc: true
bibliography: library.bib
reference-section-title: Literatur
```

Quarto callouts, tables, citations, cross-references, and raw Typst page breaks
can be used normally:

````markdown
::: {.callout-tip title="Hinweis"}
Planen Sie für diesen Auftrag ungefähr 90 Minuten ein.
:::

```{=typst}
#pagebreak()
```
````

See [`examples/handout.qmd`](examples/handout.qmd).

## Word and PowerPoint

Use `phbern-docx` when the result must remain editable as a document:

```yaml
format: phbern-docx
```

Use `phbern-pptx` when colleagues must continue editing slides in PowerPoint:

```yaml
format: phbern-pptx
```

PowerPoint is generated through Pandoc. It works best with conventional title,
content, section, and two-column slides. Reveal.js-only features such as
`.uebung`, `.science`, `.pause`, Padlet decorations, fragments, and speaker
view are not PowerPoint features.

An alternate `reference-colored.pptx` is bundled for experimentation:

```yaml
format:
  phbern-pptx:
    reference-doc: _extensions/PHBern-RConrardy/phbern/reference-colored.pptx
```

The default `reference.pptx` is more predictable because Pandoc selects layouts
by their canonical layout roles.

## Documentation

- [`docs/revealjs.md`](docs/revealjs.md) — presentation authoring reference
- [`docs/formats-and-metadata.md`](docs/formats-and-metadata.md) — formats,
  defaults, metadata, and limitations
- [`docs/resources-and-cloudflare.md`](docs/resources-and-cloudflare.md) —
  stable links and optional protected course resources
- [`docs/development.md`](docs/development.md) — repository structure,
  rendering, and validation

## Assets and licensing

The extension source code and the original documentation and examples are
licensed under
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).

The Soco St illustrations under
`_extensions/PHBern-RConrardy/phbern/assets/soco-st/` retain their bundled
licence and attribution file. SVG Repo marks them as **CC BY**, with Soco St
as the named author; the bundled notice does not specify a licence version.
Keep the attribution “Soco St via SVG Repo”. The PHBern logo is an
institutional identity asset.

The CC BY-SA 4.0 licence does not apply to those separately identified
materials. See [`LICENSES.md`](LICENSES.md) and
[`LICENSE-CC-BY-SA-4.0.md`](LICENSE-CC-BY-SA-4.0.md) before redistributing or
republishing the extension.
