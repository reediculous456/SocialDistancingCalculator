import { EXTENSIONS, FREEFORM_MODES } from '../../viewerConstants';
// eslint-disable-next-line import/order
import { FreeformMarkupService } from '@/services';
// eslint-disable-next-line import/order
import toastr from '@/plugins/notifications';
const MARKUP_TYPE_ID_AREA = FREEFORM_MODES.MEASUREMENT;

// Copied from Autodesk
/* eslint-disable */

import { MeasureTool } from './MeasureTool';
import { CalibrationTool } from './CalibrationTool';
import { MagnifyingGlass } from './MagnifyingGlass';
import { CalibrationRequiredDialog } from './CalibrationPanels';
import { MeasureToolbar } from './MeasureToolbar';

import CSS_1 from './Measure.css'       // IMPORTANT!!
import CSS_2 from './Calibration.css'   // IMPORTANT!!

`use strict`;

var avem = AutodeskNamespace(`Autodesk.Viewing.Extensions.Measure`),
  av = Autodesk.Viewing,
  avp = Autodesk.Viewing.Private,
  avu = av.UI;
var MeasureCommon = Autodesk.Viewing.MeasureCommon; // Comes form main viewer bundle.

var NONE = 0;
var MEASURE_TOOL = 1;
var CALIBRATION_TOOL = 2;
var tool;

var DEFAULT_MEASUREMENT_TYPE = MeasureCommon.MeasurementTypes.MEASUREMENT_DISTANCE;

/**
 * Provides UI controls to perform distance and angle measurements for 2D and 3D models.
 *
 * The extension id is: `MeasureExtension`
 *
 * @example
 *   viewer.loadExtension('MeasureExtension')
 *
 * @memberof Autodesk.Viewing.Extensions
 * @alias Autodesk.Viewing.Extensions.MeasureExtension
 * @extends {Autodesk.Viewing.Extension}
 * @constructor
*/
export var MeasureExtension = function (viewer, options) {
  Autodesk.Viewing.Extension.call(this, viewer, options);
  this.modes = [`distance`, `angle`, `area`, `calibrate`];
  this.name = `measure`;
  // ITSC CODE
  /* eslint-enable */
  this.urn = options.urn;
  /* eslint-disable */
  // ITSC CODE
};

MeasureExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
MeasureExtension.prototype.constructor = MeasureExtension;


MeasureExtension.prototype.onToolbarCreated = function () {
  this.viewer.removeEventListener(av.TOOLBAR_CREATED_EVENT, this.bindedOnToolbarCreated);
  this.bindedOnToolbarCreated = null;
  this.createUI();
};

/**
 * Load the measure extension.
 * @returns {boolean} True if measure extension is loaded successfully.
 * @private
*/
MeasureExtension.prototype.load = function () {

  var self = this;
  tool = this;
  var viewer = this.viewer;
  this.hasUI = Autodesk.Viewing.Private.GuiViewer3D && viewer instanceof Autodesk.Viewing.Private.GuiViewer3D;

  this.escapeHotkeyId = `Autodesk.Measure.Hotkeys.Escape`;

  // Register the Measure tool
  if (!viewer.toolController) {
    return false;
  }

  this.options = this.options || {};
  var measureToolOptions = {};

  measureToolOptions.onCloseCallback = function () {
    self.enableMeasureTool(false);
  };

  // Shared State with measureTool & calibrationTool.
  // Gets populated when a model is received.
  this.sharedMeasureConfig = {
    units: null,
    precision: null,
    calibrationFactor: null
  };

  measureToolOptions.snapperOptions = this.options.snapperOptions;

  // ITSC CODE
  /* eslint-enable */
  measureToolOptions.urn = this.urn;
  /* eslint-disable */
  // ITSC CODE

  this.forceCalibrate = this.options.forceCalibrate;

  this.isCalibrated = (this.options.calibrationFactor != null);

  this.snapper = new MeasureCommon.Snapper(viewer, {
    renderSnappedTopology: false
  });
  viewer.toolController.registerTool(this.snapper);

  this.measureTool = new MeasureTool(viewer, measureToolOptions, this.sharedMeasureConfig, this.snapper);
  viewer.toolController.registerTool(this.measureTool);

  this.calibrationTool = new CalibrationTool(viewer, this.options, this.sharedMeasureConfig, this.snapper);
  viewer.toolController.registerTool(this.calibrationTool);

  this.magnifyingGlass = new MagnifyingGlass(viewer);
  viewer.toolController.registerTool(this.magnifyingGlass);

  this.onFinishedCalibration = function () {
    if (self.measureToolbar) {
      self.measureToolbar.updateSettingsPanel();
    }

    self.activateInitiator && self.activateInitiator();
  };

  viewer.addEventListener(`finished-calibration`, this.onFinishedCalibration);

  this.onMeasurementChanged = function (event) {
    var type = event.data.type;
    self.changeMeasurementType(type);
  };

  viewer.addEventListener(MeasureCommon.Events.MEASUREMENT_CHANGED_EVENT, this.onMeasurementChanged);

  if (viewer.model) {
    onModelLoaded(this, viewer.model);
  } else {
    viewer.addEventListener(av.MODEL_ROOT_LOADED_EVENT, function (event) {
      onModelLoaded(self, event.model);
    }, { once: true });
  }

  return true;
};

function onModelLoaded(measureExt, model) {
  populateSharedMeasureConfig(measureExt, model);

  if (measureExt.viewer.toolbar) {
    measureExt.createUI();
  } else {
    measureExt.bindedOnToolbarCreated = measureExt.onToolbarCreated.bind(measureExt);
    measureExt.viewer.addEventListener(av.TOOLBAR_CREATED_EVENT, measureExt.bindedOnToolbarCreated);
  }
}


function populateSharedMeasureConfig(measureExt, model) {
  measureExt.sharedMeasureConfig.units = model.getDisplayUnit();
  measureExt.sharedMeasureConfig.precision = model.is2d() ? 3 : 1;
  measureExt.sharedMeasureConfig.calibrationFactor = measureExt.options.calibrationFactor;
}

/**
 * Unload the measure extension.
 * @returns {boolean} True if measure extension is unloaded successfully.
 * @private
*/
MeasureExtension.prototype.unload = function () {
  var viewer = this.viewer;

  // Remove the ui from the viewer.
  this.destroyUI();
  if (this.bindedOnToolbarCreated) {
    this.viewer.removeEventListener(av.TOOLBAR_CREATED_EVENT, this.bindedOnToolbarCreated);
    this.bindedOnToolbarCreated = null;
  }

  viewer.removeEventListener(`finished-calibration`, this.onFinishedCalibration);
  viewer.removeEventListener(MeasureCommon.Events.MEASUREMENT_CHANGED_EVENT, this.onMeasurementChanged);

  viewer.toolController.deregisterTool(this.snapper);
  this.snapper = null;

  viewer.toolController.deregisterTool(this.measureTool);
  this.measureTool = null;

  viewer.toolController.deregisterTool(this.calibrationTool);
  this.calibrationTool = null;

  viewer.toolController.deregisterTool(this.magnifyingGlass);
  this.magnifyingGlass = null;

  return true;
};

/**
 * Enable/disable the measure tool.
 * It does not update the toolbar UI.
 *
 * @param {boolean} active - True to activate, false to deactivate.
 * @returns {boolean} True if a change in activeness occurred.
 */
MeasureExtension.prototype.setActive = function (active) {
  return this.enableMeasureTool(active);
};

/**
 * Toggles activeness of the measure tool.
 * It does not update the toolbar UI.
 *
 * @return {boolean} Whether the tool is active.
 */
MeasureExtension.prototype.toggle = function () {
  if (this.isActive()) {
    this.enableMeasureTool(false);
  } else {
    this.enableMeasureTool(true);
  }
  return this.isActive();
};

/**
 * Get the current measurement in the measure tool.
 * @param {string} [unitType] - Either: "decimal-ft", "ft", "ft-and-decimal-in", "decimal-in", "fractional-in", "m", "cm", "mm" or "m-and-cm".
 * @param {number} [precision] - precision index (0: 0, 1: 0.1, 2: 0.01, 3: 0.001, 4: 0.0001, 5: 0.00001).
 * When units type is "ft", "in" or "fractional-in", then the precisions are 0: 1, 1: 1/2, 2: 1/4, 3: 1/8, 4: 1/16, 5: 1/32, 6: 1/64.
 * @returns {object|null} Object with properties of the current measurement, or null.
 */
MeasureExtension.prototype.getMeasurement = function (unitType, precision) {
  var measurement = null;
  if (this.measureTool.isActive()) {
    measurement = this.measureTool.getMeasurement(unitType, precision);
  }
  return measurement;
};

/**
 * Get all available units in measure tool.
 * @returns {object[]} Array of all available units.
*/
MeasureExtension.prototype.getUnitOptions = function () {
  var units = [
    { name: `Unknown`, type: `` },
    { name: `Decimal feet`, type: `decimal-ft` },
    { name: `Feet and fractional inches`, type: `ft` },
    { name: `Feet and decimal inches`, type: `ft-and-decimal-in` },
    { name: `Decimal inches`, type: `decimal-in` },
    { name: `Fractional inches`, type: `fractional-in` },
    { name: `Meters`, type: `m` },
    { name: `Centimeters`, type: `cm` },
    { name: `Millimeters`, type: `mm` },
    { name: `Meters and centimeters`, type: `m-and-cm` }
  ];

  return units;
};

/**
 * Get all available precisions in measure tool.
 * @param {boolean} isFractional - Set true to get fractional precisions.
 * @return {string[]} List of all available precisions.
*/
MeasureExtension.prototype.getPrecisionOptions = function (isFractional) {

  var precisions;

  if (isFractional)
    precisions = [`1`, `1/2`, `1/4`, `1/8`, `1/16`, `1/32`, `1/64`];
  else
    precisions = [`0`, `0.1`, `0.01`, `0.001`, `0.0001`, `0.00001`];

  return precisions;
};

/**
 * Get the default measure unit in measure tool.
 * @returns {string} The default measure unit.
*/
MeasureExtension.prototype.getDefaultUnit = function () {
  var unit = this.viewer.model.getDisplayUnit();

  return unit;
};

MeasureExtension.prototype.openCalibrationRequiredDialog = function (initiator) {
  if (this.hasUI) {
    if (!this.CalibrationRequiredDialog) {
      this.CalibrationRequiredDialog = new CalibrationRequiredDialog(this, this.viewer, `calibration-required`, `Calibration Required`, this.options);
    }

    this.CalibrationRequiredDialog.setVisible(true);
  }
  else {
    this.viewer.dispatchEvent({ type: MeasureCommon.Events.CALIBRATION_REQUIRED_EVENT });
  }

  if (initiator === `measure`) {
    this.activateInitiator = function () {
      this.enableMeasureTool(true, DEFAULT_MEASUREMENT_TYPE);
      this.activateInitiator = null;
    };
  } else if (initiator === `dimension`) {
    this.activateInitiator = function () {
      this.viewer.dispatchEvent({ type: MeasureCommon.Events.FINISHED_CALIBRATION_FOR_DIMENSION_EVENT });
      this.activateInitiator = null;
    };
  }
};
/**
 * @param mode Measurement Mode
 * @returns {boolean}
 */

/**
 * Activates the tool and UI to start measuring.
 *
 * @param {string} [mode] - Either 'distance', 'angle', 'area' (2D only) or 'calibrate'. Default is 'distance'.
 */
MeasureExtension.prototype.activate = function (mode) {
  if (this.activeStatus && this.mode === mode) {
    return;
  }
  this.enterMeasurementMode();

  // ITSC CODE
  /* eslint-enable */
  NOP_VIEWER.unloadExtension(EXTENSIONS.changeRequestView);
  NOP_VIEWER.unloadExtension(EXTENSIONS.changeRequestCreate);
  NOP_VIEWER.unloadExtension(EXTENSIONS.freeformMarkup);
  NOP_VIEWER.unloadExtension(EXTENSIONS.viewAllMarkups);
  $(`#settingsTools`).hide();
  $(`#modelTools`).hide();
  $(`#macys-custom-toolbar`).hide();

  this.loadMarkups = function() {
    if (tool.measureTool.getMeasurementCount() === 0) {
      FreeformMarkupService.getAllByUrn({
        markupType: MARKUP_TYPE_ID_AREA,
        urn_id: this.urn.id,
      })
        .then(freeformMarkups => {
          for (const markup of freeformMarkups) {
            const measurement = markup.attributes;
            measurement.DatabaseID = markup.id;
            tool.measureTool.addMeasurement(measurement);
          }
        })
        .catch(() => {
          toastr.error(`An error occured while loading measure markups`);
        });
    }
  };
  /* eslint-disable */
  // ITSC CODE

  var success;

  switch (mode) {
    default:
    case `distance`:
      success = this.enableMeasureTool(true, MeasureCommon.MeasurementTypes.MEASUREMENT_DISTANCE);
      this.loadMarkups();
      break;
    case `angle`:
      success = this.enableMeasureTool(true, MeasureCommon.MeasurementTypes.MEASUREMENT_ANGLE);
      break;
    case `area`:
      if (!this.viewer.model.is2d()) {
        console.warn(`Area mode is applicable on 2D models only`);
      } else {
        success = this.enableMeasureTool(true, MeasureCommon.MeasurementTypes.MEASUREMENT_AREA);
        this.loadMarkups();
      }
      break;
    case `calibrate`:
      success = this.enableCalibrationTool(true);
      break;
  }

  this.mode = success ? mode : ``;
  this.activeStatus = true;
  return true;
};

/**
 * Deactivates measuring tool and UI.
 *
 * @returns {boolean}
 */
MeasureExtension.prototype.deactivate = function () {
  if (this.activeStatus) {
    this.exitMeasurementMode();
    this.enableMeasureTool(false);
    this.activeStatus = false;
  }
  return true;
};

/**
 * Enable/disable the measure tool.
 * @param {boolean} enable - True to enable, false to disable.
 * @returns {boolean} True if the tool state was changed.
 * @private
 */
MeasureExtension.prototype.enableMeasureTool = function (enable, measurementType) {
  if (measurementType === MeasureCommon.MeasurementTypes.MEASUREMENT_AREA && this.viewer.model && !this.viewer.model.is2d()) {
    return false;
  }

  var toolController = this.viewer.toolController,
    isActive = (this.selectedTool === MEASURE_TOOL);

  if (!this.viewer.model || (!enable && isActive)) {
    if (this.measureTool.isActive()) {
      toolController.deactivateTool(`measure`);

      if (this.measureToolbar) {
        this.measureToolbar.deactivateAllButtons();
      }
    }

    this.selectedTool = NONE;

    return true;
  }

  this.forceCalibrate |= this.viewer.model.getData().isLeaflet;

  if (!measurementType) {
    measurementType = DEFAULT_MEASUREMENT_TYPE;
  }

  if (enable && !isActive) {
    // Fetch topology when opening Measure tool for the first time.
    this.checkAndFetchTopology(toolController.getTool(`measure`));

    if (!this.forceCalibrate || (this.forceCalibrate && this.calibrationTool.isCalibrated()) || measurementType === MeasureCommon.MeasurementTypes.MEASUREMENT_ANGLE) {
      if (this.calibrationTool.isActive()) {
        toolController.deactivateTool(`calibration`);
      }

      if (this.measureToolbar) {
        this.measureToolbar.updateSettingsPanel();
      }

      toolController.activateTool(`measure`);

      this.selectedTool = MEASURE_TOOL;



      this.changeMeasurementType(measurementType);
      return true;
    }
    else {
      this.viewer.addEventListener(avem.OPEN_TOOL_AFTER_CALIBRAION, function () {
        this.enableMeasureTool(true);
      }.bind(this), { once: true });

      this.openCalibrationRequiredDialog(`measure`);
      return false;
    }

  } else if (enable && isActive) {
    if (!this.forceCalibrate || (this.forceCalibrate && this.calibrationTool.isCalibrated()) || measurementType === MeasureCommon.MeasurementTypes.MEASUREMENT_ANGLE) {
      this.changeMeasurementType(measurementType);
      return true;
    }
    else {
      this.openCalibrationRequiredDialog(`measure`);
      return false;
    }
  }

  return false;
};

MeasureExtension.prototype.changeMeasurementType = function (measurementType) {
  this.measureTool.changeMeasurementType(measurementType);
  if (this.measureToolbar) {
    this.measureToolbar.deactivateAllButtons();
    this.measureToolbar.activateButtonByType(measurementType);
  }
};

/**
 * Enable/disable the measure tool.
 * @param {boolean} enable - True to enable, false to disable.
 * @returns {boolean} True if the tool state was changed.
 * @private
 */
MeasureExtension.prototype.enableCalibrationTool = function (enable) {
  var toolController = this.viewer.toolController,
    isActive = (this.selectedTool == CALIBRATION_TOOL);

  if (enable && !isActive) {
    if (this.measureTool.isActive()) {
      toolController.deactivateTool(`measure`);
    }

    toolController.activateTool(`calibration`);
    this.viewer.dispatchEvent({ type: MeasureCommon.Events.UNITS_CALIBRATION_STARTS_EVENT });

    if (this.measureToolbar) {
      this.measureToolbar.deactivateAllButtons();
      this.measureToolbar.activateButtonByType(MeasureCommon.MeasurementTypes.CALIBRATION);
    }

    this.selectedTool = CALIBRATION_TOOL;
    return true;

  } else if (!enable && isActive) {
    if (this.calibrationTool.isActive()) {
      this.mode = ``;
      toolController.deactivateTool(`calibration`);
      if (this.measureToolbar) {
        this.measureToolbar.deactivateAllButtons();
      }
    }

    this.selectedTool = NONE;
    return true;
  }
  return false;
};

/**
 * @private
 */
MeasureExtension.prototype.enterMeasurementMode = function () {

  if (this._measurementMode) return;
  this._measurementMode = true;

  if (!this.viewer.getToolbar) {
    return; // Adds support for Viewer3D instance
  }

  var toolbar = this.viewer.getToolbar(false);
  var viewerToolbarContainer = toolbar.container;
  var viewerContainerChildrenCount = viewerToolbarContainer.children.length;
  for (var i = 0; i < viewerContainerChildrenCount; ++i) {
    viewerToolbarContainer.children[i].style.display = `none`;
  }

  this.navigationControls = toolbar.getControl(Autodesk.Viewing.TOOLBAR.NAVTOOLSID);
  this.navigationControls.setVisible(true);
  this.navigationControls.container.style.display = ``;

  this.measureControls = toolbar.getControl(Autodesk.Viewing.TOOLBAR.MEASURETOOLSID);
  this.measureControls.setVisible(true);
  this.measureControls.container.style.display = ``;

  var modelTools = toolbar.getControl(av.TOOLBAR.MODELTOOLSID);
  var measureButtonId = this.measurementToolbarButton.getId();
  this.measurementToolbarButton.index = modelTools.indexOf(measureButtonId);
  modelTools.removeControl(measureButtonId);

  this.measureToolbar.toggleVisible();

  if (this.viewer.centerToolBar) {
    this.viewer.centerToolBar();
  }

  this.enableMeasureTool(true, DEFAULT_MEASUREMENT_TYPE);
};

/**
 * @private
 */
MeasureExtension.prototype.exitMeasurementMode = function () {
  if (!this._measurementMode) return;
  this.measureToolbar && this.measureToolbar.closeToolbar();
  if (this.CalibrationRequiredDialog && this.CalibrationRequiredDialog.isVisible()) {
    this.CalibrationRequiredDialog.setVisible(false);
  }
  this._measurementMode = false;
};

/**
 * Create measure button in toolbar.
 * @private
*/
MeasureExtension.prototype.createUI = function () {
  var self = this;
  var viewer = this.viewer;

  var toolbar = viewer.getToolbar(true);

  // Add Measure button to toolbar
  var modelTools = toolbar.getControl(av.TOOLBAR.MODELTOOLSID);
  this.measurementToolbarButton = new avu.Button(`toolbar-measurementSubmenuTool`);
  this.measurementToolbarButton.setToolTip(`Measure`);
  this.measurementToolbarButton.setIcon(`adsk-icon-measure`);
  modelTools.measurementToolbarButton = this.measurementToolbarButton;
  modelTools.addControl(this.measurementToolbarButton, { index: 0 });

  this.measureToolbar = new MeasureToolbar(this);

  this.measureToolbar.init();

  this.measurementToolbarButton.onClick = this.activate.bind(this);

  // Escape hotkey to exit tool.
  //
  var hotkeys = [{
    keycodes: [
      Autodesk.Viewing.KeyCode.ESCAPE
    ],
    onRelease: function () {
      if (self._measurementMode) {
        self.exitMeasurementMode();
        return true;
      }
    }
  }];
  viewer.getHotkeyManager().pushHotkeys(this.escapeHotkeyId, hotkeys);

  // Finally
  this.uiCreated = true;
};


/**
 * @private
 */
MeasureExtension.prototype.checkAndFetchTopology = function (tool) {

  if (!this.uiCreated || !this.viewer.model.is3d()) {
    tool && tool.setNoTopology();
    return;
  }

  if (this.viewer.modelHasTopology()) {
    tool && tool.setTopologyAvailable();
    return;
  }

  // Fetch topology from backend.
  tool && tool.setFetchingTopology();
  this.viewer.model.fetchTopology()
    .then(function (topoData) {
      tool && tool.setTopologyAvailable();
    })
    .catch(function (err) {
      avp.logger.log(err); // No topology
      tool && tool.setNoTopology();
    });
};

/**
 * Destroy measure button in toolbar.
 * @private
*/
MeasureExtension.prototype.destroyUI = function () {
  var viewer = this.viewer;

  var toolbar = viewer && viewer.getToolbar && viewer.getToolbar(false);
  if (toolbar) {
    var modelTools = toolbar.getControl(av.TOOLBAR.MODELTOOLSID);
    if (modelTools) {
      var submenu = null;

      if (this.measurementToolbarButton) {
        submenu = modelTools.getControl(`toolbar-inspectSubMenu`);
        if (submenu) {
          submenu.removeControl(this.measurementToolbarButton.getId());
        } else {
          modelTools.removeControl(this.measurementToolbarButton.getId());
        }
      }

      this.measurementToolbarButton = null;
    }
  }

  viewer.getHotkeyManager().popHotkeys(this.escapeHotkeyId);
};

MeasureExtension.prototype.setUnits = function (units) {
  this.measureTool.setUnits(units);
};

MeasureExtension.prototype.getUnits = function () {
  return this.measureTool.getUnits();
};

MeasureExtension.prototype.setPrecision = function (precision) {
  this.measureTool.setPrecision(precision);
};

MeasureExtension.prototype.getPrecision = function () {
  return this.measureTool.getPrecision();
};

MeasureExtension.prototype.calibrate = function (requestedUnits, requestedSize) {
  this.calibrationTool.calibrate(requestedUnits, requestedSize);
};

MeasureExtension.prototype.calibrateByScale = function (requestedUnits, requestedScale) {
  this.calibrationTool.calibrateByScale(requestedUnits, requestedScale);
};

MeasureExtension.prototype.isCalibrationValid = function (requestedUnits, requestedSize) {
  return this.calibrationTool.isCalibrationValid(requestedUnits, requestedSize);
};

MeasureExtension.prototype.getCalibrationFactor = function () {
  return this.calibrationTool.getCalibrationFactor();
};

MeasureExtension.prototype.showAddCalibrationLabel = function () {
  this.calibrationTool.showAddCalibrationLabel();
};

MeasureExtension.prototype.deleteCurrentMeasurement = function () {
  this.measureTool.deleteCurrentMeasurement();
};

MeasureExtension.prototype.selectMeasurementById = function (id) {
  this.measureTool.selectMeasurementById(id);
};