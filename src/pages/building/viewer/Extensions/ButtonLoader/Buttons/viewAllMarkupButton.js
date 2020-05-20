import { EXTENSIONS, TOOLBAR_BUTTON_IDS } from '../../viewerConstants';

export class ViewAllMarkupsButton extends Autodesk.Viewing.UI.Button {
  constructor(urn) {
    super(TOOLBAR_BUTTON_IDS.viewAllMarkups);
    this.addClass(`fa`);
    this.setIcon(`fa-eye`);
    this.setToolTip(`View All Markups`);

    const proto = this;
    this.onClick = e => {
      if ($(e.target).parent().hasClass(`inactive`)) {
        proto.addClass(`active`);
        proto.removeClass(`inactive`);
        NOP_VIEWER.loadExtension(EXTENSIONS.viewAllMarkups, { urn });
      } else {
        proto.addClass(`inactive`);
        proto.removeClass(`active`);
        NOP_VIEWER.unloadExtension(EXTENSIONS.viewAllMarkups);
      }
    };
  }
}
