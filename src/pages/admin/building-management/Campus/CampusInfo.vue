<template>
  <b-table-simple
    striped
    class="campus-table"
  >
    <b-tbody>
      <b-tr>
        <b-th>Name</b-th>
        <b-td>
          <span class="table-items">{{ campus.name }}</span>
        </b-td>
      </b-tr>
      <b-tr>
        <b-th>Code</b-th>
        <b-td>
          <span class="table-items">{{ campus.code }}</span>
        </b-td>
      </b-tr>
      <b-tr>
        <b-th>Active</b-th>
        <b-td>
          <span class="table-items">{{ campus.active }}</span>
        </b-td>
      </b-tr>
    </b-tbody>
  </b-table-simple>
</template>

<script>
export default {
  name: `campus-info`,
  props: {
    campus: { type: Object, required: true },
  },
};
</script>
