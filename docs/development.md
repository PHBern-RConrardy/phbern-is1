# Development and validation

## Repository structure

```text
.
├── README.md
├── _quarto.yml
├── template.qmd
├── examples/
├── docs/
└── _extensions/
    └── PHBern-RConrardy/
        └── phbern/
            ├── _extension.yml
            ├── assets/
            ├── cloudflare/
            ├── styles/
            ├── typst/
            ├── *.lua
            ├── reference.docx
            └── reference.pptx
```

Files above `_extensions/` document and test the package. Quarto installs only
the extension contribution below `_extensions/`.

## Render the examples

From the repository root:

```bash
quarto render
```

Render one example while iterating:

```bash
quarto render examples/slides.qmd
quarto render examples/handout.qmd
quarto render examples/word.qmd
quarto render examples/powerpoint.qmd
```

Generated files go to `_site/` and are ignored by Git.

## Validate installation packaging

Test a local installation in an empty directory:

```bash
mkdir /tmp/phbern-extension-test
cd /tmp/phbern-extension-test
quarto add /path/to/phbern-quarto-extension
quarto list extensions
```

The list should contain extension ID `phbern` and contribution type `formats`.

For the real distribution path, test:

```bash
quarto add PHBern-RConrardy/phbern-is1
```

## Regression checklist

Before releasing:

1. `quarto add` discovers exactly one extension named `phbern`.
2. All five example documents render.
3. Reveal.js title, activity, Padlet, paper, science, pause, legal, and
   literature slides render correctly.
4. Speaker notes open with `S`.
5. A `soco-st/...` image loads in the rendered deck.
6. Typst/PDF contains the PHBern header, numbered headings, table styling, and
   bibliography.
7. Relative links in Typst/PDF and Word use `website.site-url`.
8. A `resources_non_free/` PDF link receives a lock marker.
9. Word and PowerPoint open without repair warnings.
10. `git status --short` shows no generated output.

## Updating the extension

Keep the format version in
`_extensions/PHBern-RConrardy/phbern/_extension.yml` aligned with releases.
Use semantic versioning:

- patch: documentation or compatible fixes;
- minor: new compatible format features;
- major: format names, metadata, or output behaviour change incompatibly.

Projects should commit their installed `_extensions/` directory. Updating the
source repository does not silently change existing course projects.
