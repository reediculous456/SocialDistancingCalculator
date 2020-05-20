<template>
  <div class="container-fluid">
    <div
      v-if="selectedObjects.length"
      class="row"
    >
      <div class="col">
        <div class="row">
          <h5>
            You have {{ selectedObjects.length }} {{ selectedObjects.length > 1 ? `objects` : `object` }} selected
          </h5>
        </div>
        <div class="row">
          <textarea
            v-model="message"
            class="form-control"
            style="resize: none; width: 270px; height: 87px; color: black;"
            rows="4"
            cols="25"
            placeholder="Please enter your change request here..."
          />
        </div>
        <div
          class="row float-right"
          style="padding-top: 0.5rem;"
        >
          <button
            class="btn btn-primary"
            @click="onSubmitButtonClick"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
    <div
      v-else
      class="row"
    >
      <div
        class="col"
        style="margin-left: 5%;"
      >
        <h5>
          You have 0 objects selected
        </h5>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: `change-request-create-panel`,
  props: {
    urn: { type: Object, required: true },
  },
  data() {
    return {
      selectedObjects: [],
      message: null,
    };
  },
  created() {
    this.$parent.$on(`selection-changed`, this.onSelectionChanged);
  },
  methods: {
    onSubmitButtonClick() {
      if (this.message) {
        this.$parent.$emit(`submit-request`, this.selectedObjects, this.message);
        this.selectedObjects = [];
        this.message = null;
      }
    },
    onSelectionChanged(object_ids) {
      this.selectedObjects = object_ids;
    },
  },
};
</script>

<style lang="scss">
  #ChangeRequestCreationPanel {
    .container-fluid {
      width: auto;
      padding: 0.5rem 2rem;
    }
  }
</style>
