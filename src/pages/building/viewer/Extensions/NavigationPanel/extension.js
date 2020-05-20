import Vue from 'vue';
import { EXTENSIONS, TOOLBAR_BUTTON_IDS, TOOLBAR_BUTTONS } from '../viewerConstants';
import NavigationPanel from './Panel';

export default class NavigationExtension extends Autodesk.Viewing.Extension {
  constructor(viewer, options) {
    super();
    Autodesk.Viewing.Extension.call(this, viewer);
    this.urn = options.urn;
  }

  load() {
    this.NavigationPanel = new Autodesk.Viewing.UI.DockingPanel(
      NOP_VIEWER.container,
      `NavigationPanel`,
      `Change Floors/Leave Viewer`,
    );
    this.NavigationPanel.container.classList.add(`docking-panel-container-solid-color-a`);
    this.NavigationPanel.container.style.top = `200px`;
    this.NavigationPanel.container.style.right = `10px`;
    this.NavigationPanel.container.style.overflow = `visible`;
    this.NavigationPanel.container.style.height = `200px`;
    this.NavigationPanel.container.style.width = `320px`;
    this.NavigationPanel.container.style.resize = `none`;
    $(this.NavigationPanel.container).find(`.docking-panel-footer-resizer`).remove();
    $(this.NavigationPanel.container).append(`<div id="navigation-panel" />`);

    this.panel = new Vue({
      el: `#navigation-panel`,
      render: h => h(NavigationPanel, {
        props: {
          urn: this.urn,
        },
      }),
    });

    this.NavigationPanel.setVisible(true);

    $(this.NavigationPanel.container).on(`click`, `.docking-panel-close`, () => {
      NOP_VIEWER.unloadExtension(EXTENSIONS.navigationPanel);
    });

    return true;
  }

  unload() {
    TOOLBAR_BUTTONS[TOOLBAR_BUTTON_IDS.navigationPanel].removeClass(`active`);
    TOOLBAR_BUTTONS[TOOLBAR_BUTTON_IDS.navigationPanel].addClass(`inactive`);
    this.panel.$destroy();
    $(this.NavigationPanel.container).remove();
    return true;
  }
}
