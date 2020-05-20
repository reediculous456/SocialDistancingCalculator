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
          :opts="options"
          :fields="fields"
          @showModal="onShowModal"
        />
        <change-request-modal
          v-if="currentRequest"
          :request-prop="currentRequest"
        />
      </b-card-body>
    </b-collapse>
  </b-card>
</template>

<script>
import moment from 'moment';
import ChangeRequestModal from '@/components/Modals/ChangeRequestModal';

export default {
  name: `change-request-card`,
  components: {
    ChangeRequestModal,
  },
  props: {
    buildingProp: { type: Object, required: true },
  },
  data() {
    return {
      currentRequest: null,
      options: {
        ajax: {
          url: `/api/change-request/building/${this.buildingProp.id}`,
          dataSrc: `data.requests`,
        },
        scrollY: 300,
        responsive: true,
        order: [[ 5, `asc` ]],
        buttons: [ `colvis` ],
      },
      fields: [
        { name: `ID`, data: `id` },
        { name: `Floor`, data: `floor.type.name` },
        {
          name: `Request`,
          data: `statuses`,
          render(data) {
            const [{ comment }] = data;
            return `<a href="#"
              data-action="showModal"
              data-toggle="modal"
              data-target="#change-request-modal"
              >${ comment.length > 25 ? `${comment.substr(0, 25)} ...` : comment }</a>`;
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
          data: `status`,
          render(data, type) {
            if (type === `sort`) { return data.status_id; }
            return data.type.name;
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
  },
};
</script>
