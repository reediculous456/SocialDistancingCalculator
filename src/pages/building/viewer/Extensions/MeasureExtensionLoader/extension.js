import { CUSTOM_TOOLBAR, EXTENSIONS } from '../viewerConstants';
import { MeasureExtension } from './itscMeasure/Measure';

export default class MeasureExtensionLoader extends Autodesk.Viewing.Extension {
  constructor(viewer, options) {
    super(viewer, options);
    Autodesk.Viewing.theExtensionManager.registerExtension(EXTENSIONS.itscMeasure, MeasureExtension);
    this.viewer = viewer;
    this.urn = options.urn;
  }

  load() {
    const toolProto = this;
    $(`#modelTools`).hide();
    setTimeout(() => {
      this.viewer.unloadExtension(EXTENSIONS.autodeskMeasure);
      this.viewer.getToolbar(false).removeControl(`measureTools`);
    }, 3000);

    setTimeout(() => {
      this.viewer.loadExtension(EXTENSIONS.itscMeasure, { urn: toolProto.urn }).then(measureExtension => {
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
