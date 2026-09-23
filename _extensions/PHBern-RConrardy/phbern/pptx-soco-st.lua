local script_dir = PANDOC_SCRIPT_FILE:match("^(.*)/[^/]*$") or "."

function Image(image)
  if not image.src:match("^soco%-st/") then
    return nil
  end

  local input_file = quarto and quarto.doc and quarto.doc.input_file
    or (PANDOC_STATE.input_files and PANDOC_STATE.input_files[1])
    or "."
  local input_dir = pandoc.path.directory(input_file)

  if pandoc.path.is_relative(input_dir) then
    input_dir = pandoc.path.join({ pandoc.system.get_working_directory(), input_dir })
  end

  local target = pandoc.path.join({ script_dir, "assets", image.src })
  image.src = pandoc.path.make_relative(target, input_dir, true)
  return image
end

function Math(math)
  -- Reveal.js accepts this size command, but PPTX math conversion does not.
  math.text = math.text:gsub("\\Huge%s*", "")
  if math.text:match("^\\overset{%?}{\\Longrightarrow}$") then
    return pandoc.Str("? ⟹")
  end
  return math
end

function Div(div)
  -- Quarto's grid layout has no PPTX renderer unless it is a float.
  -- Keep the images in source order instead of dropping the panel entirely.
  if div.attributes["layout-ncol"] then
    return div.content
  end

  -- A single illustrated wrapper can be flattened safely for PPTX.
  if #div.classes == 0 and div.attributes.style
    and #div.content == 1 and div.content[1].t == "Para"
    and #div.content[1].content == 1 and div.content[1].content[1].t == "Image" then
    return div.content
  end
end
