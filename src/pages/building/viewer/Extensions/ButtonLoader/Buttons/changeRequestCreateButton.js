import { EXTENSIONS, TOOLBAR_BUTTON_IDS } from '../../viewerConstants';

export class ChangeRequestCreateButton extends Autodesk.Viewing.UI.Button {
  constructor(urn) {
    super(TOOLBAR_BUTTON_IDS.changeRequestCreate);
    this.addClass(`fa`);
    this.setIcon(`fa-hand-pointer-o`);
    this.setToolTip(`Create a Change Request`);
    this.addClass(`inactive`);

    const proto = this;
    this.onClick = e => {
      if ($(e.target).parent().hasClass(`inactive`)) {
        proto.addClass(`active`);
        proto.removeClass(`inactive`);
        NOP_VIEWER.loadExtension(EXTENSIONS.changeRequestCreate, { urn });
      } else {
        proto.addClass(`inactive`);
        proto.removeClass(`active`);
        NOP_VIEWER.unloadExtension(EXTENSIONS.changeRequestCreate);
      }
    };
  }
}
