<template>
  <div class="container">
    <div v-if="contentReady">
      <div class="row margin">
        <div class="col">
          <div class="page-header">
            <h2>
              {{ building.number }} - {{ building.name }}
              <small>Code: {{ building.code }}</small>
            </h2>
          </div>
        </div>
      </div>
      <div class="row margin">
        <div class="col-md-5">
          <file-upload-card :floors-prop="floors" />
        </div>
      </div>
      <div class="row margin">
        <div class="col">
          <change-request-card :building-prop="building" />
        </div>
      </div>
      <div class="row margin">
        <div class="col">
          <file-card :building-prop="building" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ChangeRequestCard from './ChangeRequest/ChangeRequestCard';
import FileCard from './Files/FileCard';
import FileUploadCard from './FileUpload/FileUploadCard';
import { BuildingService, FloorService } from '@/services';

export default {
  name: `floor-plan-mgmt-upload`,
  components: {
    FileUploadCard,
    ChangeRequestCard,
    FileCard,
  },
  data() {
    return {
      building: null,
      floors: null,
      contentReady: false,
    };
  },
  async created() {
    this.building = await BuildingService.getById(this.$route.params.building_id);
    this.floors = await FloorService.getForBuilding({ building_id: this.building.id, activeOnly: true });
    document.title = `${ this.building.number } - ${ this.building.name } Administration`;
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

  .margin {
    margin-bottom: 1rem;
  }
</style>
