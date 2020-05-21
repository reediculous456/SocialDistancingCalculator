import Vue from 'vue';
import { CUSTOM_TOOLBAR, EXTENSIONS, TOOLBAR_BUTTON_IDS } from '../viewerConstants';
import NavigationPanel from './Panel';

export default class NavigationExtension extends Autodesk.Viewing.Extension {
  constructor(viewer, options) {
    super(viewer, options);
    this.viewer = viewer;
    this.urn = options.urn;
  }

  load() {
    this.NavigationPanel = new Autodesk.Viewing.UI.DockingPanel(
      this.viewer.container,
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
    $(this.NavigationPanel.container).on(`click`, `.docking-panel-close`, () => {
      this.viewer.unloadExtension(EXTENSIONS.navigationPanel);
    });
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

    return true;
  }

  unload() {
    const button = this.viewer.toolbar
      .getControl(CUSTOM_TOOLBAR)
      .getControl(TOOLBAR_BUTTON_IDS.navigationPanel);
    button.setState(Autodesk.Viewing.UI.Button.State.INACTIVE);
    $(this.NavigationPanel.container).remove();
    return true;
  }
}
