local function add_markdown_blocks(doc, markdown)
  local blocks = pandoc.read(markdown, "markdown").blocks

  for _, block in ipairs(blocks) do
    table.insert(doc.blocks, block)
  end
end

function Pandoc(doc)
  add_markdown_blocks(doc, [[
## Rechtliches

:::: {.columns}

::: {.column width="50%"}
![](_extensions/PHBern-Rconrardy/phbern/svgrepo_soco-st-various-illustration-vectors/492964_male-judge-upper-body.svg)
:::

::: {.column width="50%"}
### Urheberrecht

- Bilder wie das links: CC BY [Soco St](https://www.svgrepo.com/author/soco-st/) via SVG Repo
- Eigene Slides unter [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.en)
:::

::::
]])

  table.insert(
    doc.blocks,
    pandoc.Header(2, "Literatur", pandoc.Attr("", { "smaller", "scrollable" }, {}))
  )

  table.insert(
    doc.blocks,
    pandoc.Div({}, pandoc.Attr("refs", {}, {}))
  )

  return doc
end