import { EXTENSIONS, TOOLBAR_BUTTON_IDS } from '../../viewerConstants';

export class ChangeRequestCreateButton extends Autodesk.Viewing.UI.Button {
  constructor(urn) {
    super(TOOLBAR_BUTTON_IDS.changeRequestCreate);
    this.addClass(`fa`);
    this.setIcon(`fa-hand-pointer-o`);
    this.setToolTip(`Create a Change Request`);

    this.onClick = () => {
      if (this.getState() === Autodesk.Viewing.UI.Button.State.ACTIVE) {
        NOP_VIEWER.unloadExtension(EXTENSIONS.changeRequestCreate);
        this.setState(Autodesk.Viewing.UI.Button.State.INACTIVE);
      } else {
        NOP_VIEWER.loadExtension(EXTENSIONS.changeRequestCreate, { urn });
        this.setState(Autodesk.Viewing.UI.Button.State.ACTIVE);
      }
    };
  }
}
