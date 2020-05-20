<template>
  <tr
    :class="[selected ? `selected-change-request` : ``]"
    @click="onRequestClick"
  >
    <th>{{ request.id }}</th>
    <td>{{ request.statuses[0].comment }}</td>
    <td>{{ time }}</td>
    <td style="text-align: center;">
      {{ request.status.type.name }}
    </td>
  </tr>
</template>

<script>
import moment from 'moment';

export default {
  name: `change-request-view-row`,
  props: {
    request: { type: Object, required: true },
    selected: { type: Boolean, required: true },
  },
  computed: {
    time() {
      return moment(this.request.created_on).format(`MMMM Do YYYY, h:mm:ss a`);
    },
  },
  methods: {
    onRequestClick() {
      const object_ids = this.request.attributes.map(attribute => attribute.dbID);
      this.$emit(`request-clicked`, object_ids, this.request.id);
    },
  },
};
</script>

<style lang="scss">
  #ChangeRequestViewPanel {
    .selected-change-request {
      color: #00bfff;
    }

    .table-wrapper {
      position: relative;
      padding-left: 15px;
      padding-right: 15px;
    }

    .table {
      color: white;

      thead th {
        border-top: none;
      }
    }

    .table-hover {
      tbody {
        tr:hover {
          color: #00bfff;
        }
      }
    }
  }
</style>
