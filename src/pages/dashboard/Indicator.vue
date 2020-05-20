<template>
  <b-col class="indicator-col">
    <b-card :style="'background-color: ' + color">
      <div class="d-flex align-content-between flex-wrap h-100">
        <div class="w-100">
          <h5 class="card-title">
            {{ title }}
          </h5>
        </div>
        <div class="w-100 align-items-end">
          <p class="card-text">
            {{ value }} {{ label }}
          </p>
        </div>
      </div>
    </b-card>
  </b-col>
</template>

<script>
export default {
  name: `indicator`,
  props: {
    title: { type: String, required: true },
    value: { type: Number, required: true },
    color: { type: String, required: true },
    label: { type: String, default: null },
  },
};
</script>

<style lang="scss" scoped>
  .card {
    width: 100%;
    height: 90%;
  }

  .card-body {
    height: inherit;
  }

  .card-title {
    font-size: 1.3rem;
    margin-bottom: 0;
  }

  .card-text {
    font-size: 3rem;
    float: right;
  }

  .indicator-col {
    margin-right: 1rem;
  }
</style>
