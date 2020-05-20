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
  name: `building-list`,
  data() {
    return {
      options: {
        ajax: {
          url: `/api/building/list`,
          dataSrc: `data.buildings`,
        },
        paging: true,
        responsive: true,
        order: [[ 0, `asc` ]],
      },
      fields: [
        {
          name: `Name`,
          data: `name`,
          render(data, type, row) {
            return `<a href="/building/${row.id}/profile">${data}</a>`;
          },
        },
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
