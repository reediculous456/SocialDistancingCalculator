<template>
  <b-table-simple class="building-table">
    <b-tbody>
      <b-tr>
        <b-th>Space Key</b-th>
        <b-td>
          <b-form-input v-model="building.name" />
        </b-td>
      </b-tr>
      <b-tr>
        <b-th>Number</b-th>
        <b-td>
          <b-form-input v-model="building.number" />
        </b-td>
      </b-tr>
      <b-tr>
        <b-th>Code</b-th>
        <b-td>
          <b-form-input v-model="building.code" />
        </b-td>
      </b-tr>
      <b-tr>
        <b-th>Active</b-th>
        <b-td>
          <b-form-checkbox
            v-model="building.active"
            class="ml-0"
          />
        </b-td>
      </b-tr>
      <b-tr>
        <b-th>Campus</b-th>
        <b-td>
          <b-form-select v-model="building.campus_id">
            <b-form-select-option
              v-for="campus in campuses"
              :key="campus.id"
              :value="campus.id"
            >
              {{ campus.code }} - {{ campus.name }}
            </b-form-select-option>
          </b-form-select>
        </b-td>
      </b-tr>
      <b-tr>
        <b-td colspan="2">
          <b-btn
            variant="success"
            block
            @click="update"
          >
            Submit
          </b-btn>
        </b-td>
      </b-tr>
    </b-tbody>
  </b-table-simple>
</template>

<script>
import { BuildingService, CampusService } from '@/services';

export default {
  name: `update-building`,
  props: {
    buildingProp: { type: Object, required: true },
  },
  data() {
    return {
      building: { ...this.buildingProp },
      campuses: [],
    };
  },
  async created() {
    this.campuses = await CampusService.getList({});
  },
  methods: {
    async update() {
      try {
        const building = await BuildingService.update(this.building);
        this.$emit(`building-updated`, building);
      } catch (error) {
        throw new Error(`Failed to update Building`);
      }
    },
  },
};
</script>
