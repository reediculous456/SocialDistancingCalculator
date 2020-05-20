<template>
  <b-container>
    <b-row
      no-gutters
      class="indicator-row"
    >
      <indicator
        title="Open Requests"
        :value="openRequests"
        color="#20a8d8"
      />
      <indicator
        title="Completed Requests (Past 30 Days)"
        :value="completedRequests"
        color="#63c2de"
      />
      <indicator
        title="Average Time to Complete"
        :value="avgTimeToCompletion"
        color="#f8cb00"
        label="days"
      />
      <indicator
        title="Average Completed per Day"
        :value="avgCompletedPerDay"
        color="#f86c6b"
      />
    </b-row>
    <b-row>
      <b-col>
        <b-card>
          <apex-chart
            v-if="series"
            type="bar"
            :options="chartOptions"
            :series="series"
          />
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import ApexChart from 'vue-apexcharts';
import Indicator from './Indicator';
import { DashboardService } from '@/services';

export default {
  name: `dashboard`,
  components: {
    ApexChart,
    Indicator,
  },
  data() {
    return {
      series: null,
      openRequests: 0,
      completedRequests: 0,
      avgTimeToCompletion: 0,
      avgCompletedPerDay: 0,
      chartOptions: {
        title: {
          text: `Requests from the last 30 days`,
          align: `center`,
          offsetY: 10,
          style: {
            fontSize: `1rem`,
          },
        },
        chart: {
          stacked: true,
        },
        xaxis: {
          labels: {
            trim: false,
          },
        },
        plotOptions: {
          bar: {
            dataLabels: {
              hideOverflowingLabels: false,
            },
          },
        },
      },
    };
  },
  async created() {
    this.series = await DashboardService.getChangeRequestCountByDay();
    this.openRequests = await DashboardService.getOpenChangeRequestCount();
    this.completedRequests = await DashboardService.getClosedChangeRequestCount();
    this.avgCompletedPerDay = await DashboardService.getAvgClosedChangeRequestCountPerDay();
    this.avgTimeToCompletion = await DashboardService.getAvgTimeToCompleteChangeRequest();
  },
};
</script>

<style lang="scss" scoped>
  .indicator-row {
    margin-right: -1rem;
  }
</style>
