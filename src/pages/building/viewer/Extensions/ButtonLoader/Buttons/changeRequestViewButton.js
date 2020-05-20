import { EXTENSIONS, TOOLBAR_BUTTON_IDS } from '../../viewerConstants';

export class ChangeRequestViewButton extends Autodesk.Viewing.UI.Button {
  constructor(urn) {
    super(TOOLBAR_BUTTON_IDS.changeRequestView);
    this.addClass(`fa`);
    this.setIcon(`fa-list-ol`);
    this.setToolTip(`View Change Requests`);
    this.addClass(`inactive`);

    const proto = this;
    this.onClick = e => {
      if ($(e.target).parent().hasClass(`inactive`)) {
        proto.addClass(`active`);
        proto.removeClass(`inactive`);
        NOP_VIEWER.loadExtension(EXTENSIONS.changeRequestView, { urn });
      } else {
        proto.addClass(`inactive`);
        proto.removeClass(`active`);
        NOP_VIEWER.unloadExtension(EXTENSIONS.changeRequestView);
      }
    };
  }
}
