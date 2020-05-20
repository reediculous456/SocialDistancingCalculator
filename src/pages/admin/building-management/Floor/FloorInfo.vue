<template>
  <b-table-simple
    striped
    class="floor-table"
  >
    <b-tbody>
      <b-tr>
        <b-th>FName</b-th>
        <b-td>
          <span class="table-items">{{ floor.fname }}</span>
        </b-td>
      </b-tr>
      <b-tr>
        <b-th>Type</b-th>
        <b-td>
          <span class="table-items">{{ floor.type.code }} - {{ floor.type.name }}</span>
        </b-td>
      </b-tr>
      <b-tr>
        <b-th>Active</b-th>
        <b-td>
          <span class="table-items">{{ floor.active }}</span>
        </b-td>
      </b-tr>
    </b-tbody>
  </b-table-simple>
</template>

<script>
export default {
  name: `floor-info`,
  props: {
    floor: { type: Object, required: true },
    building: { type: Object, required: true },
  },
};
</script>
