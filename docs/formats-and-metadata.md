# Formats and metadata

## Shared defaults

All PHBern formats inherit these defaults:

| Metadata | Default |
|---|---|
| `lang` | `de-CH` |
| `author` | `Richard Conrardy` |
| `institut` | `Sekundarstufe II` |
| `bibliography` | bundled central `library.bib` |
| citation style | bundled APA CSL |

Document metadata can add a project bibliography:

```yaml
author: "Team Digitalität"
institut: "Sekundarstufe II"
bibliography: references/library.bib
```

Quarto combines the bundled central bibliography with an explicitly declared
project bibliography. Keeping project-specific references explicit is
recommended because it makes the source and its dependencies clear.

## `phbern-html`

Use for course pages and web-native documents.

Defaults:

- Cosmo plus the PHBern SCSS theme;
- Arial/Helvetica/Liberation Sans font stack;
- PHBern bordeaux links and accents;
- table of contents enabled;
- sections not numbered.

Example:

```yaml
format:
  phbern-html:
    toc: true
    number-sections: false
```

For a website, set the format at project level and override only exceptional
pages.

## `phbern-revealjs`

Use for browser-based teaching presentations.

In addition to the visual theme, this format loads a Lua filter that:

- resolves `soco-st/...` illustration shorthand;
- creates Padlet and worksheet links from heading attributes;
- appends legal and literature slides.

See [`revealjs.md`](revealjs.md) for the authoring reference.

## `phbern-typst`

Use for high-quality PDF handouts, readers, assignments, semester plans, and
assessment descriptions.

Defaults:

- A4 paper;
- 10.5 pt Arial;
- PHBern institutional header;
- numbered headings;
- optional table of contents;
- APA references;
- absolute public URLs for relative project links;
- a lock marker before links into `resources_non_free/`.

Example:

```yaml
format:
  phbern-typst:
    keep-typ: true
toc: true
toc-depth: 3
```

`keep-typ: true` is useful while developing a document but normally does not
need to be committed.

The Typst template accepts:

| Metadata | Purpose |
|---|---|
| `title` | document title |
| `subtitle` | secondary title line |
| `author` | author or team line |
| `institut` | institute name in the page header |
| `toc` | include an outline |
| `toc-title` | custom outline title |
| `toc-depth` | maximum outline depth |
| `toc-indent` | outline indentation |

## `phbern-docx`

Use for editable Word documents and hand-offs to colleagues who do not work
with Quarto.

The bundled `reference.docx` controls styles and page appearance. The link
filter converts relative project links to public URLs when `_quarto.yml`
defines `website.site-url`.

Example:

```yaml
format:
  phbern-docx:
    toc: false
```

Word output does not use the Typst page header or raw Typst blocks.

## `phbern-pptx`

Use for editable PowerPoint output.

The format uses the bundled `reference.pptx`, slide level 2, and no table of
contents:

```yaml
format: phbern-pptx
```

Pandoc maps source content to conventional PowerPoint layouts. Use headings,
lists, images, and two-column layouts. Reveal.js-only PHBern classes do not
translate into PowerPoint-specific designs.

An alternate `reference-colored.pptx` is included but may require manual
layout corrections because its specialized layouts do not all map to Pandoc's
canonical roles.

## One source, several formats

Multi-format YAML is useful only when the content structure suits every
target:

```yaml
format:
  phbern-html: default
  phbern-typst: default
  phbern-docx: default
```

For teaching presentations, keep Reveal.js and PowerPoint examples separate
when they use format-specific features. This mirrors the PPD projects: one
source file is responsible for one concrete deliverable.

## Raw format-specific content

Use raw Typst only when no portable Quarto construct exists:

````markdown
```{=typst}
#pagebreak()
```
````

Prefer callouts, tables, figures, citations, and cross-references for content
that may later be exported to HTML or Word.
