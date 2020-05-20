import { EXTENSIONS, TOOLBAR_BUTTON_IDS } from '../../viewerConstants';

export class NavigationButton extends Autodesk.Viewing.UI.Button {
  constructor(urn) {
    super(TOOLBAR_BUTTON_IDS.navigationPanel);
    this.setToolTip(`Change Floor/Leave Viewer`);
    this.addClass(`fa`);
    this.setIcon(`fa-cube`);

    const proto = this;
    this.onClick = (e) => {
      if ($(e.target).parent().hasClass(`inactive`)) {
        proto.removeClass(`inactive`);
        proto.addClass(`active`);
        NOP_VIEWER.loadExtension(EXTENSIONS.navigationPanel, { urn });
      } else {
        proto.removeClass(`active`);
        proto.addClass(`inactive`);
        NOP_VIEWER.unloadExtension(EXTENSIONS.navigationPanel);
      }
    };
  }
}
