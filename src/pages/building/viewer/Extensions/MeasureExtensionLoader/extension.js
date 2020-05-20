import { CUSTOM_TOOLBAR, EXTENSIONS } from '../viewerConstants';
import { MeasureExtension } from './itscMeasure/Measure';

export default class MeasureExtensionLoader extends Autodesk.Viewing.Extension {
  constructor(viewer, options) {
    super();
    Autodesk.Viewing.Extension.call(this, viewer);
    Autodesk.Viewing.theExtensionManager.registerExtension(EXTENSIONS.itscMeasure, MeasureExtension);
    this.urn = options.urn;
  }

  load() {
    const toolProto = this;
    $(`#modelTools`).hide();
    setTimeout(() => {
      NOP_VIEWER.unloadExtension(EXTENSIONS.autodeskMeasure);
      NOP_VIEWER.getToolbar(false).removeControl(`measureTools`);
    }, 3000);

    setTimeout(() => {
      NOP_VIEWER.loadExtension(EXTENSIONS.itscMeasure, { urn: toolProto.urn }).then(measureExtension => {
        $(`#modelTools`).hide();
        $(`#toolbar-measureTool-angle`).remove();

        measureExtension.setUnits(`decimal-ft`);
        if (!($(`#${CUSTOM_TOOLBAR}`).attr(`style`) === `display: none;`)) {
          $(`#modelTools`).show();
        }
      });
    }, 3000);

    return true;
  }

  unload() {
    return true;
  }
}
