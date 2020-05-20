<template>
  <div
    id="change-request-view"
    class="container-fluid"
  >
    <div class="table-wrapper">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>
              #
            </th>
            <th>
              Request
            </th>
            <th>
              Time
            </th>
            <th>
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          <change-request-view-row
            v-for="request in changeRequests"
            :key="request.id"
            :request="request"
            :selected="request.id === selectedRequest"
            @request-clicked="onChangeRequestClicked"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { isEqual, sortBy } from 'lodash';
import ChangeRequestViewRow from './TableRow';
import { ChangeRequestService } from '@/services';

export default {
  name: `change-request-view-panel`,
  components: {
    ChangeRequestViewRow,
  },
  props: {
    urn: { type: Object, required: true },
  },
  data() {
    return {
      changeRequests: [],
      allRequestObjects: [],
      selectedObjects: [],
      selectedRequest: null,
    };
  },
  async created() {
    this.$parent.$on(`selection-changed`, this.onSelectionChanged);
    this.$parent.$on(`view-all-button-clicked`, this.onViewAllButtonClicked);
    this.changeRequests = await ChangeRequestService.getForUrn(this.urn.id);
  },
  methods: {
    onChangeRequestClicked(object_ids, request_id) {
      this.selectedRequest = request_id;
      this.selectedObjects = object_ids;
      this.$parent.$emit(`request-clicked`, object_ids);
    },
    onSelectionChanged(object_ids) {
      if (!isEqual(sortBy(object_ids), sortBy(this.selectedObjects))) {
        this.selectedRequest = null;
      }
    },
    onViewAllButtonClicked() {
      this.selectedRequest = null;
      this.selectedObjects = [];
      if (!this.allRequestObjects.length) {
        this.changeRequests.forEach(request => {
          request.attributes.forEach(attribute => {
            this.allRequestObjects.push(attribute.dbID);
          });
        });
      }
      this.$parent.$emit(`request-clicked`, this.allRequestObjects);
    },
  },
};
</script>

<style lang="scss">
  #ChangeRequestViewPanel {
    .container-fluid {
      position: absolute;
      top: 60px;
      bottom: 20px;
      padding: 0;
      width: inherit;
      min-width: inherit;
      overflow-y: scroll;
    }
  }
</style>
