<template>
  <div>
    <div
      class="row"
      style="padding: 0.5rem 0;"
    >
      <h6>Size:</h6>
      <fieldset>
        <div class="free-markup-radio-buttons">
          <div>
            <label>XXS:</label>
            <input
              v-model="selectedSize"
              type="radio"
              value="xxsSize"
            >
          </div>
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
          <div>
            <label>XL:</label>
            <input
              v-model="selectedSize"
              type="radio"
              value="xlgSize"
            >
          </div>
          <div>
            <label>XXL:</label>
            <input
              v-model="selectedSize"
              type="radio"
              value="xxlgSize"
            >
          </div>
          <div>
            <label>3XL:</label>
            <input
              v-model="selectedSize"
              type="radio"
              value="xxxlgSize"
            >
          </div>
        </div>
      </fieldset>
    </div>
    <div class="row">
      <h6>
        Enter Text:
      </h6>
      <input
        v-model="freeText"
        type="text"
        class="form-control"
        placeholder="Enter your free text here..."
      >
    </div>
  </div>
</template>

<script>

export default {
  name: `text-markup-mode`,
  props: {
    urn: { type: Object, required: true },
  },
  data() {
    return {
      selectedSize: null,
      freeText: null,
    };
  },
  watch: {
    selectedSize(size) {
      localStorage.setItem(`${this.urn.id}_font`, size);
      this.$emit(`size-changed`, size);
    },
  },
  created() {
    $(`#FreeformMarkupPanel`).css({ width: `300px` });
    $(`#FreeformMarkupPanel`).css({ height: `420px` });
    const buildingdSize = localStorage.getItem(`${this.urn.id}_font`);
    this.selectedSize = buildingdSize ? buildingdSize : `smSize`;
    this.$parent.$on(`size-changed`, this.onSizeChanged);
    this.$parent.$on(`create-text`, this.onCreateText);
  },
  methods: {
    onSizeChanged(size) {
      this.selectedSize = size;
    },
    onCreateText(markup) {
      if (this.freeText) {
        markup.currentText = this.freeText;
        this.$emit(`text-created`, markup);
        this.freeText = null;
      }
    },
  },
};
</script>
