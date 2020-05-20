<template>
  <b-modal
    id="set-change-request-status-modal"
    title="Change Request"
    size="lg"
  >
    <b-row>
      <b-col>
        <h4>Requested Changes:</h4>
        <p>{{ changes }}</p>
        <p>{{ requestProp.statuses[0].comment }}</p>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <h5>Add a comment to change the status:</h5>
        <b-textarea
          v-model="comment"
          rows="4"
          cols="50"
        />
      </b-col>
    </b-row>

    <template v-slot:modal-footer>
      <b-btn
        variant="secondary"
        @click="onSubmitClicked"
      >
        Submit
      </b-btn>
    </template>
  </b-modal>
</template>

<script>
export default {
  name: `set-change-request-status-modal`,
  props: {
    requestProp: { type: Object, required: true },
    statusProp: { type: Number, required: true },
  },
  data() {
    return {
      comment: null,
    };
  },
  computed: {
    changes() {
      const handles = this.requestProp.attributes.map(attribute => attribute.externalID);
      return handles.join(`, `);
    },
  },
  methods: {
    onSubmitClicked() {
      this.$emit(`comment-created`, this.requestProp, this.comment, this.statusProp);
      this.$bvModal.hide(`set-change-request-status-modal`);
      this.comment = null;
    },
  },
};
</script>
