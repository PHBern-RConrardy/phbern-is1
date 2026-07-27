local function add_markdown_blocks(doc, markdown)
  local blocks = pandoc.read(markdown, "markdown").blocks

  for _, block in ipairs(blocks) do
    table.insert(doc.blocks, block)
  end
end

local function with_scheme(url)
  if url:match("^%a[%w+.-]*://") then
    return url
  end

  return "https://" .. url
end

function Image(image)
  if image.src:match("^soco%-st/") then
    image.src = "../_extensions/PHBern-RConrardy/phbern/assets/" .. image.src
    return image
  end
end

function Header(header)
  local padlet_url = header.attributes["data-padlet-url"]
  local paper_link = header.attributes["data-paper-link"]

  if padlet_url and paper_link then
    error("A slide cannot use both data-padlet-url and data-paper-link.")
  end

  if not padlet_url and not paper_link then
    return nil
  end

  local link
  local div_class

  if padlet_url then
    link = pandoc.Link(
      padlet_url,
      with_scheme(padlet_url),
      "",
      pandoc.Attr("", {}, { target = "_blank", rel = "noopener noreferrer" })
    )
    div_class = "padlet-url"
  else
    link = pandoc.Link("Übungsblatt", paper_link)
    div_class = "paper-link"
  end

  local para = pandoc.Para({ link })
  local div = pandoc.Div({ para }, pandoc.Attr("", { div_class }, {}))

  return { header, div }
end

function Pandoc(doc)
  add_markdown_blocks(doc, [[
## Rechtliches

:::: {.columns}

::: {.column width="50%"}
![](../_extensions/PHBern-RConrardy/phbern/assets/soco-st/492964_male-judge-upper-body.svg)
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
