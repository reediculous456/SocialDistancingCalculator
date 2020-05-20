import { EXTENSIONS, TOOLBAR_BUTTON_IDS } from '../../viewerConstants';

export class HelpButton extends Autodesk.Viewing.UI.Button {
  constructor() {
    super(TOOLBAR_BUTTON_IDS.helpMenu);
    this.addClass(`fa`);
    this.setIcon(`fa-question`);
    this.setToolTip(`Help`);
    this.addClass(`inactive`);

    const proto = this;
    this.onClick = (e) => {
      if ($(e.target).parent().hasClass(`inactive`)) {
        proto.removeClass(`inactive`);
        proto.addClass(`active`);
        NOP_VIEWER.loadExtension(EXTENSIONS.helpMenu);
      } else {
        proto.removeClass(`active`);
        proto.addClass(`inactive`);
        NOP_VIEWER.unloadExtension(EXTENSIONS.helpMenu);
      }
    };
  }
}
