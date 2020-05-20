import { EXTENSIONS, TOOLBAR_BUTTON_IDS, TOOLBAR_BUTTONS } from '../viewerConstants';
import {
  addCreateChangeRequestHelpOptions,
  addFreeformMarkupHelpOptions,
  addViewAllMarkupHelpOptions,
  addViewChangeRequestHelpOptions,
} from './HelpOptions';

export default class HelpExtension extends Autodesk.Viewing.Extension {
  constructor(viewer) {
    super();
    Autodesk.Viewing.Extension.call(this, viewer);
  }

  load() {
    let markupHelpPanel;
    const MarkupPanel = $(`#MarkupHelpPanel`);
    if (!MarkupPanel.length) {
      markupHelpPanel = new Autodesk.Viewing.UI.PropertyPanel(NOP_VIEWER.container, `MarkupHelpPanel`, `Help`);
      markupHelpPanel.container.style.height = `330px`;
      markupHelpPanel.container.style.width = `390px`;
      markupHelpPanel.container.style.resize = `none`;
      markupHelpPanel.setVisible(true);

      this.addHelpOptions(markupHelpPanel);

      this.collapseAllOptions();

      $(`#MarkupHelpPanel`).find(`.docking-panel-footer-resizer`).remove();
      $(`#MarkupHelpPanel`).on(`click`, `.docking-panel-close`, () => {
        NOP_VIEWER.unloadExtension(EXTENSIONS.helpMenu);
      });
    }

    if (MarkupPanel && $(MarkupPanel).css(`display`) === `none`) {
      $(MarkupPanel).css(`display`, `block`);
    }

    return true;
  }

  unload() {
    $(`#MarkupHelpPanel`).css(`display`, `none`);
    TOOLBAR_BUTTONS[TOOLBAR_BUTTON_IDS.helpMenu].removeClass(`active`);
    TOOLBAR_BUTTONS[TOOLBAR_BUTTON_IDS.helpMenu].addClass(`inactive`);
    return true;
  }

  collapseAllOptions() {
    const options = $(`#MarkupHelpPanel`).find(`.treeview`).children();
    for (let i = 0; i < options.length; i += 1) {
      $(options[i]).removeClass(`expanded`);
      $(options[i]).addClass(`collapsed`);
    }
  }

  addHelpOptions(markupHelpPanel) {

    addViewAllMarkupHelpOptions(markupHelpPanel);

    addCreateChangeRequestHelpOptions(markupHelpPanel);

    addViewChangeRequestHelpOptions(markupHelpPanel);

    addFreeformMarkupHelpOptions(markupHelpPanel);
  }
}
