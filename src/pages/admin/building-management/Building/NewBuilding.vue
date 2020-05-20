<template>
  <b-col cols="6">
    <b-card
      no-body
      header-bg-variant="success"
      border-variant="success"
      header-text-variant="white"
    >
      <template v-slot:header>
        <b-card-title
          v-b-toggle="'newBuildingForm' + campusId"
          title-tag="span"
          class="accordion-title newBuildingTitle"
        >
          Create a New Building
        </b-card-title>
      </template>
      <b-collapse
        :id="'newBuildingForm' + campusId"
        v-model="open"
        :accordion="'buildingAccordion' + campusId"
      >
        <b-card-body>
          <b-table-simple
            striped
            class="new-building-table"
          >
            <b-tbody>
              <b-tr>
                <b-th>Name</b-th>
                <b-td>
                  <b-form-input v-model="newBuilding.name" />
                </b-td>
              </b-tr>
              <b-tr>
                <b-th>Number</b-th>
                <b-td>
                  <b-form-input v-model="newBuilding.number" />
                </b-td>
              </b-tr>
              <b-tr>
                <b-th>Code</b-th>
                <b-td>
                  <b-form-input v-model="newBuilding.code" />
                </b-td>
              </b-tr>
              <b-tr>
                <b-th>Address</b-th>
                <b-td>
                  <b-form-group>
                    <b-form-input
                      v-model="newBuilding.address.street1"
                      placeholder="Street 1"
                    />
                    <b-form-input
                      v-model="newBuilding.address.street2"
                      placeholder="Street 2"
                    />
                    <b-form-input
                      v-model="newBuilding.address.city"
                      placeholder="City"
                    />
                    <b-form-select v-model="newBuilding.address.state_id">
                      <b-form-select-option
                        v-for="state in states"
                        :key="state.id"
                        :value="state.id"
                      >
                        {{ state.name }}
                      </b-form-select-option>
                    </b-form-select>
                    <b-form-input
                      v-model="newBuilding.address.zip_code"
                      placeholder="Zip Code"
                    />
                  </b-form-group>
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
  </b-col>
</template>

<script>
import { BuildingService, StateService } from '@/services';

function initialForm(campus_id) {
  return {
    newBuilding: {
      name: null,
      code: null,
      number: null,
      address: {
        street1: null,
        street2: null,
        city: null,
        state_id: null,
        zip_code: null,
      },
      campus_id,
      active: true,
    },
  };
}

export default {
  name: `new-building`,
  props: {
    campusId: { type: Number, required: true },
  },
  data() {
    return {
      ...initialForm(this.campusId),
      states: [],
    };
  },
  methods: {
    async create() {
      try {
        const building = await BuildingService.create({ building: this.newBuilding });
        $(`#newBuildingForm${this.campusId}`).removeClass(`in`);
        this.$emit(`created-building`, building);
      } catch (error) {
        throw new Error(`Failed to create Building`);
      }
      // reset form
      Object.assign(this.$data.newBuilding, ...initialForm(this.campusId));
    },
    async openCard() {
      this.states = await StateService.getList();
    },
  },
};
</script>
