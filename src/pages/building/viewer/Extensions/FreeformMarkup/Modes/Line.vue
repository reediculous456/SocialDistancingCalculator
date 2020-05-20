<template>
  <div>
    <div
      class="row"
      style="padding-top: 0.5rem;"
    >
      <h6>Size:</h6>
    </div>
    <div class="row">
      <fieldset>
        <div class="free-markup-radio-buttons">
          <div>
            <label>XS:</label>
            <input
              v-model="selectedSize"
              type="radio"
              value="xsSize"
            >
          </div>
          <div>
            <label>S:</label>
            <input
              v-model="selectedSize"
              type="radio"
              value="smSize"
            >
          </div>
          <div>
            <label>M:</label>
            <input
              v-model="selectedSize"
              type="radio"
              value="mdSize"
            >
          </div>
          <div>
            <label>L:</label>
            <input
              v-model="selectedSize"
              type="radio"
              value="lgSize"
            >
          </div>
        </div>
      </fieldset>
    </div>
  </div>
</template>

<script>
import { FREEFORM_MODES } from '../../viewerConstants';

export default {
  name: `line-markup-mode`,
  props: {
    urn: { type: Object, required: true },
  },
  data() {
    return {
      selectedSize: null,
    };
  },
  watch: {
    selectedSize(size) {
      localStorage.setItem(`${this.urn.id}_freeSize`, size);
      this.$emit(`size-changed`, size);
    },
  },
  created() {
    $(`#FreeformMarkupPanel`).css({ width: `300px` });
    $(`#FreeformMarkupPanel`).css({ height: `330px` });
    const buildingdSize = localStorage.getItem(`${this.urn.id}_freeSize`);
    this.selectedSize = buildingdSize ? buildingdSize : `smSize`;
    this.$parent.$on(`size-changed`, this.onSizeChanged);
    const that = this;
    this.$parent.$on(`change-mode`, (mode) => {
      if (mode === FREEFORM_MODES.FREE_LINE || mode === FREEFORM_MODES.POLYLINE) {
        that.$emit(`size-changed`, that.selectedSize);
      }
    });
  },
  methods: {
    onSizeChanged(size) {
      this.selectedSize = size;
    },
  },
};
</script>
