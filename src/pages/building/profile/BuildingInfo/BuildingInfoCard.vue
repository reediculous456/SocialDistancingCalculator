<template>
  <b-card v-if="contentReady">
    <b-table-simple striped>
      <b-tbody>
        <b-tr>
          <b-th>Campus</b-th>
          <b-td>
            {{ campus.name }}
          </b-td>
        </b-tr>
        <b-tr>
          <b-th>Street 1</b-th>
          <b-td>
            {{ buildingProp.address.street1 }}
          </b-td>
        </b-tr>
        <b-tr v-if="buildingProp.address.street2">
          <b-th>Street 2</b-th>
          <b-td>
            {{ buildingProp.address.street2 }}
          </b-td>
        </b-tr>
        <b-tr>
          <b-th>City</b-th>
          <b-td>
            {{ buildingProp.address.city }}
          </b-td>
        </b-tr>
        <b-tr>
          <b-th>State</b-th>
          <b-td>
            {{ buildingProp.address.state.name }}
          </b-td>
        </b-tr>
        <b-tr>
          <b-th>Zip Code</b-th>
          <b-td>
            {{ buildingProp.address.zip_code }}
          </b-td>
        </b-tr>
      </b-tbody>
    </b-table-simple>
  </b-card>
</template>

<script>
import { CampusService } from '@/services';

export default {
  name: `building-info-card`,
  props: {
    buildingProp: { type: Object, required: true },
  },
  data() {
    return {
      region: null,
      contentReady: false,
    };
  },
  async created() {
    this.campus = await CampusService.getById(this.buildingProp.campus_id);
    this.contentReady = true;
  },
};
</script>
