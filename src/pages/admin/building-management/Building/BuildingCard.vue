<template>
  <b-col cols="6">
    <b-card
      :id="'building-'+ building.id"
      no-body
      :header-bg-variant="building.active ? undefined : 'danger'"
      :border-variant="building.active ? undefined : 'danger'"
      :header-text-variant="[ building.active ? 'dark' : 'white' ]"
    >
      <template v-slot:header>
        <b-card-title
          v-b-toggle="'building' + building.id"
          title-tag="span"
          class="accordion-title"
        >
          {{ building.name }}
        </b-card-title>
        <span
          @click="editMode = !editMode"
        >{{ editMode ? 'Cancel' : 'Edit' }}</span>
      </template>

      <b-collapse
        :id="'building'+building.id"
        v-model="open"
        :accordion="'buildingAccordion' + building.campus_id"
      >
        <b-card-body>
          <building-info
            v-if="!editMode"
            :building="building"
            :campus="campus"
          />
          <update-building
            v-if="editMode"
            :building-prop="building"
            @building-updated="onBuildingUpdated"
          />
          <div
            :id="'floorAccordion' + building.id"
            class="accordion"
          >
            <floor-card
              v-for="floor in building.floors"
              :key="floor.id"
              :floor-prop="floor"
              :building-prop="buildingInfo"
            />
            <new-floor
              v-if="building.active"
              :building-id="building.id"
              @created-floor="onNewFloor"
            />
          </div>
          <grid-loader
            class="loader"
            :color="loader.color"
            :loading="loader.loading"
          />
        </b-card-body>
      </b-collapse>
    </b-card>
  </b-col>
</template>

<script>
import { orderBy } from 'lodash';
import FloorCard from '../Floor/FloorCard';
import NewFloor from '../Floor/NewFloor';
import UpdateBuilding from './UpdateBuilding';
import BuildingInfo from './BuildingInfo';
import { FloorService } from '@/services';

export default {
  name: `building-card`,
  components: {
    BuildingInfo,
    UpdateBuilding,
    FloorCard,
    NewFloor,
  },
  props: {
    buildingProp: { type: Object, required: true },
    campusProp: { type: Object, required: true },
  },
  data() {
    return {
      loader: {
        loading: false,
        color: `#A70C0C`,
      },
      editMode: false,
      open: false,
      campus: this.campusProp,
      building: this.buildingProp,
      buildingInfo: { name: this.buildingProp.name, code: this.buildingProp.code },
    };
  },
  watch: {
    open(val) {
      if (val) {
        this.openCard();
      } else {
        this.editMode = false;
      }
    },
    editMode(val) {
      if (val && !this.open) {
        this.open = true;
      }
    },
    'building.active'(val) {
      if (!val) {
        this.building.floors.forEach(f => f.active = false);
      }
    },
  },
  methods: {
    async openCard() {
      try {
        this.loader.loading = true;
        let floors = await FloorService.getForBuilding({ building_id: this.building.id, activeOnly: false });
        floors = floors.map(s => Object.assign(s, { floors: [] }));
        floors = this.sortFloors(floors);
        this.building.floors = floors;
        this.loader.loading = false;
      } catch (error) {
        this.loader.loading = false;
        throw error;
      }
    },
    onBuildingUpdated(updatedBuilding) {
      updatedBuilding.floors = this.building.floors;
      if (updatedBuilding.campus_id !== this.building.campus_id) {
        this.$el.parentNode.removeChild(this.$el);
      } else {
        this.building = updatedBuilding;
        this.editMode = false;
      }
    },
    onNewFloor(newFloor) {
      this.building.floors.push(newFloor);
      this.building.floors = this.sortFloors(this.building.floors);
    },
    sortFloors(floors) {
      return orderBy(floors, [ `active`, `name` ], [ `desc`, `asc` ]);
    },
  },
};
</script>
