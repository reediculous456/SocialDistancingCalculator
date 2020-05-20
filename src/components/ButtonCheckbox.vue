<template>
  <b-btn
    :variant="[ checked ? onColor : offColor ]"
    @click="handleButtonClick"
  >
    <i :class="[ checked ? onIcon : offIcon ]" /> {{ text }}
  </b-btn>
</template>

<script>
export default {
  name: `button-checkbox`,
  model: {
    event: `change`,
  },
  props: {
    buttonText: { type: String, required: true },
    offColor: { type: String, required: true },
    onColor: { type: String, required: true },
    value: Boolean,
  },
  data() {
    return {
      onIcon: `fa fa-check-square-o`,
      offIcon: `fa fa-square-o`,
      text: this.buttonText,
      checked: this.value,
    };
  },
  methods: {
    handleButtonClick() {
      this.checked = !this.checked;
      this.$emit(`change`, this.checked);
    },
  },
};
</script>
