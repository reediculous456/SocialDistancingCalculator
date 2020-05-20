<template>
  <div class="container-fluid">
    <div class="row">
      <h5> Change Markup Mode: </h5>
    </div>
    <div class="row">
      <select
        v-model="selectedMode"
        class="form-control"
        @change="onSelectedModeChanged"
      >
        <option
          v-for="mode in markupModes"
          :key="mode.type"
          :value="mode.type"
        >
          {{ mode.name }}
        </option>
      </select>
    </div>
    <text-mode
      v-if="selectedMode === FREEFORM_MODES.TEXT"
      :urn="urn"
      @size-changed="onSizeChanged"
      @text-created="onTextCreated"
    />
    <line-mode
      v-if="selectedMode === FREEFORM_MODES.FREE_LINE || selectedMode === FREEFORM_MODES.POLYLINE"
      :urn="urn"
      @size-changed="onSizeChanged"
    />
    <br>
    <div class="row float-right">
      <button
        class="btn btn-primary"
        @click="onCloseButtonClick"
      >
        Close Panel
      </button>
    </div>
  </div>
</template>

<script>
import { FONTS, FREEFORM_MODES, STROKES } from '../viewerConstants';
import LineMode from './Modes/Line';
import TextMode from './Modes/Text';

export default {
  name: `freeform-markup-panel`,
  components: {
    TextMode,
    LineMode,
  },
  props: {
    urn: { type: Object, required: true },
  },
  data() {
    return {
      FREEFORM_MODES,
      markupModes: [
        {
          type: FREEFORM_MODES.TEXT,
          name: `Text`,
        },
        {
          type: FREEFORM_MODES.FREE_LINE,
          name: `Freeform Line`,
        },
        {
          type: FREEFORM_MODES.POLYLINE,
          name: `Polygon/Straight Line`,
        },
      ],
      selectedMode: FREEFORM_MODES.TEXT,
    };
  },
  created() {
    this.$parent.$on(`mode-changed`, this.onModeChanged);
    this.$parent.$on(`create-text`, this.onCreateText);
    this.$parent.$on(`selection-changed`, this.onSelectionChanged);
  },
  methods: {
    onSelectedModeChanged() {
      this.$parent.$emit(`change-mode`, this.selectedMode);
      this.$emit(`change-mode`, this.selectedMode);
    },
    onModeChanged(mode) {
      this.selectedMode = mode;
    },
    onSelectionChanged(selection) {
      let size;
      if (selection.type === `label`) {
        size = selection.style[`font-size`];
      } else if (selection.type === `freehand` || selection.type === `polyline`) {
        size = selection.style[`stroke-width`];
      }
      size = size.toFixed(5);

      switch (size) {
        case FONTS.EXTRA_EXTRA_SMALL_FONT_SIZE.toFixed(5):
          size = `xxsSize`;
          break;
        case FONTS.EXTRA_SMALL_FONT_SIZE.toFixed(5):
        case STROKES.EXTRA_SMALL_STROKE_WIDTH.toFixed(5):
          size = `xsSize`;
          break;
        case FONTS.SMALL_FONT_SIZE.toFixed(5):
        case STROKES.SMALL_STROKE_WIDTH.toFixed(5):
          size = `smSize`;
          break;
        case FONTS.MEDIUM_FONT_SIZE.toFixed(5):
        case STROKES.DEFAULT_STROKE_WIDTH.toFixed(5):
          size = `mdSize`;
          break;
        case FONTS.LARGE_FONT_SIZE.toFixed(5):
        case STROKES.LARGE_STROKE_WIDTH.toFixed(5):
          size = `lgSize`;
          break;
        case FONTS.X_LARGE_FONT_SIZE.toFixed(5):
          size = `xlgSize`;
          break;
        case FONTS.XX_LARGE_FONT_SIZE.toFixed(5):
          size = `xxlgSize`;
          break;
        default:
          size = null;
          break;
      }

      this.$emit(`size-changed`, size);
    },
    onSizeChanged(size) {
      this.$parent.$emit(`size-changed`, size);
    },
    onCloseButtonClick() {
      this.$parent.$emit(`closed`);
    },
    onCreateText(markup) {
      this.$emit(`create-text`, markup);
    },
    onTextCreated(markup) {
      this.$parent.$emit(`text-created`, markup);
    },
  },
};
</script>

<style lang="scss">
  #FreeformMarkupPanel {
    input {
      font-size: 1em !important;
    }

    .container-fluid {
      width: auto;
      padding: 1.5rem 3rem;
    }

    .free-markup-radio-buttons {
      display: flex;
      justify-content: space-between;
      width: 95%;
      text-align: center;

      label {
        color: white;
      }
    }
  }
</style>
