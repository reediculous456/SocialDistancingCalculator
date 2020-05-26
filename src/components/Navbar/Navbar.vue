<template>
  <b-navbar
    sticky="top"
    toggleable="lg"
    type="dark"
    variant="dark"
  >
    <b-navbar-brand>
      <b-img
        alt="UC Logo"
        class="d-inline-block align-top logo"
      />
      <b-nav-item
        class="navbar-brand align-middle"
        href="/"
      >
        Social Distance Calculator
      </b-nav-item>
    </b-navbar-brand>
    <b-navbar-toggle target="nav-collapse" />
    <b-collapse
      id="nav-collapse"
      is-nav
    >
      <b-navbar-nav class="mr-auto">
        <b-nav-item
          v-if="showDashboard"
          to="/dashboard"
          :class="{ 'router-link-active' : subIsActive('/dashboard') }"
        >
          Dashboard
        </b-nav-item>
        <b-nav-item
          :class="{ 'router-link-active' : subIsActive('/building') }"
          to="/building/list"
        >
          Buildings
        </b-nav-item>
        <report-dropdown
          v-if="showReportDropdown"
          :active="subIsActive('/report')"
        />
        <b-nav-item
          :class="{ 'router-link-active' : subIsActive('/help') }"
          to="/help"
        >
          Help
        </b-nav-item>
        <administration-dropdown
          v-if="showAdministrationDropdown"
          :active="subIsActive('/admin')"
        />
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item href="/logout">
          Logout
        </b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import { ROLES } from 'Constants';
import AdministrationDropdown from './AdministrationDropdown';
import ReportDropdown from './ReportDropdown';

export default {
  name: `navbar`,
  components: {
    AdministrationDropdown,
    ReportDropdown,
  },
  props: {
    user: { type: Object, required: true },
  },
  data() {
    return {
      user_districts: [],
    };
  },
  computed: {
    showAdministrationDropdown() {
      return ROLES.ADMIN === user.role_id;
    },
    showReportDropdown() {
      return ROLES.ADMIN === user.role_id;
    },
    showDashboard() {
      return ROLES.ADMIN === user.role_id;
    },
  },
  methods: {
    subIsActive(...paths) {
      return paths.some(path => this.$route.path.indexOf(path) === 0);
    },
  },
};
</script>

<style lang="scss">
  .navbar {
    margin-bottom: 1.5rem;

    .dropdown-item.router-link-exact-active {
      color: red !important;
    }

    .navbar-collapse {
      margin-left: env(safe-area-inset-left);

      .nav-item.router-link-active {
        color: rgba(255, 255, 255, 1);

        .router-link-exact-active {
          color: rgba(255, 255, 255, 1);
        }
      }
    }

    .navbar-brand {
      padding-top: 0;
      padding-bottom: 0;
      margin-right: 0;

      .nav-link {
        padding: 0.5rem;
        color: white;
      }

      .logo {
        width: 6rem;
        height: 100%;
        content: url('~@/resources/images/UC_Logo_White.png');
      }
    }
  }
</style>
