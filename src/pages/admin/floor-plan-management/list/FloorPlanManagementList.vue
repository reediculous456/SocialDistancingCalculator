<template>
  <b-container>
    <b-row>
      <b-col>
        <b-card>
          <datatable
            :opts="options"
            :fields="fields"
          />
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: `floor-plan-mgmt-list`,
  data() {
    return {
      options: {
        ajax: {
          url: `/api/building/list`,
          dataSrc: `data.buildings`,
        },
        paging: true,
        responsive: true,
        order: [[ 2, `desc` ], [ 1, `asc` ]],
      },
      fields: [
        { name: `Number`, data: `number` },
        {
          name: `Name`,
          data: `name`,
          render(data, type, row) {
            return `<a href="/admin/floors/upload/building/${row.id}">${data}</a>`;
          },
        },
        { name: `Change Requests`, data: `activeRequests` },
        {
          name: `Campus`,
          data: `campus.name`,
        },
        {
          name: `Address`,
          render(data, type, row) {
            return row.address.street1;
          },
        },
        {
          name: `City`,
          render(data, type, row) {
            return row.address.city;
          },
        },
        {
          name: `State`,
          render(data, type, row) {
            return row.address.state.name;
          },
        },
        {
          name: `Zip Code`,
          render(data, type, row) {
            return row.address.zip_code;
          },
        },
      ],
    };
  },
};
</script>
