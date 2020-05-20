<template>
  <b-container>
    <b-row>
      <b-col>
        <h2>Change Requests</h2>
        <b-row>
          <b-col cols="4">
            <b-form-group label="Start Date">
              <b-input-group>
                <date-picker
                  v-model="startDate"
                  :config="datepickerOptions"
                />
                <b-input-group-append>
                  <b-input-group-text>
                    <span
                      class="fa fa-calendar"
                      style="display: flex;"
                    />
                  </b-input-group-text>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col cols="4">
            <b-form-group label="End Date">
              <b-input-group>
                <date-picker
                  v-model="endDate"
                  :config="endDateOptions"
                />
                <b-input-group-append>
                  <b-input-group-text>
                    <span
                      class="fa fa-calendar"
                      style="display: flex;"
                    />
                  </b-input-group-text>
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col cols="4">
            <b-form-group
              style="padding-top: 1.95rem;"
            >
              <button-checkbox
                v-model="showCompleted"
                button-text="Show Completed"
                off-color="secondary"
                on-color="primary"
              />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-card>
              <datatable
                ref="table"
                :opts="tableOptions"
                :fields="fields"
                @showModal="onShowModal"
              />
              <change-request-modal
                v-if="currentRequest"
                :request-prop="currentRequest"
              />
            </b-card>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import moment from 'moment';
import ChangeRequestModal from '@/components/Modals/ChangeRequestModal';

export default {
  name: `change-requests`,
  components: {
    ChangeRequestModal,
  },
  data() {
    return {
      currentRequest: null,
      startDate: moment().subtract(2, `months`).format(`MM/DD/YYYY`),
      endDate: moment().format(`MM/DD/YYYY`),
      showCompleted: false,
      datepickerOptions: {
        format: `MM/DD/YYYY`,
        useCurrent: false,
      },
      tableOptions: {
        ajax: {
          url: `/api/change-request/list`,
          data: this.getParams,
          dataSrc: `data.requests`,
        },
        buttons: [
          {
            extend: `print`,
            exportOptions: { orthogonal: `export` },
            text: `Print`,
            title: `Change Request Report`,
          },
          {
            extend: `csv`,
            exportOptions: { orthogonal: `export` },
            text: `CSV (Open with Excel)`,
            title: `Change Request Report`,
          },
          {
            extend: `copy`,
            exportOptions: { orthogonal: `export` },
            text: `Copy`,
          },
          `colvis`,
        ],
      },
      fields: [
        { name: `Campus`, data: `building.campus.name` },
        { name: `Building`, data: `building.name` },
        { name: `Building Number`, data: `building.number` },
        { name: `Floor`, data: `floor.type.name` },
        { name: `ID`, data: `id` },
        {
          name: `Description`,
          data: `statuses`,
          render(data) {
            const description = data[0].comment;
            return `<a href="#"
            data-action="showModal"
            >${description.length > 25 ? `${description.substr(0, 25)} ...` : description}</a>`;
          },
        },
        { name: `Created By`, data: `creator.name` },
        {
          name: `Created On`,
          data: `created_on`,
          render(data, type) {
            if (type === `sort`) { return data; }
            return moment(data).format(`MMMM Do YYYY, h:mm:ss a`);
          },
        },
        {
          name: `Status`,
          data: `status.type`,
          render(data, type) {
            if (type === `sort`) { return data.id; }
            return data.name;
          },
        },
      ],
    };
  },
  computed: {
    endDateOptions() {
      const options = { ...this.datepickerOptions };
      options.minDate = moment(this.startDate).add(1, `days`);
      return options;
    },
  },
  watch: {
    startDate() {
      if (moment(this.endDate) <= moment(this.endDateOptions.minDate)) {
        this.endDate = moment(this.endDateOptions.minDate).format(`MM/DD/YYYY`);
      }
      this.$refs.table.reload();
    },
    endDate() {
      this.$refs.table.reload();
    },
    showCompleted() {
      this.$refs.table.reload();
    },
  },
  methods: {
    onShowModal(data) {
      this.currentRequest = data;
      setTimeout(() => {
        this.$bvModal.show(`change-request-modal`);
      }, 100);
    },
    getParams() {
      return {
        startDate: this.startDate,
        endDate: this.endDate,
        showCompleted: this.showCompleted,
      };
    },
  },
};
</script>
