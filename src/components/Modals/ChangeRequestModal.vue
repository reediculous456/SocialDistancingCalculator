<template>
  <b-modal
    id="change-request-modal"
    title="Change Request"
    size="lg"
  >
    <b-row>
      <b-col>
        <h4>Requested Changes:</h4>
        <p>
          {{ changes }}
        </p>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h4>History:</h4>
      </b-col>
    </b-row>
    <b-row
      v-for="status in requestProp.statuses"
      :key="status.id"
    >
      <b-col>
        <h6>
          Status changed to {{ status.type.name }} by {{ status.creator.name }}
          on {{ formatDate(status.created_on) }}
        </h6>
        <p>
          {{ status.comment }}
        </p>
      </b-col>
    </b-row>
    <template v-slot:modal-footer="{ cancel }">
      <b-btn
        variant="secondary"
        @click="cancel()"
      >
        Close
      </b-btn>
    </template>
  </b-modal>
</template>

<script>
import moment from 'moment';

export default {
  name: `change-request-modal`,
  props: {
    requestProp: { type: Object, required: true },
  },
  computed: {
    changes() {
      const handles = this.requestProp.attributes.map(attribute => attribute.externalID);
      return handles.join(`, `);
    },
  },
  methods: {
    formatDate(date) {
      return moment(date).format(`MMMM Do YYYY, h:mm:ss a`);
    },
  },
};
</script>
