<template>
  <b-table-simple
    striped
    class="floor-table"
  >
    <b-tbody>
      <b-tr>
        <b-th>FName</b-th>
        <b-td>
          <b-form-input v-model="floor.fname" />
        </b-td>
      </b-tr>
      <b-tr>
        <b-th>Type</b-th>
        <b-td>
          <b-form-select
            v-model="floor.floor_type_id"
            class="form-control"
          >
            <b-form-select-option
              v-for="floor_type in floor_types"
              :key="floor_type.id"
              :value="floor.floor_type_id"
            >
              {{ floor_type.code }} - {{ floor_type.name }}
            </b-form-select-option>
          </b-form-select>
        </b-td>
      </b-tr>
      <b-tr>
        <b-th>Active</b-th>
        <b-td>
          <b-form-checkbox
            v-model="floor.active"
            class="ml-0"
          />
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
import { FloorService, FloorTypeService } from '@/services';

export default {
  name: `update-floor`,
  props: {
    floorProp: { type: Object, required: true },
  },
  data() {
    return {
      floor: { ...this.floorProp },
      floor_types: [],
    };
  },
  async created() {
    this.floor_types = await FloorTypeService.getList();
  },
  methods: {
    async update() {
      try {
        const floor = await FloorService.update(this.floor);
        this.$emit(`floor-updated`, floor);
      } catch (error) {
        throw new Error(`Failed to update floor`);
      }
    },
  },
};
</script>
