import { CUSTOM_TOOLBAR, EXTENSIONS, TOOLBAR_BUTTONS } from '../viewerConstants';
import AllMarkupExtension from '../ViewAllMarkups/extension';
import ChangeRequestTool from '../ChangeRequestCreate/extension';
import ChangeRequestView from '../ChangeRequestView/extension';
import FreeformTool from '../FreeformMarkup/extension';
import HelpExtension from '../HelpMenu/extension';
import NavigationExtension from '../NavigationPanel/extension';
import {
  ChangeRequestCreateButton,
  ChangeRequestViewButton,
  FreeformMarkupButton,
  HelpButton,
  NavigationButton,
  ViewAllMarkupsButton,
} from './Buttons';

export default class ButtonLoader extends Autodesk.Viewing.Extension {
  constructor(viewer, options) {
    super();
    Autodesk.Viewing.Extension.call(this, viewer);
    const ave = Autodesk.Viewing.theExtensionManager;
    ave.registerExtension(EXTENSIONS.changeRequestCreate, ChangeRequestTool);
    ave.registerExtension(EXTENSIONS.changeRequestView, ChangeRequestView);
    ave.registerExtension(EXTENSIONS.freeformMarkup, FreeformTool);
    ave.registerExtension(EXTENSIONS.viewAllMarkups, AllMarkupExtension);
    ave.registerExtension(EXTENSIONS.helpMenu, HelpExtension);
    ave.registerExtension(EXTENSIONS.navigationPanel, NavigationExtension);
    this.urn = options.urn;
  }

  load() {
    if (this.viewer.toolbar) {
      this.createButtons();
    }
    else {
      this.onToolbarCreatedBinded = this.onToolbarCreated.bind(this);
      this.viewer.addEventListener(av.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
    }
    return true;
  }

  onToolbarCreated() {
    this.viewer.removeEventListener(av.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
    this.onToolbarCreatedBinded = null;
    this.createButtons();
  }

  createButtons() {
    const buttons = [
      new FreeformMarkupButton(this.urn),
      new ChangeRequestCreateButton(this.urn),
      new ChangeRequestViewButton(this.urn),
      new ViewAllMarkupsButton(this.urn),
      new NavigationButton(this.urn),
      new HelpButton(),
    ];
    if (NOP_VIEWER.toolbar.getControl(CUSTOM_TOOLBAR) === null) {
      this.subToolbar = new Autodesk.Viewing.UI.ControlGroup(CUSTOM_TOOLBAR);
      for (const button of buttons) {
        TOOLBAR_BUTTONS[button._id] = button;
        this.subToolbar.addControl(button);
      }
      this.viewer.toolbar.addControl(this.subToolbar);
    }
    else {
      this.subToolbar = buttons[0].toolbar.getControl(CUSTOM_TOOLBAR);
      for (const button of buttons) {
        TOOLBAR_BUTTONS[button._id] = button;
        this.subToolbar.addControl(button);
      }
    }
  }
}
