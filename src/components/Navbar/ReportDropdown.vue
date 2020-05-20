<template>
  <b-nav-item-dropdown
    :class="{ 'router-link-active' : active }"
    text="Reports"
  >
    <b-dropdown-header>
      Change Request Reports
    </b-dropdown-header>
    <b-dropdown-item to="/report/change-requests">
      Change Requests
    </b-dropdown-item>
  </b-nav-item-dropdown>
</template>

<script>
export default {
  name: `report-dropdown`,
  props: {
    active: { type: Boolean, required: true },
  },
};
</script>
