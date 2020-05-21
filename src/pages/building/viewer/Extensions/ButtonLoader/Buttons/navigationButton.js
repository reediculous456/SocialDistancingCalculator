import { EXTENSIONS, TOOLBAR_BUTTON_IDS } from '../../viewerConstants';

export class NavigationButton extends Autodesk.Viewing.UI.Button {
  constructor(urn) {
    super(TOOLBAR_BUTTON_IDS.navigationPanel);
    this.setToolTip(`Change Floor/Leave Viewer`);
    this.addClass(`fa`);
    this.setIcon(`fa-cube`);

    this.onClick = () => {
      if (this.getState() === Autodesk.Viewing.UI.Button.State.ACTIVE) {
        NOP_VIEWER.unloadExtension(EXTENSIONS.navigationPanel);
        this.setState(Autodesk.Viewing.UI.Button.State.INACTIVE);
      } else {
        NOP_VIEWER.loadExtension(EXTENSIONS.navigationPanel, { urn });
        this.setState(Autodesk.Viewing.UI.Button.State.ACTIVE);
      }
    };
  }
}
