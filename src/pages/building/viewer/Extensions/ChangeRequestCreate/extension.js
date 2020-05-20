import Vue from 'vue';
import { invert } from 'lodash';
import { CR_STATUSES } from 'Constants';
import { EXTENSIONS, TOOLBAR_BUTTON_IDS, TOOLBAR_BUTTONS } from '../viewerConstants';
import CreateChangeRequestPanel from './Panel';
import { ChangeRequestService } from '@/services';
import toastr from '@/plugins/notifications';

export default class ChangeRequestTool extends Autodesk.Viewing.Extension {
  constructor(viewer, options) {
    super();
    Autodesk.Viewing.Extension.call(this, viewer);
    this.urn = options.urn;
  }

  load() {
    NOP_VIEWER.unloadExtension(EXTENSIONS.changeRequestView);
    NOP_VIEWER.unloadExtension(EXTENSIONS.freeformMarkup);
    this.createPanel();
    return true;
  }

  unload() {
    TOOLBAR_BUTTONS[TOOLBAR_BUTTON_IDS.changeRequestCreate].addClass(`inactive`);
    TOOLBAR_BUTTONS[TOOLBAR_BUTTON_IDS.changeRequestCreate].removeClass(`active`);
    this.panel.$destroy();
    $(this.ChangeRequestPanel.container).remove();
    return true;
  }

  createPanel() {
    const toolPrototype = this;

    this.ChangeRequestPanel = new Autodesk.Viewing.UI.DockingPanel(
      NOP_VIEWER.container,
      `ChangeRequestCreationPanel`,
      `Select The Object(s)`,
    );
    this.ChangeRequestPanel.container.classList.add(`docking-panel-container-solid-color-a`);
    this.ChangeRequestPanel.container.style.top = `200px`;
    this.ChangeRequestPanel.container.style.left = `10px`;
    this.ChangeRequestPanel.container.style.height = `140px`;
    this.ChangeRequestPanel.container.style.resize = `none`;
    this.ChangeRequestPanel.container.style.width = `310px`;
    $(this.ChangeRequestPanel.container).append(`<div id="change-request-create-panel" />`);
    $(this.ChangeRequestPanel.container).find(`.docking-panel-close`).remove();
    $(this.ChangeRequestPanel.container).find(`.docking-panel-footer-resizer`).remove();

    this.panel = new Vue({
      el: `#change-request-create-panel`,
      render: h => h(CreateChangeRequestPanel, {
        props: {
          urn: this.urn,
        },
      }),
    });

    this.panel.$on(`submit-request`, toolPrototype.onSubmitRequest.bind(toolPrototype));

    this.ChangeRequestPanel.setVisible(true);
    NOP_VIEWER.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, this.onSelectionChange.bind(this));
  }

  onSelectionChange(event) {
    if (event.dbIdArray.length > 0) {
      this.ChangeRequestPanel.container.style.width = `330px`;
      this.ChangeRequestPanel.container.style.height = `270px`;
    }
    else {
      this.ChangeRequestPanel.container.style.width = `310px`;
      this.ChangeRequestPanel.container.style.height = `140px`;
    }
    this.panel.$emit(`selection-changed`, event.dbIdArray);
  }

  onSubmitRequest(object_ids, comment) {
    const toolPrototype = this;
    NOP_VIEWER.model.getExternalIdMapping((data) => {
      const selections = object_ids;
      const invertedData = invert(data);
      const attributes = [];

      for (let i = 0; i < selections.length; i += 1) {
        attributes.push({
          dbID: selections[i],
          externalID: invertedData[selections[i]],
        });
      }

      ChangeRequestService.create({
        attributes: JSON.stringify(attributes),
        created_on: new Date(),
        floor_id: toolPrototype.urn.floor_id,
      })
        .then(request => {
          ChangeRequestService.setStatus({
            comment,
            created_on: new Date(),
            id: request.id,
            status_id: CR_STATUSES.SUBMITTED,
          })
            .then(() => {
              toastr.success(`Succesfully created your change request!`);
              NOP_VIEWER.clearSelection();
            })
            .catch(() => {
              toastr.error(`There was an error submitting your change request`);
              ChangeRequestService.delete(request.id);
            });
        })
        .catch(() => {
          toastr.error(`There was an error in creating your change request`);
        });
    });
  }
}
