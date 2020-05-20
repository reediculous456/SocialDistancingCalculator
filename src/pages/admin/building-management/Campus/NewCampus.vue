<template>
  <b-card
    no-body
    header-bg-variant="success"
    border-variant="success"
    header-text-variant="white"
  >
    <template v-slot:header>
      <b-card-title
        v-b-toggle.newCampusForm
        title-tag="span"
        class="accordion-title newCampusTitle"
      >
        Create a New Campus
      </b-card-title>
    </template>
    <b-collapse
      id="newCampusForm"
      accordion="bldgMgmtAccordion"
    >
      <b-card-body>
        <b-table-simple
          striped
          class="new-campus-table"
        >
          <b-tbody>
            <b-tr>
              <b-th>Name</b-th>
              <b-td>
                <b-form-input v-model="newCampus.name" />
              </b-td>
            </b-tr>
            <b-tr>
              <b-th>Code</b-th>
              <b-td>
                <b-form-input v-model="newCampus.code" />
              </b-td>
            </b-tr>
            <b-tr>
              <b-td colspan="2">
                <b-btn
                  block
                  variant="secondary"
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
import { CampusService } from '@/services';

function initialForm() {
  return {
    newCampus: {
      name: null,
      code: null,
      sort_order: 0,
      active: true,
    },
  };
}

export default {
  name: `new-campus`,
  data() {
    return initialForm();
  },
  methods: {
    async create() {
      try {
        const campus = await CampusService.create({ campus: this.newCampus });
        $(`#newCampusForm`).removeClass(`in`);
        this.$emit(`created-campus`, campus);

      } catch (error) {
        throw new Error(`Failed to create Campus`);
      }
      // reset form
      Object.assign(this.$data, initialForm());
    },
  },
};
</script>
