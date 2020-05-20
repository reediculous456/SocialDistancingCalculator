import { COLORS, FONTS, ID_INCREMENT, STROKES } from './viewerConstants';

export function makeToolbarVisible() {
  const toolOptions = $(`#guiviewer3d-toolbar`).children();
  for (const toolOption of toolOptions) {
    $(toolOption).removeAttr(`style`);
  }
  $(`.homeViewWrapper`).removeAttr(`style`);
}

export function changeSelectionColor(THREE_COLOR) {
  NOP_VIEWER.set2dSelectionColor(THREE_COLOR);
}

export function setViewerStyle(markupTool, style = {}) {
  const styleObject = setSingleStyle(markupTool, style);
  markupTool.setStyle(styleObject);
}

export function setSingleStyle(
  markupTool,
  { fontSize = FONTS.SMALL_FONT_SIZE, strokeWidth = STROKES.SMALL_STROKE_WIDTH, color = COLORS.DEFAULT_RED },
) {
  const styleAttributes = [ `stroke-width`, `stroke-color`, `font-size` ];
  const nsu = Autodesk.Viewing.Extensions.Markups.Core.Utils;
  const styleObject = nsu.createStyle(styleAttributes, markupTool);
  styleObject[`stroke-color`] = color;
  styleObject[`font-size`] = fontSize;
  styleObject[`stroke-width`] = strokeWidth;
  return styleObject;
}

export function loadSingleMarkup(markup, markupTool, style = {}) {
  const MarkupsCore = Autodesk.Viewing.Extensions.Markups.Core;
  const text = new MarkupsCore.MarkupText(markup.id + ID_INCREMENT, markupTool, markup.text);
  markupTool.addMarkup(text);
  text.setSize({ x: markup.x, y: markup.y }, markup.width, markup.height);
  text.setText(markup.text);

  const styleObject = setSingleStyle(markupTool, style);
  text.setStyle(styleObject);
}

export function deleteMarkup(markupTool, markup) {
  if (markupTool) {
    markupTool.onMouseDown({ target: null });
    markupTool.selectMarkup(markup);
    markupTool.deleteMarkup(markup, false);
  }
}

export function detectMarkup(e) {
  return e.target.tagName === `svg` || e.target.tagName === `path` || $(e.target).hasClass(`selector-drag-point`) ||
    $(e.target).hasClass(`selector-box`) || e.target.tagName === `TEXTAREA` && $(e.target).attr(`id`) !== `freeText`;
}
