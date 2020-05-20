import Vue from 'vue';
import { EXTENSIONS, THREE_BLUE_COLOR, THREE_RED_COLOR, TOOLBAR_BUTTON_IDS, TOOLBAR_BUTTONS } from '../viewerConstants';
import { changeSelectionColor } from '../viewerFunctions';
import ChangeRequestViewPanel from './Panel';

export default class ChangeRequestView extends Autodesk.Viewing.Extension {
  constructor(viewer, options) {
    super();
    Autodesk.Viewing.Extension.call(this, viewer);
    this.urn = options.urn;
    this.viewAllButtonId = `viewAllButton`;
    this.ViewAllButton =
    `<button id="${this.viewAllButtonId}" class="btn btn-secondary" style="float: right; margin-right: 1em;">
      View All
    </button>
    `;
  }

  load() {
    NOP_VIEWER.unloadExtension(EXTENSIONS.changeRequestCreate);
    NOP_VIEWER.unloadExtension(EXTENSIONS.freeformMarkup);
    this.createPanel();
    return true;
  }

  unload() {
    TOOLBAR_BUTTONS[TOOLBAR_BUTTON_IDS.changeRequestView].addClass(`inactive`);
    TOOLBAR_BUTTONS[TOOLBAR_BUTTON_IDS.changeRequestView].removeClass(`active`);
    changeSelectionColor(THREE_BLUE_COLOR);
    NOP_VIEWER.clearSelection();
    this.panel.$destroy();
    $(this.ChangeRequestPanel.container).remove();
    return true;
  }

  createPanel() {
    const toolPrototype = this;

    this.ChangeRequestPanel = new Autodesk.Viewing.UI.DockingPanel(
      NOP_VIEWER.container,
      `ChangeRequestViewPanel`,
      `Active Change Requests`,
    );
    this.ChangeRequestPanel.container.classList.add(`docking-panel-container-solid-color-a`);
    this.ChangeRequestPanel.container.style.top = `200px`;
    this.ChangeRequestPanel.container.style.left = `10px`;
    this.ChangeRequestPanel.container.style.height = `495px`;
    this.ChangeRequestPanel.container.style[`min-height`] = `495px`;
    this.ChangeRequestPanel.container.style.width = `530px`;
    this.ChangeRequestPanel.container.style[`min-width`] = `530px`;
    $(this.ChangeRequestPanel.container).append(`<div id="change-request-view-panel" />`);
    $(this.ChangeRequestPanel.container).find(`.docking-panel-close`).remove();
    $(this.ChangeRequestPanel.container).find(`.docking-panel-title`).append(this.ViewAllButton);

    this.panel = new Vue({
      el: `#change-request-view-panel`,
      render: h => h(ChangeRequestViewPanel, {
        props: {
          urn: this.urn,
        },
      }),
    });

    this.panel.$on(`request-clicked`, toolPrototype.onRequestClicked.bind(toolPrototype));

    this.ChangeRequestPanel.setVisible(true);
    NOP_VIEWER.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, this.onSelectionChange.bind(this));
    $(`#${this.viewAllButtonId}`).on(`mousedown`, this.onViewAllClick.bind(this));
  }

  onRequestClicked(object_ids) {
    changeSelectionColor(THREE_RED_COLOR);
    NOP_VIEWER.select(object_ids);
    NOP_VIEWER.fitToView(object_ids);
  }

  onSelectionChange(event) {
    this.panel.$emit(`selection-changed`, event.dbIdArray);
  }

  onViewAllClick() {
    this.panel.$emit(`view-all-button-clicked`);
  }
}
