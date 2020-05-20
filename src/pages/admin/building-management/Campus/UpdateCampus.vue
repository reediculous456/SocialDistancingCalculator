<template>
  <b-table-simple
    striped
    class="campus-table"
  >
    <b-tbody>
      <b-tr>
        <b-th>Name</b-th>
        <b-td>
          <b-form-input v-model="campus.name" />
        </b-td>
      </b-tr>
      <b-tr>
        <b-th>Code</b-th>
        <b-td>
          <b-form-input v-model="campus.code" />
        </b-td>
      </b-tr>
      <b-tr>
        <b-th>Active</b-th>
        <b-td>
          <b-form-checkbox
            v-model="campus.active"
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
import { CampusService } from '@/services';

export default {
  name: `update-campus`,
  props: {
    campusProp: { type: Object, required: true },
  },
  data() {
    return {
      campus: { ...this.campusProp },
    };
  },
  methods: {
    async update() {
      try {
        const campus = await CampusService.update(this.campus);
        this.$emit(`campus-updated`, campus);
      } catch (error) {
        throw new Error(`Failed to update Campus`);
      }
    },
  },
};
</script>
