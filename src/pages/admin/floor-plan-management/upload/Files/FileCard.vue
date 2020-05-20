<template>
  <b-card no-body>
    <template v-slot:header>
      <b-card-title
        v-b-toggle.filesTablePanel
        title-tag="h4"
      >
        Uploaded Floor Plans
      </b-card-title>
    </template>

    <b-collapse
      id="filesTablePanel"
      visible
    >
      <b-card-body>
        <datatable
          :opts="options"
          :fields="fields"
        />
      </b-card-body>
    </b-collapse>
  </b-card>
</template>

<script>
import moment from 'moment';

export default {
  name: `files-card`,
  props: {
    buildingProp: { type: Object, required: true },
  },
  data() {
    return {
      options: {
        ajax: {
          url: `/api/urn/building/${this.buildingProp.id}`,
          dataSrc: `data.urns`,
        },
        scrollY: 400,
        responsive: true,
        paging: true,
      },
      fields: [
        {
          name: `Floor`,
          data: `floor.type`,
          render(data, type) {
            if (type === `sort`) { return data.id; }
            return data.name;
          },
        },
        { name: `File Name`, data: `file_name` },
        {
          name: `Uploaded On`,
          data: `uploaded_on`,
          render(data, type) {
            if (type === `sort`) { return data; }
            return moment(data).format(`MMMM Do YYYY, h:mm:ss a`);
          },
        },
        { name: `Uploaded By`, data: `uploader.name` },
        { name: `Urn ID`, data: `id` },
      ],
    };
  },
};
</script>
