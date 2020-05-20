<template>
  <b-modal
    id="view-options-modal"
    title="View Options"
    size="sm"
    no-close-on-esc
    no-close-on-backdrop
    hide-header-close
    @cancel="onCloseButtonClick"
  >
    <b-input-group class="mb-3">
      <b-input-group-prepend>
        <b-input-group-text>
          <input
            v-model="includeFreeformMarkups"
            type="checkbox"
            checked
          >
        </b-input-group-text>
      </b-input-group-prepend>

      <b-form-input
        value="Freeform Markups"
        disabled
      />
    </b-input-group>

    <template v-slot:modal-footer="{ cancel }">
      <b-btn
        variant="secondary"
        @click="cancel()"
      >
        Close
      </b-btn>
      <b-btn
        variant="primary"
        @click="onViewButtonClick"
      >
        View
      </b-btn>
    </template>
  </b-modal>
</template>

<script>
import { FreeformMarkupService } from '@/services';

export default {
  name: `view-all-markups-panel`,
  props: {
    urn: { type: Object, required: true },
  },
  data() {
    return {
      includeFreeformMarkups: true,
    };
  },
  computed: {
    disableViewButton() {
      return !this.includeFreeformMarkups;
    },
  },
  methods: {
    async onViewButtonClick() {
      const freeformMarkups = await FreeformMarkupService.getAllByUrn({ urn_id: this.urn.id });

      this.$parent.$emit(`recieved-markups`, freeformMarkups);
    },
    onCloseButtonClick() {
      this.$parent.$emit(`closed`);
    },
  },
};
</script>

<style lang="scss">
  #view-options-modal {
    overflow-y: scroll;

    .modal-dialog {
      overflow-y: initial !important;
    }

    .modal-header {
      background-color: darkgrey;
      color: white;
    }

    .modal-body {
      height: 50%;
      overflow-y: auto;
    }

    .mb-3 {
      margin-bottom: 0.3rem !important;
    }
  }
</style>
