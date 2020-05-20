<template>
  <div class="container-fluid">
    <div style="padding-top: 1rem;">
      <select
        v-model="selectedFloor"
        class="form-control"
        @change="onChangedFloors"
      >
        <option
          v-for="floor in floors"
          :key="floor.id"
          :value="floor.id"
        >
          {{ floor.type.name }}
        </option>
      </select>
    </div>
    <div class="building-profile-button">
      <button
        class="form-control btn btn-success"
        @click="onBuildingProfileClick"
      >
        Building Profile Page
      </button>
    </div>
  </div>
</template>

<script>
import { FloorService } from '@/services';

export default {
  name: `navigation-panel`,
  props: {
    urn: { type: Object, required: true },
  },
  data() {
    return {
      floors: [],
      selectedFloor: this.urn.floor_id,
    };
  },
  async created() {
    this.floors = await FloorService.getForBuilding({
      building_id: this.urn.floor.building_id,
      activeOnly: true,
    });
  },
  methods: {
    onChangedFloors() {
      window.location.href = `/building/${this.selectedFloor}/viewer`;
    },
    onBuildingProfileClick() {
      window.location.href = `/building/${this.urn.floor.building_id}/profile`;
    },
  },
};
</script>

<style lang="scss">
  #NavigationPanel {
    .container-fluid {
      width: auto;
    }

    button {
      width: 60%;
      height: 100%;
      float: right;
    }

    .building-profile-button {
      padding: 1rem 0;
    }
  }
</style>
