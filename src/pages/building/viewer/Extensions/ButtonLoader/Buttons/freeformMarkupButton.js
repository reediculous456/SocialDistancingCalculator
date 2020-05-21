import { EXTENSIONS, TOOLBAR_BUTTON_IDS } from '../../viewerConstants';

export class FreeformMarkupButton extends Autodesk.Viewing.UI.Button {
  constructor(urn) {
    super(TOOLBAR_BUTTON_IDS.freeformMarkup);
    this.addClass(`fa`);
    this.setIcon(`fa-font`);
    this.setToolTip(`Freeform Markups`);

    this.onClick = () => {
      if (this.getState() === Autodesk.Viewing.UI.Button.State.ACTIVE) {
        NOP_VIEWER.unloadExtension(EXTENSIONS.freeformMarkup);
        this.setState(Autodesk.Viewing.UI.Button.State.INACTIVE);
      } else {
        NOP_VIEWER.loadExtension(EXTENSIONS.freeformMarkup, { urn });
        this.setState(Autodesk.Viewing.UI.Button.State.ACTIVE);
      }
    };
  }
}
