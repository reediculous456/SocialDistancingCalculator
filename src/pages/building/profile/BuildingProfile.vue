<template>
  <b-container>
    <div v-if="contentReady">
      <b-row>
        <b-col>
          <div class="page-header">
            <h2>
              {{ building.number }} - {{ building.name }}
              <small>Code: {{ building.code }}</small>
            </h2>
          </div>
        </b-col>
      </b-row>
      <br>
      <b-row>
        <b-col cols="4">
          <building-info-card
            :building-prop="building"
            style="margin-bottom: 1.5rem;"
          />
          <building-location-card
            :building-prop="building"
            style="margin-bottom: 1.5rem;"
          />
        </b-col>
        <b-col cols="8">
          <floors-card :floors-prop="floors" />
          <change-request-card :building-prop="building" />
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script>
import BuildingInfoCard from './BuildingInfo/BuildingInfoCard';
import BuildingLocationCard from './BuildingLocation/BuildingLocationCard';
import ChangeRequestCard from './ChangeRequest/ChangeRequestCard';
import FloorsCard from './Floors/FloorsCard';
import { BuildingService, FloorService } from '@/services';

export default {
  name: `building-profile`,
  components: {
    BuildingInfoCard,
    BuildingLocationCard,
    FloorsCard,
    ChangeRequestCard,
  },
  data() {
    return {
      building: null,
      floors: [],
      user: null,
      contentReady: false,
    };
  },

  async created() {
    this.user = user;
    this.building = await BuildingService.getById(this.$route.params.building_id);
    this.floors = await FloorService.getForBuilding({ building_id: this.building.id, activeOnly: true });
    document.title = `${ this.building.number } - ${ this.building.name }`;
    this.contentReady = true;
  },
};
</script>

<style lang="scss">
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0 !important;
  }

  .page-header {
    border-bottom: 1px solid #c5c5c5;
  }
</style>
