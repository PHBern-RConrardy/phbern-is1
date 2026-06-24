function Pandoc(doc)
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