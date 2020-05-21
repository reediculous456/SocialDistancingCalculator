import { EXTENSIONS, TOOLBAR_BUTTON_IDS } from '../../viewerConstants';

export class HelpButton extends Autodesk.Viewing.UI.Button {
  constructor() {
    super(TOOLBAR_BUTTON_IDS.helpMenu);
    this.addClass(`fa`);
    this.setIcon(`fa-question`);
    this.setToolTip(`Help`);

    this.onClick = () => {
      if (this.getState() === Autodesk.Viewing.UI.Button.State.ACTIVE) {
        NOP_VIEWER.unloadExtension(EXTENSIONS.helpMenu);
        this.setState(Autodesk.Viewing.UI.Button.State.INACTIVE);
      } else {
        NOP_VIEWER.loadExtension(EXTENSIONS.helpMenu);
        this.setState(Autodesk.Viewing.UI.Button.State.ACTIVE);
      }
    };
  }
}
