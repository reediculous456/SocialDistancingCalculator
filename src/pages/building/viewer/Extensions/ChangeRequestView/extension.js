import Vue from 'vue';
import { CUSTOM_TOOLBAR, EXTENSIONS, THREE_BLUE_COLOR, THREE_RED_COLOR, TOOLBAR_BUTTON_IDS } from '../viewerConstants';
import { changeSelectionColor } from '../viewerFunctions';
import ChangeRequestViewPanel from './Panel';

export default class ChangeRequestView extends Autodesk.Viewing.Extension {
  constructor(viewer, options) {
    super(viewer, options);
    this.viewer = viewer;
    this.urn = options.urn;
    this.viewAllButtonId = `viewAllButton`;
    this.ViewAllButton =
    `<button id="${this.viewAllButtonId}" class="btn btn-secondary" style="float: right; margin-right: 1em;">
      View All
    </button>
    `;
  }

  load() {
    this.viewer.unloadExtension(EXTENSIONS.changeRequestCreate);
    this.viewer.unloadExtension(EXTENSIONS.freeformMarkup);
    this.createPanel();
    return true;
  }

  unload() {
    const button = this.viewer.toolbar
      .getControl(CUSTOM_TOOLBAR)
      .getControl(TOOLBAR_BUTTON_IDS.changeRequestView);
    button.setState(Autodesk.Viewing.UI.Button.State.INACTIVE);
    changeSelectionColor(THREE_BLUE_COLOR);
    this.viewer.clearSelection();
    this.panel.$destroy();
    $(this.ChangeRequestPanel.container).remove();
    return true;
  }

  createPanel() {
    const toolPrototype = this;

    this.ChangeRequestPanel = new Autodesk.Viewing.UI.DockingPanel(
      this.viewer.container,
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
    this.viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, this.onSelectionChange.bind(this));
    $(`#${this.viewAllButtonId}`).on(`mousedown`, this.onViewAllClick.bind(this));
  }

  onRequestClicked(object_ids) {
    changeSelectionColor(THREE_RED_COLOR);
    this.viewer.select(object_ids);
    this.viewer.fitToView(object_ids);
  }

  onSelectionChange(event) {
    this.panel.$emit(`selection-changed`, event.dbIdArray);
  }

  onViewAllClick() {
    this.panel.$emit(`view-all-button-clicked`);
  }
}
