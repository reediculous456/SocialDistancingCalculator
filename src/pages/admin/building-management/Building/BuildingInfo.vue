<template>
  <b-table-simple
    striped
    class="building-table"
  >
    <b-tbody>
      <b-tr>
        <b-th>Name</b-th>
        <b-td>
          <span class="table-items">{{ building.name }}</span>
        </b-td>
      </b-tr>
      <b-tr>
        <b-th>Space Id</b-th>
        <b-td>
          <span class="table-items">{{ building.number }}</span>
        </b-td>
      </b-tr>
      <b-tr>
        <b-th>Code</b-th>
        <b-td>
          <span class="table-items">{{ building.code }}</span>
        </b-td>
      </b-tr>
      <b-tr>
        <b-th>Active</b-th>
        <b-td>
          <span class="table-items">{{ building.active }}</span>
        </b-td>
      </b-tr>
      <b-tr>
        <b-th>Campus</b-th>
        <b-td>
          <span class="table-items">{{ campus.code }} - {{ campus.name }}</span>
        </b-td>
      </b-tr>
    </b-tbody>
  </b-table-simple>
</template>

<script>
export default {
  name: `building-info`,
  props: {
    building: { type: Object, required: true },
    campus: { type: Object, required: true },
  },
};
</script>
