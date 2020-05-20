<template>
  <b-card no-body>
    <template v-slot:header>
      <b-card-title
        v-b-toggle.changeRequestsPanel
        title-tag="h4"
      >
        Change Requests
      </b-card-title>
    </template>

    <b-collapse
      id="changeRequestsPanel"
      visible
    >
      <b-card-body>
        <datatable
          ref="table"
          :opts="options"
          :fields="fields"
          @showModal="onShowModal"
          @viewerLinkClicked="onViewerLinkClicked"
          @buttonClicked="onActionButtonClicked"
          @dropdownChange="onDropdownChange"
        />
        <change-request-modal
          v-if="currentRequest"
          :request-prop="currentRequest"
        />
        <set-change-request-status-modal
          v-if="currentRequest"
          :request-prop="currentRequest"
          :status-prop="selectedStatus"
          @comment-created="setStatus"
        />
      </b-card-body>
    </b-collapse>
  </b-card>
</template>

<script>
import { CR_STATUSES } from 'Constants';
import moment from 'moment';
import SetChangeRequestStatusModal from './Modals/SetChangeRequestStatusModal';
import ChangeRequestModal from '@/components/Modals/ChangeRequestModal';
import { ChangeRequestService } from '@/services';
import toastr from '@/plugins/notifications';

export default {
  name: `change-request-card`,
  components: {
    ChangeRequestModal,
    SetChangeRequestStatusModal,
  },
  props: {
    buildingProp: { type: Object, required: true },
  },
  data() {
    return {
      currentRequest: null,
      selectedStatus: null,
      options: {
        ajax: {
          url: `/api/change-request/building/${this.buildingProp.id}`,
          dataSrc: `data.requests`,
        },
        scrollY: 400,
        paging: true,
        responsive: true,
        order: [[ 5, `asc` ]],
      },
      fields: [
        { name: `ID`, data: `id` },
        {
          name: `Floor`,
          data: `floor.type.name`,
          render(data) {
            return `<a href="#" data-action="viewerLinkClicked">${data}</a>`;
          },
        },
        {
          name: `Request`,
          data: `statuses`,
          render(data) {
            const [{ comment }] = data;
            return `<a href="#"
              data-action="showModal"
              data-toggle="modal"
              data-target="#change-request-modal"
              >${ comment.length > 25 ? `${ comment.substr(0, 25) }...` : comment }</a>`;
          },
        },
        { name: `Created By`, data: `creator.name` },
        {
          name: `Created On`,
          data: `created_on`,
          render(data, type) {
            if (type === `sort`) { return data; }
            return moment(data).format(`MMMM Do YYYY, h:mm:ss a`);
          },
        },
        {
          name: `Status`,
          data: `status.status_id`,
          width: `auto`,
          searchable: false,
          render(data, type) {
            if (type === `sort`) { return data; }
            return data === CR_STATUSES.COMPLETED ? `Complete` :
              `<select class="form-control" style="width: auto;" data-change="dropdownChange">
              <option ${data === CR_STATUSES.SUBMITTED ? `selected` : ``}
                value="${CR_STATUSES.SUBMITTED}">Submitted</option>
              <option ${data === CR_STATUSES.IN_PROGRESS ? `selected` : ``}
                value="${CR_STATUSES.IN_PROGRESS}">In Progress</option>
              </select>`;
          },
        },
        {
          name: ` `,
          data: `status.status_id`,
          searchable: false,
          sortable: false,
          render(data) {
            return `<button data-action="buttonClicked"
            ${data === CR_STATUSES.COMPLETED ? `class="btn btn-secondary"` : `class="btn btn-success"`}>
            ${data === CR_STATUSES.COMPLETED ? `Reactivate` : `Complete` }</button>`;
          },
        },
      ],
    };
  },
  methods: {
    onShowModal(data) {
      this.currentRequest = data;
      setTimeout(() => {
        this.$bvModal.show(`change-request-modal`);
      }, 100);
    },
    onViewerLinkClicked(data) {
      this.$router.push(`/building/${data.floor_id}/viewer`);
    },
    onActionButtonClicked(data) {
      this.selectedStatus = data.status.status_id === CR_STATUSES.COMPLETED ?
        CR_STATUSES.SUBMITTED : CR_STATUSES.COMPLETED;
      this.currentRequest = data;
      setTimeout(() => {
        this.$bvModal.show(`set-change-request-status-modal`);
      }, 500);
    },
    onDropdownChange(data, selection) {
      this.currentRequest = data;
      this.selectedStatus = selection;
      setTimeout(() => {
        this.$bvModal.show(`set-change-request-status-modal`);
      }, 500);
    },
    async setStatus(request, comment, status_id) {
      if (comment) {
        await ChangeRequestService.setStatus({
          id: request.id,
          status_id,
          comment,
          created_on: new Date(),
        });
        toastr.success(`Updated CR Status`);
      } else {
        toastr.error(`You must provide a comment`);
      }
      this.$refs.table.reload();
    },
  },
};
</script>
