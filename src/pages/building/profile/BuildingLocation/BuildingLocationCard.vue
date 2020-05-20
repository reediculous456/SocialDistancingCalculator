<template>
  <b-card>
    <iframe
      height="400"
      frameborder="0"
      scrolling="no"
      marginheight="0"
      marginwidth="0"
      :src="mapSrc"
    />
  </b-card>
</template>

<script>
export default {
  name: `building-location-card`,
  props: {
    buildingProp: { type: Object, required: true },
  },
  computed: {
    mapSrc() {
      const { address } = this.buildingProp;
      // eslint-disable-next-line max-len
      return `https://maps.google.com/maps?q=${this.buildingProp.name},${address.street1},${address.city},${address.state.abbreviation},${address.zip_code}&output=embed`;
    },
  },
};
</script>
