<template>
  <div>
    <navbar :user="user" />
    <router-view />
    <site-info />
  </div>
</template>

<script>
import Navbar from './components/Navbar/Navbar';
import SiteInfo from './components/SiteInfo';

export default {
  name: `app-root`,
  components: {
    Navbar,
    SiteInfo,
  },
  data() {
    return {
      user,
    };
  },
};
</script>

<style lang="scss">
  $fa-font-path: '~font-awesome/fonts';
  @import '~bootstrap';
  @import '~bootstrap-vue';
  @import '~font-awesome/scss/font-awesome';
  @import '~pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker';
  @import '~vue-multiselect/dist/vue-multiselect.min.css';
  @import '~toastr';
  @import '@/resources/scss/cards.scss';
  @import '@/resources/scss/custom.scss';

  .body {
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
  }

  .uc_logo {
    content: url('~@/resources/images/uc_logo.png');
  }
</style>
