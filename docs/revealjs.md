# Reveal.js authoring reference

`phbern-revealjs` is the richest format in this extension. It combines the
PHBern visual treatment with several semantic slide types used in `PPD_1` and
`PPD_2`.

Start every deck with explicit metadata:

```yaml
---
title: "PPD"
subtitle: "Thema"
author: "Vorname Name, Funktion"
format: phbern-revealjs
bibliography: library.bib
---
```

## Default presentation behaviour

The format uses:

- a 1600 × 900 canvas;
- a PHBern title background and logo;
- flattened slide numbers;
- no navigation controls, progress bar, transitions, or menu;
- left-aligned content rather than vertical centring;
- an automatically appended legal slide;
- an automatically appended, scrollable literature slide.

Override ordinary Reveal.js options inside the format block when a deck needs
different behaviour:

```yaml
format:
  phbern-revealjs:
    controls: true
    progress: true
    slide-number: c/t
```

## Automatic slide PDF export

The bundled `export-pdf.ts` hook uses Quarto's own Deno runtime and Quarto's
optional **Chrome Headless Shell**. It does not depend on Node.js, npm or
DeckTape. It produces `slides.pdf` beside `slides.html`, with no additional
console output on success. Errors appear as a single exporter error in the
terminal. The hook never launches desktop Chrome, Edge or a personal browser
profile, and never installs software automatically.

### One-time setup

With Quarto 1.9 or newer, install the optional headless component once on each
rendering machine:

```bash
quarto install chrome-headless-shell
```

This is a separate download managed by Quarto, not part of the default Quarto
installation. The exporter locates it in Quarto's platform-specific data
folder on macOS, Windows and Linux. If it is missing, PDF export stops with
installation instructions; there is no fallback to a desktop browser.

### Enable in each course

Update the extension and merge this hook into the course's `_quarto.yml`:

```yaml
project:
  post-render:
    - _extensions/PHBern-RConrardy/phbern/export-pdf.ts

website:
  site-url: https://example.org/my-course
```

Keep existing post-render hooks in the list. Quarto automatically runs `.ts`
project scripts using its bundled runtime. Installing the format alone does
not activate a project hook; it is already enabled for this repository's
examples. GitHub Actions installs the same headless component during setup.

Then use `quarto render` or `quarto render examples/slides.qmd` as usual.
Only Reveal.js presentations in the current render outputs are exported.

### PDF behaviour

- The exporter uses Reveal's `?print-pdf` layout. It waits for Reveal's PDF
  pages, fonts and inline images before printing. Visual fidelity still needs
  checking against the actual deck because print CSS can differ from screen CSS.
- The Reveal canvas sets the page size. Fragment contents appear together,
  with at most one PDF page per slide. Long content must fit the slide canvas.
- Normal hyperlinks remain PDF links. Relative links are resolved against
  `website.site-url` and the original output path. Fragment links open the
  corresponding online slide, rather than jumping between PDF pages.
- Animations, video and JavaScript interactions are static in the PDF.
- A disposable browser profile keeps the personal profile separate. Temporary
  files are removed, and an existing PDF is retained if generation fails.

The headless shell has no normal browser interface. An OS crash or security
alert cannot be ruled out for any executable; the exporter does not suppress
OS diagnostics or weaken browser protections. Windows and Linux path handling
is implemented but requires testing on those operating systems.

### Manual export and configuration

Export all already-rendered decks without rendering the project again:

```bash
quarto run _extensions/PHBern-RConrardy/phbern/export-pdf.ts --all
```

| Environment variable | Purpose |
|---|---|
| `PHBERN_HEADLESS_PATH` | Explicit path to a `chrome-headless-shell` or `headless_shell` executable |
| `PHBERN_SLIDES_PDF=0` | Skip slide PDF generation for a render |

A Quarto project is required for automatic post-render hooks. This exporter
replaces the earlier experimental DeckTape hook; existing DeckTape or Puppeteer
installations are not used or automatically removed.

## Slide hierarchy

Level-one headings create section slides:

```markdown
# Lernen begleiten
```

Level-two headings create ordinary content slides:

```markdown
## Lernziele

- Ziel eins
- Ziel zwei
```

Keep slides focused. Split content instead of shrinking an entire deck.
Use the standard `.smaller` or `.scrollable` classes only when necessary:

```markdown
## Detailübersicht {.smaller .scrollable}
```

## PHBern semantic slide types

### Activity

```markdown
## Auftrag {.uebung}

1. Analysieren Sie das Beispiel.
2. Vergleichen Sie Ihre Ergebnisse.
```

The activity background uses the PHBern beige colour.

### Activity with Padlet

```markdown
## Austausch {.uebung .padlet data-padlet-url="https://padlet.com/phbern/example"}

Halten Sie Ihre Ergebnisse auf Padlet fest.
```

The extension adds a visible, clickable URL and Padlet decoration. If the URL
has no scheme, `https://` is added.

### Activity with worksheet

```markdown
## Vertiefung {.uebung .paper data-paper-link="handout.pdf"}

Bearbeiten Sie das Übungsblatt.
```

The extension adds a centred **Übungsblatt** link and worksheet decoration.
`data-padlet-url` and `data-paper-link` are mutually exclusive; rendering
stops with an explanatory error if both are present.

### Science

```markdown
## Forschungsbefund {.science}

Multimediales Lernen gelingt nicht allein durch das Hinzufügen von Medien
[@mayer2021].
```

The science slide uses a blue background and a bundled research illustration.

### Pause

```markdown
## {.pause}
```

This creates a clock-based pause visual. Leave the heading text empty.

### Centred quotation

```markdown
::: {.center-quote}
Gestaltung folgt der didaktischen Absicht.
:::
```

Combine the class with a fragment when the quotation should appear later:

```markdown
::: {.fragment .center-quote data-fragment-index="2"}
Gestaltung folgt der didaktischen Absicht.
:::
```

## Bundled illustrations

For Reveal.js presentations, the extension rewrites images whose source starts
with `soco-st/`:

```markdown
![](soco-st/493580_two-people-having-a-conversation.svg){
  fig-alt="Zwei Personen im Gespräch"
}
```

Use a meaningful `fig-alt` for every content-bearing image. Decorative images
should use an empty alternative text.

The available filenames are stored under
`_extensions/PHBern-RConrardy/phbern/assets/soco-st/`. The legal slide appended
by the format supplies the collection-level attribution.

## Columns

The PPD projects use explicit widths and enough whitespace:

```markdown
:::: {.columns style="align-items: center; min-height: 520px;"}

::: {.column width="60%"}
### Auftrag

1. Lesen Sie die Aussage.
2. Diskutieren Sie eine Anwendung.
:::

::: {.column width="40%"}
![](soco-st/493580_two-people-having-a-conversation.svg){
  fig-alt="Zwei Personen im Gespräch"
}
:::

::::
```

## Fragments

Reveal content step by step with standard Quarto fragments:

```markdown
- Ausgangslage
- Konsequenz
- Transfer
{.incremental}
```

For precise sequencing:

```markdown
::: {.fragment data-fragment-index="1"}
Dieser Inhalt erscheint zuerst.
:::

::: {.fragment data-fragment-index="2"}
Dieser Inhalt erscheint danach.
:::
```

## Speaker notes

Keep facilitation guidance out of the visible slide:

```markdown
::: {.notes}
Hier nach einem Beispiel aus dem Unterricht fragen. Danach zur nächsten Folie
wechseln.
:::
```

Press `S` while presenting to open Reveal.js speaker view.

## Absolute positioning

Use absolute positioning for deliberate visual compositions, not routine text
layout:

```markdown
![](soco-st/493375_santa-and-reindeer-on-a-sleigh.svg){
  .absolute
  fig-alt="Weihnachtsmann im Schlitten"
  top=40
  left=0
  width="230"
}
```

Columns remain easier to maintain for most instructional slides.

## Bibliography and legal slides

The filter always appends:

1. **Rechtliches**, including the CC BY attribution “Soco St via SVG Repo”
   and slide-licence information;
2. **Literatur**, containing the document bibliography.

Use ordinary citations in slide content:

```markdown
Der Multimedia-Effekt ist kein Selbstzweck [@mayer2021].
```

Set `bibliography` to a file that is reachable from the project root.

## Full example

See [`../examples/slides.qmd`](../examples/slides.qmd) for a single deck that
exercises all extension-specific slide types.

## PDF export

Press `E` to switch to Reveal's print view, then save as PDF from Chrome's
print dialog with background graphics enabled and browser headers/footers
disabled. The centered 16:9 frame and black outer margins apply only to the
screen presentation, not the print view.

The filter assigns native `data-background-color` values to `.science`
(light blue) and `.uebung` (beige) slides. Explicit background colors take
precedence. Each PDF page therefore keeps its own color independently of
the active slide. The title logo and page numbers use print-specific rules.
