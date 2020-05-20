<template>
  <b-card
    :id="'floor-' + floor.id"
    no-body
    :header-bg-variant="floor.active ? 'dark' : 'danger'"
    :border-variant="floor.active ? 'dark' : 'danger'"
    header-text-variant="white"
  >
    <template v-slot:header>
      <b-card-title
        v-b-toggle="'floor' + floor.id"
        title-tag="span"
        class="accordion-title"
      >
        {{ floor.fname }}
      </b-card-title>
      <span
        @click="editMode = !editMode"
      >{{ editMode ? 'Cancel' : 'Edit' }}</span>
    </template>

    <b-collapse
      :id="'floor'+floor.id"
      v-model="open"
      :accordion="'floorAccordion' + floor.building_id"
    >
      <b-card-body>
        <floor-info
          v-if="!editMode"
          :floor="floor"
          :building="building"
        />
        <update-floor
          v-if="editMode"
          :floor-prop="floor"
          @floor-updated="onFloorUpdated"
        />
      </b-card-body>
    </b-collapse>
  </b-card>
</template>

<script>
import FloorInfo from './FloorInfo';
import UpdateFloor from './UpdateFloor';

export default {
  name: `floor-card`,
  components: {
    FloorInfo,
    UpdateFloor,
  },
  props: {
    floorProp: { type: Object, required: true },
    buildingProp: { type: Object, required: true },
  },
  data() {
    return {
      editMode: false,
      floor: this.floorProp,
      building: this.buildingProp,
      floorInfo: { name: this.floorProp.name, code: this.floorProp.code },
    };
  },
  watch: {
    open(val) {
      if (!val) {
        this.editMode = false;
      }
    },
    editMode(val) {
      if (val && !this.open) {
        this.open = true;
      }
    },
  },
  methods: {
    onFloorUpdated(updatedFloor) {
      if (updatedFloor.building_id !== this.floor.building_id) {
        this.$el.parentNode.removeChild(this.$el);
      } else {
        this.floor = updatedFloor;
        this.editMode = false;
      }
    },
  },
};
</script>
