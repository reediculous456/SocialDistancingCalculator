<template>
  <b-card no-body>
    <template v-slot:header>
      <b-card-title
        v-b-toggle.FloorTable
        title-tag="h3"
        class="accordion-title"
      >
        Floors
      </b-card-title>
    </template>

    <b-collapse
      id="FloorTable"
      visible
    >
      <b-card-body>
        <b-table-simple
          v-if="floors.length"
          class="table table-striped"
        >
          <b-thead>
            <b-tr>
              <b-th>Floor</b-th>
              <b-th>Name</b-th>
              <b-th>Active Requests</b-th>
            </b-tr>
          </b-thead>
          <b-tbody>
            <b-tr
              v-for="floor in floors"
              :key="floor.id"
            >
              <b-th>
                <router-link :to="'/building/'+ floor.id +'/viewer'">
                  {{ floor.type.name }}
                </router-link>
              </b-th>
              <b-td>
                {{ floor.fname }}
              </b-td>
              <b-td>
                {{ floor.activeRequests }}
              </b-td>
            </b-tr>
          </b-tbody>
        </b-table-simple>
        <div v-else>
          There are no floors available for this building
        </div>
      </b-card-body>
    </b-collapse>
  </b-card>
</template>

<script>
export default {
  name: `floors-card`,
  props: {
    floorsProp: { type: Array, required: true },
  },
  data() {
    return {
      floors: Object.assign([], this.floorsProp),
    };
  },
};
</script>

<style lang="scss" scoped>
  td {
    text-align: center;
  }
</style>
