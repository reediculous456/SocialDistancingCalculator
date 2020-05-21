import Vue from 'vue';
import {
  COLORS, CUSTOM_TOOLBAR, EXTENSIONS, FREEFORM_MODES,
  ID_INCREMENT, TOOLBAR_BUTTON_IDS,
} from '../viewerConstants';
import { loadSingleMarkup, makeToolbarVisible, setSingleStyle } from '../viewerFunctions';
import ViewAllMarkupsPanel from './Panel';
import toastr from '@/plugins/notifications';

export default class AllMarkupExtension extends Autodesk.Viewing.Extension {
  constructor(viewer, options) {
    super(viewer, options);
    this.viewer = viewer;
    this.urn = options.urn;
  }

  load() {
    this.viewer.unloadExtension(EXTENSIONS.freeformMarkup);
    this.viewer.loadExtension(EXTENSIONS.markupsCore)
      .then(this.showMarkupChoicesPanel());
    return true;
  }

  unload() {
    this.viewer.unloadExtension(EXTENSIONS.markupsCore);
    const button = this.viewer.toolbar
      .getControl(CUSTOM_TOOLBAR)
      .getControl(TOOLBAR_BUTTON_IDS.viewAllMarkups);
    button.setState(Autodesk.Viewing.UI.Button.State.INACTIVE);
    this.panel.$destroy();
    return true;
  }

  showMarkupChoicesPanel() {
    const modalDiv = document.createElement(`div`);
    modalDiv.setAttribute(`id`, `view-all-markups-panel`);
    document.body.appendChild(modalDiv);

    this.panel = new Vue({
      el: `#view-all-markups-panel`,
      render: h => h(ViewAllMarkupsPanel, {
        props: {
          urn: this.urn,
        },
      }),
    });

    this.panel.$on(`recieved-markups`, this.onViewButtonClick.bind(this));
    this.panel.$on(`closed`, this.onCloseButtonClick.bind(this));
    this.panel.$bvModal.show(`view-options-modal`);
  }

  onCloseButtonClick() {
    this.viewer.unloadExtension(EXTENSIONS.viewAllMarkups);
  }

  loadSingleTextMarkup(markup, markupTool) {
    const styleObject = { color: COLORS.FREEFORM_GREEN, fontSize: markup.size };

    const markupObject = {
      height: markup.height,
      id: markup.id,
      text: markup.text || markup.attributes.text,
      width: markup.width,
      x: markup.x,
      y: markup.y,
    };

    loadSingleMarkup(markupObject, markupTool, styleObject);
  }

  loadSingleFreehandMarkup(markup, markupTool) {
    const MarkupsCore = Autodesk.Viewing.Extensions.Markups.Core;
    const line = new MarkupsCore.MarkupFreehand(markup.id + ID_INCREMENT, markupTool);
    line.locations = markup.attributes;
    markupTool.addMarkup(line);
    line.position = { x: markup.x, y: markup.y };
    line.size = { x: markup.width, y: markup.height };

    const styleObject = setSingleStyle(markupTool, { color: COLORS.FREEFORM_GREEN, strokeWidth: markup.size });
    line.setStyle(styleObject);
  }

  loadSinglePolylineMarkup(markup, markupTool) {
    const MarkupsCore = Autodesk.Viewing.Extensions.Markups.Core;

    const line = new MarkupsCore.MarkupPolyline(markup.id + ID_INCREMENT, markupTool);
    const properties = markup.attributes;
    line.locations = properties.locations;
    line.closed = properties.closed;
    markupTool.addMarkup(line);
    line.position = { x: markup.x, y: markup.y };
    line.size = { x: markup.width, y: markup.height };

    const styleObject = setSingleStyle(markupTool, { color: COLORS.FREEFORM_GREEN, strokeWidth: markup.size });
    line.setStyle(styleObject);
  }

  onViewButtonClick(freeformMarkups) {
    const markupTool = this.viewer.getExtension(EXTENSIONS.markupsCore);

    if (freeformMarkups.length) {
      markupTool.enterEditMode();
      markupTool.clear();
      for (const markup of freeformMarkups) {
        if (markup.type_id === FREEFORM_MODES.TEXT) {
          this.loadSingleTextMarkup(markup, markupTool, `freeform`);
        } else if (markup.type_id === FREEFORM_MODES.FREE_LINE) {
          this.loadSingleFreehandMarkup(markup, markupTool);
        } else if (markup.type_id === FREEFORM_MODES.POLYLINE) {
          this.loadSinglePolylineMarkup(markup, markupTool);
        }
      }
      markupTool.leaveEditMode();
      markupTool.loadMarkups(markupTool.generateData(), `markups-svg`);
      makeToolbarVisible();
    } else {
      toastr.warning(`No markups to load!`);
      makeToolbarVisible();
      this.viewer.unloadExtension(EXTENSIONS.viewAllMarkups);
    }

    this.panel.$bvModal.hide(`view-options-modal`);
  }
}
