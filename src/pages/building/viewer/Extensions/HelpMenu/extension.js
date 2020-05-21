import { CUSTOM_TOOLBAR, EXTENSIONS, TOOLBAR_BUTTON_IDS } from '../viewerConstants';
import {
  addCreateChangeRequestHelpOptions,
  addFreeformMarkupHelpOptions,
  addViewAllMarkupHelpOptions,
  addViewChangeRequestHelpOptions,
} from './HelpOptions';

export default class HelpExtension extends Autodesk.Viewing.Extension {
  constructor(viewer, options) {
    super(viewer, options);
    this.viewer = viewer;
  }

  load() {
    let markupHelpPanel;
    const MarkupPanel = $(`#MarkupHelpPanel`);
    if (!MarkupPanel.length) {
      markupHelpPanel = new Autodesk.Viewing.UI.PropertyPanel(this.viewer.container, `MarkupHelpPanel`, `Help`);
      markupHelpPanel.container.style.height = `330px`;
      markupHelpPanel.container.style.width = `390px`;
      markupHelpPanel.container.style.resize = `none`;
      markupHelpPanel.setVisible(true);

      this.addHelpOptions(markupHelpPanel);

      this.collapseAllOptions();

      $(`#MarkupHelpPanel`).find(`.docking-panel-footer-resizer`).remove();
      $(`#MarkupHelpPanel`).on(`click`, `.docking-panel-close`, () => {
        this.viewer.unloadExtension(EXTENSIONS.helpMenu);
      });
    }

    if (MarkupPanel && $(MarkupPanel).css(`display`) === `none`) {
      $(MarkupPanel).css(`display`, `block`);
    }

    return true;
  }

  unload() {
    $(`#MarkupHelpPanel`).css(`display`, `none`);
    const button = this.viewer.toolbar
      .getControl(CUSTOM_TOOLBAR)
      .getControl(TOOLBAR_BUTTON_IDS.helpMenu);
    button.setState(Autodesk.Viewing.UI.Button.State.INACTIVE);
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
