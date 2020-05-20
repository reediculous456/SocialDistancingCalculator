<template>
  <b-container>
    <b-row>
      <b-col id="BldgMgmtAccordionWrapper">
        <div
          id="bldgMgmtAccordion"
          class="accordion"
        >
          <campus-card
            v-for="campus in campuses"
            :key="campus.id"
            :campus-prop="campus"
          />
          <new-campus
            @created-campus="onNewCampus"
          />
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { orderBy } from 'lodash';
import CampusCard from './Campus/CampusCard';
import NewCampus from './Campus/NewCampus';
import { CampusService } from '@/services';

export default {
  name: `campus-management`,
  components: {
    CampusCard,
    NewCampus,
  },
  data() {
    return {
      campuses: [],
    };
  },
  created() {
    this.loadCampuses();
  },
  methods: {
    onNewCampus(newCampus) {
      this.campuses.push(newCampus);
      this.campuses = this.sortCampuses(this.campuses);
    },
    async loadCampuses() {
      const campuses = await CampusService.getList({ activeOnly: false });
      this.campuses = campuses.map(c => Object.assign(c, { buildings: [] }));
      this.campuses = this.sortCampuses(this.campuses);
    },
    sortCampuses(campuses) {
      return orderBy(campuses, [ `active`, `name` ], [ `desc`, `asc` ]);
    },
  },
};
</script>

<style lang="scss">
  .campus-table,
  .building-table,
  .floor-table,
  .new-campus-table,
  .new-building-table,
  .new-floor-table {
    margin-bottom: 1rem !important;
    table-layout: fixed;
    width: 100%;

    th {
      width: 30%;
      vertical-align: middle !important;
    }

    input {
      width: 80%;
    }

    select {
      width: 80%;
    }
  }

  #BldgMgmtAccordionWrapper {
    .card {
      margin-bottom: 0.5rem;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
    }

    .card-title {
      margin-bottom: 0;
      width: 95%;
    }
  }
</style>
