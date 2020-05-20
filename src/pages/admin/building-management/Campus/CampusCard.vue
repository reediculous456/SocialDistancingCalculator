<template>
  <b-card
    :id="'Campus-' + campus.id"
    no-body
    :header-bg-variant="campus.active ? 'secondary' : 'danger'"
    :border-variant="campus.active ? 'secondary' : 'danger'"
    header-text-variant="white"
  >
    <template v-slot:header>
      <b-card-title
        v-b-toggle="'campus' + campus.id"
        title-tag="span"
        class="accordion-title"
      >
        {{ campus.name }}
      </b-card-title>
      <span
        @click="editMode = !editMode"
      >{{ editMode ? 'Cancel' : 'Edit' }}</span>
    </template>

    <b-collapse
      :id="'campus'+campus.id"
      v-model="open"
      accordion="bldgMgmtAccordion"
    >
      <b-card-body>
        <campus-info
          v-if="!editMode"
          :campus="campus"
        />
        <update-campus
          v-if="editMode"
          :campus-prop="campus"
          @campus-updated="onCampusUpdated"
        />
        <div
          :id="'buildingAccordion' + campus.id"
          class="accordion"
        >
          <b-row>
            <building-card
              v-for="building in campus.buildings"
              :key="building.id"
              :building-prop="building"
              :campus-prop="campusInfo"
            />
            <new-building
              v-if="campus.active"
              :campus-id="campus.id"
              @created-building="onNewBuilding"
            />
          </b-row>
        </div>
        <grid-loader
          class="loader"
          :color="loader.color"
          :loading="loader.loading"
        />
      </b-card-body>
    </b-collapse>
  </b-card>
</template>

<script>
import { orderBy } from 'lodash';
import BuildingCard from '../Building/BuildingCard';
import NewBuilding from '../Building/NewBuilding';
import CampusInfo from './CampusInfo';
import UpdateCampus from './UpdateCampus';
import { BuildingService } from '@/services';

export default {
  name: `CampusCard`,
  components: {
    CampusInfo,
    UpdateCampus,
    BuildingCard,
    NewBuilding,
  },
  props: {
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
      campusInfo: { name: this.campusProp.name, code: this.campusProp.code },
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
    'campus.active'(val) {
      if (!val) {
        this.campus.buildings.forEach(b => b.active = false);
      }
    },
  },
  methods: {
    async openCard() {
      try {
        this.loader.loading = true;
        let buildings = await BuildingService.getForCampus({ campus_id: this.campus.id, activeOnly: false });
        buildings = buildings.map(b => Object.assign(b, { floors: [] }));
        buildings = this.sortBuildings(buildings);
        this.campus.buildings = buildings;
        this.loader.loading = false;
      } catch (error) {
        this.loader.loading = false;
        throw error;
      }
    },
    onCampusUpdated(updatedCampus) {
      updatedCampus.buildings = this.campus.buildings;
    },
    onNewBuilding(newBuilding) {
      this.campus.buildings.push(newBuilding);
      this.campus.buildings = this.sortBuildings(this.campus.buildings);
    },
    sortBuildings(buildings) {
      return orderBy(buildings, [ `active`, `name` ], [ `desc`, `asc` ]);
    },
  },
};
</script>
