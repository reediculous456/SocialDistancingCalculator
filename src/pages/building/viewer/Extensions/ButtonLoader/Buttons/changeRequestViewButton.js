import { EXTENSIONS, TOOLBAR_BUTTON_IDS } from '../../viewerConstants';

export class ChangeRequestViewButton extends Autodesk.Viewing.UI.Button {
  constructor(urn) {
    super(TOOLBAR_BUTTON_IDS.changeRequestView);
    this.addClass(`fa`);
    this.setIcon(`fa-list-ol`);
    this.setToolTip(`View Change Requests`);

    this.onClick = () => {
      if (this.getState() === Autodesk.Viewing.UI.Button.State.ACTIVE) {
        NOP_VIEWER.unloadExtension(EXTENSIONS.changeRequestView);
        this.setState(Autodesk.Viewing.UI.Button.State.INACTIVE);
      } else {
        NOP_VIEWER.loadExtension(EXTENSIONS.changeRequestView, { urn });
        this.setState(Autodesk.Viewing.UI.Button.State.ACTIVE);
      }
    };
  }
}
