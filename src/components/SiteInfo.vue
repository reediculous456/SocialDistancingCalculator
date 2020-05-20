<template>
  <b-row class="site-info">
    <b-col>
      University of Cincinnati - Information Technology Solution Center
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: `site-info`,
};
</script>

<style lang="scss">
  .site-info {
    text-align: center;
    padding: 2em 0;

    a {
      text-decoration: none;
      color: #999;
      font-size: 0.8em;

      &:hover {
        color: #602f8d;
        text-decoration: underline;
      }
    }
  }
</style>
