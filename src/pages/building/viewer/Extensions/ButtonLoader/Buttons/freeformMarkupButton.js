import { EXTENSIONS, TOOLBAR_BUTTON_IDS } from '../../viewerConstants';

export class FreeformMarkupButton extends Autodesk.Viewing.UI.Button {
  constructor(urn) {
    super(TOOLBAR_BUTTON_IDS.freeformMarkup);
    this.addClass(`fa`);
    this.setIcon(`fa-font`);
    this.setToolTip(`Freeform Markups`);
    this.addClass(`inactive`);

    const proto = this;
    this.onClick = e => {
      if ($(e.target).parent().hasClass(`inactive`)) {
        proto.addClass(`active`);
        proto.removeClass(`inactive`);
        NOP_VIEWER.loadExtension(EXTENSIONS.freeformMarkup, { urn });
      } else {
        proto.addClass(`inactive`);
        proto.removeClass(`active`);
        NOP_VIEWER.unloadExtension(EXTENSIONS.freeformMarkup);
      }
    };
  }
}
