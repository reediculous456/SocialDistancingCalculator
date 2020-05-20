<template>
  <b-card
    no-body
    header-bg-variant="success"
    border-variant="success"
    header-text-variant="white"
  >
    <template v-slot:header>
      <b-card-title
        v-b-toggle="'newFloorForm' + buildingId"
        title-tag="span"
        class="accordion-title newFloorTitle"
      >
        Create a New Floor
      </b-card-title>
    </template>

    <b-collapse
      :id="'newFloorForm' + buildingId"
      v-model="open"
      :accordion="'floorAccordion' + buildingId"
    >
      <b-card-body>
        <b-table-simple
          striped
          class="new-floor-table"
        >
          <b-tbody>
            <b-tr>
              <b-th>FName</b-th>
              <b-td>
                <b-form-input v-model="newFloor.fname" />
              </b-td>
            </b-tr>
            <b-tr>
              <b-th>Type</b-th>
              <b-td>
                <b-form-select
                  v-model="newFloor.floor_type_id"
                  class="form-control"
                >
                  <b-form-select-option
                    v-for="floor_type in floor_types"
                    :key="floor_type.id"
                    :value="floor_type.id"
                  >
                    {{ floor_type.code }} - {{ floor_type.name }}
                  </b-form-select-option>
                </b-form-select>
              </b-td>
            </b-tr>
            <b-tr>
              <b-td colspan="2">
                <b-btn
                  variant="secondary"
                  block
                  @click="create"
                >
                  Submit
                </b-btn>
              </b-td>
            </b-tr>
          </b-tbody>
        </b-table-simple>
      </b-card-body>
    </b-collapse>
  </b-card>
</template>

<script>
import { FloorService, FloorTypeService } from '@/services';

const initialForm = (building_id) => ({
  open: false,
  newFloor: {
    fname: null,
    floor_type_id: null,
    building_id,
    active: true,
  },
});

export default {
  name: `new-floor`,
  props: {
    buildingId: { type: Number, required: true },
  },
  data() {
    return {
      ...initialForm(this.buildingId),
      floor_types: [],
    };
  },
  watch: {
    open(val) {
      if (val) {
        this.openCard();
      }
    },
  },
  methods: {
    async create() {
      try {
        const floor = await FloorService.create({ floor: this.newFloor });
        $(`#newFloorForm${this.buildingId}`).removeClass(`in`);
        this.$emit(`created-floor`, floor);
      } catch (error) {
        throw new Error(`Failed to create Floor`);
      }
      // reset form
      Object.assign(this.$data.newFloot, ...initialForm(this.buildingId));
    },
    async openCard() {
      this.floor_types = await FloorTypeService.getList();
    },
  },
};
</script>
