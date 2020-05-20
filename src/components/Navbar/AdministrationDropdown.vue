<template>
  <b-nav-item-dropdown
    :class="{ 'router-link-active' : active }"
    text="Administration"
  >
    <b-dropdown-item to="/admin/user/list">
      Users
    </b-dropdown-item>
    <b-dropdown-divider />
    <b-dropdown-item to="/admin/building">
      Building Management
    </b-dropdown-item>
    <b-dropdown-item to="/admin/floors/list">
      Base Floor Plan Management
    </b-dropdown-item>
  </b-nav-item-dropdown>
</template>

<script>
export default {
  name: `administration-dropdown`,
  props: {
    active: { type: Boolean, required: true },
  },
};
</script>
