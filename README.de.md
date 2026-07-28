# PHBern-Quarto-Erweiterung

[English](README.md) | [Deutsch](README.de.md)

Gestaltete Quarto-Formate für PHBern-Kurswebsites, Reveal.js-Präsentationen,
PDF-Handouts, Word-Dokumente und PowerPoint-Präsentationen. Die Erweiterung
basiert auf konkreten Veröffentlichungsmustern aus den Kursprojekten `PPD_1`
und `PPD_2`.

Standardmässig verwendet die Erweiterung Schweizer Deutsch (`de-CH`),
PHBern-Typografie, Farben und Vorlagen sowie einen APA-Zitierstil.

## Formate

| Format | Geeignet für | Erweiterungsspezifisches Verhalten |
|---|---|---|
| `phbern-html` | Kursseiten und Webdokumente | PHBern-Farben, Typografie, Inhaltsverzeichnis |
| `phbern-revealjs` | Lehrpräsentationen | Gestaltete Titelfolie, semantische Aktivitäts-, Wissenschafts- und Pausenfolien, Padlet- und Arbeitsblattlinks, mitgelieferte Illustrationen sowie Rechts- und Literaturfolien |
| `phbern-typst` | PDF-Handouts, Reader und Aufträge | PHBern-A4-Kopf, nummerierte Überschriften, Tabellen, APA-Literaturverzeichnis, Links zur öffentlichen Website und Schloss-Symbol für geschützte Ressourcen |
| `phbern-docx` | Bearbeitbare Word-Handouts | PHBern-Referenzdokument und Links zur öffentlichen Website |
| `phbern-pptx` | Bearbeitbare PowerPoint-Folien | PHBern-Referenzvorlage und vorhersehbare Pandoc-Folienlayouts |

Die Beispiele in [`examples/`](examples/) decken die Formate bewusst getrennt
ab. Die gerenderten Links stehen zur Verfügung, sobald der Ordner `_site/` mit
GitHub Pages veröffentlicht ist:

| Anwendungsfall | Quelle | Gerendertes Beispiel |
|---|---|---|
| Gestaltetes HTML | [`index.qmd`](examples/index.qmd) | [HTML öffnen](https://phbern-rconrardy.github.io/phbern-is1/examples/) |
| Reveal.js-Folientypen | [`slides.qmd`](examples/slides.qmd) | [Folien öffnen](https://phbern-rconrardy.github.io/phbern-is1/examples/slides.html) |
| Typst/PDF-Handout | [`handout.qmd`](examples/handout.qmd) | [PDF öffnen](https://phbern-rconrardy.github.io/phbern-is1/examples/handout.pdf) |
| Bearbeitbares Word-Dokument | [`word.qmd`](examples/word.qmd) | [DOCX herunterladen](https://phbern-rconrardy.github.io/phbern-is1/examples/word.docx) |
| Bearbeitbare PowerPoint-Präsentation | [`powerpoint.qmd`](examples/powerpoint.qmd) | [PPTX herunterladen](https://phbern-rconrardy.github.io/phbern-is1/examples/powerpoint.pptx) |

## Voraussetzungen

- Quarto `1.4.11` oder neuer
- Liberation Sans, damit PDFs lokal und auf GitHub Pages einheitlich gerendert
  werden
- Die mitgelieferte zentrale Bibliografie für bestehende PHBern-Kurszitate
  oder eine zusätzliche Projektbibliografie über `bibliography`

Das Repository wird mit der von den Verantwortlichen verwendeten Quarto-Version
getestet. Die Erweiterung enthält ihre zentrale Bibliografie, den CSL-Stil,
Office-Referenzdokumente, Logo, Folienhintergründe und Soco-St-Illustrationen.

## Installation

Führen Sie im Stammverzeichnis eines Quarto-Projekts aus:

```bash
quarto add PHBern-RConrardy/phbern-is1
```

Prüfen Sie, ob Quarto die Erweiterung erkennt:

```bash
quarto list extensions
```

Die Erweiterungs-ID ist `phbern`. Die Formate heissen deshalb
`phbern-html`, `phbern-revealjs`, `phbern-typst`, `phbern-docx` und
`phbern-pptx`.

Quarto installiert Erweiterungen lokal im Projekt. Committen Sie den erzeugten
Ordner `_extensions/`, damit das Projekt reproduzierbar bleibt.

## Schnellstart

Erstellen Sie `handout.qmd`:

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

Rendern Sie die Datei:

```bash
quarto render handout.qmd
```

Für ein sofort renderbares Projekt klonen Sie dieses Repository und führen aus:

```bash
quarto render
```

Die Datei [`_quarto.yml`](_quarto.yml) im Stammverzeichnis rendert alle
Quellbeispiele nach `_site/`.

## Empfohlene Projektkonfiguration

Die PPD-Projekte führen Deployment-Metadaten und Website-Standardeinstellungen
in einer Projektdatei zusammen:

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

`website.site-url` ist besonders wichtig, wenn ein Typst/PDF- oder
Word-Dokument auf ein anderes Kursartefakt verlinkt. Die Erweiterung wandelt
relative Links in diesen Exporten in stabile öffentliche URLs um. Siehe
[`docs/resources-and-cloudflare.md`](docs/resources-and-cloudflare.md)
(zurzeit auf Englisch).

## Reveal.js-Lehrpräsentationen

Eine minimale Präsentation benötigt nur das benutzerdefinierte Format:

```markdown
---
title: "PPD"
subtitle: "Wirkung, Gestaltung und Einsatz"
author: "Vorname Name, Funktion"
format: phbern-revealjs
bibliography: library.bib
---
```

Das Format fügt automatisch zwei Schlussfolien hinzu:

1. eine Rechts- und Lizenzfolie für die mitgelieferten Soco-St-Illustrationen;
2. eine scrollbare Literaturfolie mit `#refs`.

### Aktivitätsfolie

```markdown
## Auftrag {.uebung}

1. Diskutieren Sie das Beispiel zu zweit.
2. Halten Sie zwei Erkenntnisse fest.
```

### Aktivitätsfolie mit Padlet

```markdown
## Auftrag {.uebung .padlet data-padlet-url="padlet.com/phbern/example"}

Dokumentieren Sie Ihre Ergebnisse auf Padlet.
```

Die URL wird anklickbar und in einem neuen Tab geöffnet. Ein Schema ist
optional; bei Bedarf wird `https://` ergänzt.

### Aktivitätsfolie mit Arbeitsblatt

```markdown
## Auftrag {.uebung .paper data-paper-link="handout.pdf"}

Bearbeiten Sie das Übungsblatt.
```

Die Folie erhält einen zentrierten Link **Übungsblatt**. Verwenden Sie nicht
`data-padlet-url` und `data-paper-link` auf derselben Folie.

### Wissenschafts- und Pausenfolien

```markdown
## Multimedia Learning {.science}

Eine wissenschaftlich eingeordnete Aussage [@mayer2021].

## {.pause}
```

`.science` verwendet den Wissenschafts-Hintergrund; `.pause` erzeugt eine
vollflächige Pausenfolie.

### Mitgelieferte Soco-St-Illustrationen

Verwenden Sie innerhalb von `phbern-revealjs` den kurzen Pfad `soco-st/`:

```markdown
![](soco-st/493141_a-woman-doing-research-and-experiments.svg){
  fig-alt="Forscherin mit Laborgeräten"
}
```

Geben Sie immer `fig-alt` an. Der kurze Pfad ist eine Reveal.js-Erleichterung
dieser Erweiterung; in anderen Formaten verwenden Sie normale projekt-relative
Bildpfade.

Informationen zu Spalten, Fragmenten, zentrierten Zitaten,
Präsentationsnotizen und allen benutzerdefinierten Folienklassen finden Sie in
[`docs/revealjs.md`](docs/revealjs.md) (zurzeit auf Englisch) sowie im
vollständigen Beispiel [`examples/slides.qmd`](examples/slides.qmd).

## Typst/PDF-Handouts

`phbern-typst` erzeugt A4-Dokumente mit PHBern-Kopf,
Instituts-Kontaktangaben, Logo, nummerierten Überschriften,
Tabellengestaltung und APA-Literaturverzeichnis.

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

Quarto-Callouts, Tabellen, Zitate, Querverweise und rohe Typst-Seitenumbrüche
können normal verwendet werden:

````markdown
::: {.callout-tip title="Hinweis"}
Planen Sie für diesen Auftrag ungefähr 90 Minuten ein.
:::

```{=typst}
#pagebreak()
```
````

Siehe [`examples/handout.qmd`](examples/handout.qmd).

## Word und PowerPoint

Verwenden Sie `phbern-docx`, wenn das Ergebnis als Dokument bearbeitbar bleiben
soll:

```yaml
format: phbern-docx
```

Verwenden Sie `phbern-pptx`, wenn Kolleginnen und Kollegen die Folien in
PowerPoint weiterbearbeiten sollen:

```yaml
format: phbern-pptx
```

PowerPoint wird über Pandoc erzeugt. Es eignet sich am besten für
konventionelle Titel-, Inhalts-, Abschnitts- und Zwei-Spalten-Folien.
Reveal.js-spezifische Funktionen wie `.uebung`, `.science`, `.pause`,
Padlet-Dekorationen, Fragmente und die Referierendenansicht sind keine
PowerPoint-Funktionen.

Für Experimente ist ein alternatives `reference-colored.pptx` enthalten:

```yaml
format:
  phbern-pptx:
    reference-doc: _extensions/PHBern-RConrardy/phbern/reference-colored.pptx
```

Das Standard-`reference.pptx` ist verlässlicher, weil Pandoc Layouts anhand
ihrer kanonischen Rollen auswählt.

## Dokumentation

- [`docs/revealjs.md`](docs/revealjs.md) — Referenz für das Erstellen von Präsentationen (Englisch)
- [`docs/formats-and-metadata.md`](docs/formats-and-metadata.md) — Formate, Standardwerte, Metadaten und Einschränkungen (Englisch)
- [`docs/resources-and-cloudflare.md`](docs/resources-and-cloudflare.md) — stabile Links und optionale geschützte Kursressourcen (Englisch)
- [`docs/development.md`](docs/development.md) — Repository-Struktur, Rendern und Validierung (Englisch)

## Assets und Lizenzen

Der Quellcode der Erweiterung sowie die originalen Dokumentationen und
Beispiele stehen unter
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).

Die Soco-St-Illustrationen unter
`_extensions/PHBern-RConrardy/phbern/assets/soco-st/` behalten ihre
mitgelieferte Lizenz- und Attributionsdatei. SVG Repo kennzeichnet sie als
**CC BY** und nennt Soco St als Urheber; in der mitgelieferten Notiz ist keine
Lizenzversion angegeben. Behalten Sie die Attribution „Soco St via SVG Repo“
bei. Das PHBern-Logo ist ein institutionelles Identitäts-Asset.

CC BY-SA 4.0 gilt nicht für diese separat bezeichneten Materialien. Prüfen Sie
vor einer Weitergabe oder Wiederveröffentlichung
[`LICENSES.md`](LICENSES.md) und
[`LICENSE-CC-BY-SA-4.0.md`](LICENSE-CC-BY-SA-4.0.md).
