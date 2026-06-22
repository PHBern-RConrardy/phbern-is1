# phbern Quarto extension

Custom Quarto formats for PHBern-style outputs based on the provided Word and PowerPoint templates.

## Formats

- `phbern-revealjs` - RevealJS presentation close to the PHBern PowerPoint look.
- `phbern-pptx` - PowerPoint output using `reference.pptx` derived from `PHBern_Präsentationen.potx`.
- `phbern-docx` - Word output using `reference.docx` derived from `IS1_Text.dotx`.
- `phbern-typst` - Typst/PDF output with A4 report layout close to the Word template.
- `phbern-html` - Minimal HTML with PHBern CI/CD color tokens.

## Usage

Render one format:

```bash
quarto render template.qmd --to phbern-revealjs
quarto render template.qmd --to phbern-pptx
quarto render template.qmd --to phbern-docx
quarto render template.qmd --to phbern-typst
quarto render template.qmd --to phbern-html
```

Or use the YAML block in `template.qmd` to render all formats.

## About the colored PowerPoint template

The extension defaults to the cleaner `PHBern_Präsentationen.potx` template.

PowerPoint output is generated through Pandoc/Quarto. Pandoc chooses PowerPoint layouts from the reference deck by slide content, using these canonical layout names:

- `Title Slide`
- `Title and Content`
- `Section Header`
- `Two Content`
- `Comparison`
- `Content with Caption`
- `Blank`

Because the colored PHBern template contains several German-named and illustration-specific layouts, Quarto cannot reliably let a `.qmd` file choose every colored layout as a first-class slide type. I included `reference-colored.pptx` as an alternate template, but the default remains `reference.pptx` for predictability.

To try the colored reference template for a specific document:

```yaml
format:
  phbern-pptx:
    reference-doc: _extensions/phbern/reference-colored.pptx
```

This may work well for simple title/content/two-column slides, but highly specific colored layouts may still require manual adjustment in PowerPoint.

## Notes

- Fonts: the Office outputs use Arial from the provided templates. RevealJS uses Arial/Helvetica/Liberation Sans fallbacks.
- The CI/CD color palette is defined in `styles/_phbern-colors.scss` and used primarily as tokens.
- No PHBern web footer, Impressum, Disclaimer, or Kontakt links are added by default.
