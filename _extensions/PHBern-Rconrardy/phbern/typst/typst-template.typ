#let phbern(
  title: none,
  subtitle: none,
  author: none,
  body: none,
) = {
  set text(font: ("Arial", "Helvetica"), size: 10pt, lang: "de")

  set page(
    paper: "a4",
    margin: (left: 23mm, right: 23mm, top: 25mm, bottom: 24mm),
    header-ascent: 0pt,
    footer-descent: 0%,
    footer: none,

    header: [
  #block(width: 100%, height: 12mm)[

    #place(top + left)[
      #set text(font: ("Arial", "Helvetica"), size: 8pt)

      #stack(
        dir: ttb,
        spacing: 2.5pt,
        [#text(weight: "bold")[Institut Sekundarstufe I]],
        [Fabrikstrasse 8, CH-3012 Bern],
        [#str("T +41 31 309 21 15, contactdesk@phbern.ch, www.phbern.ch")],
      )
    ]

    #place(top + right, dy: -10pt)[
      #image("_extensions/PHBern-Rconrardy/phbern/assets/Log_PHB_black.eps.svg", width: 70mm)
    ]

    #place(bottom + left)[
      #rect(width: 100%, height: 2pt, fill: black, stroke: none)
    ]
  ]
],
  )

  show link: set text(fill: rgb("#ad0101"))
  show strong: set text(weight: "bold")

// Title block: title, subtitle, author all flush left.
if title != none or subtitle != none or author != none {
  block(width: 100%, inset: (top: 12pt), below: 12pt)[
    #set align(left)
    #set text(font: ("Arial", "Helvetica"))

    #stack(
      dir: ttb,
      spacing: 7pt,

      if title != none {
        text(size: 14pt, weight: "bold")[#title]
      },

      if subtitle != none {
        text(size: 14pt)[#subtitle]
      },

      if author != none {
        block(above: 12pt)[
          #text(size: 10pt)[#author]
        ]
      },
    )
  ]
}

  // Numbered headings:
  // 1      Heading 1
  // 1.1    Heading 2
  // 1.1.1  Heading 3
  set heading(numbering: "1.1")

  let numbered-heading(size: 10pt, above: 10pt, below: 6pt, number-width: 17mm) = it => {
    context {
      let nums = counter(heading).at(it.location())
      let num = numbering("1.1", ..nums)

      block(above: above, below: below, width: 100%)[
        #set text(size: size, weight: "bold")

        #grid(
          columns: (number-width, 1fr),
          gutter: 0pt,
          align: (left, left),
          [#num],
          [#it.body],
        )
      ]
    }
  }

  show heading.where(level: 1): numbered-heading(
    size: 11pt,
    above: 14pt,
    below: 8pt,
    number-width: 17mm,
  )

  show heading.where(level: 2): numbered-heading(
    size: 10pt,
    above: 12pt,
    below: 6pt,
    number-width: 17mm,
  )

  show heading.where(level: 3): numbered-heading(
    size: 10pt,
    above: 10pt,
    below: 5pt,
    number-width: 17mm,
  )

  body
}