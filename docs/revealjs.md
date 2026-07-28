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
  style="max-height: 390px; width: auto;"
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

1. **Rechtliches**, including Soco St and slide-licence information;
2. **Literatur**, containing the document bibliography.

Use ordinary citations in slide content:

```markdown
Der Multimedia-Effekt ist kein Selbstzweck [@mayer2021].
```

Set `bibliography` to a file that is reachable from the project root.

## Full example

See [`../examples/slides.qmd`](../examples/slides.qmd) for a single deck that
exercises all extension-specific slide types.
