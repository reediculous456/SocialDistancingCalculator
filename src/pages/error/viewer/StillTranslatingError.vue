<template>
  <b-container>
    <b-row>
      <b-col>
        <b-card
          bg-variant="light"
          title="File Still Translating"
        >
          <p>
            Your file is still in the process of being translated. This page will automatically reload on completion.
          </p>
          <p>
            {{ progress }}
          </p>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { ForgeService } from '@/services';

export default {
  name: `still-translating-error`,
  data() {
    return {
      progress: null,
      urn_string: this.$route.params.urn_string,
    };
  },
  created() {
    ForgeService.getToken(this.checkTranslateStatus.bind(this));
  },
  methods: {
    checkTranslateStatus(res) {
      this.getTranslateStatus(res, this);
    },
    getTranslateStatus(token, vm) {
      $.ajax({
        url: `https://developer.api.autodesk.com/modelderivative/v2/designdata/${vm.urn_string}/manifest`,
        type: `GET`,
        headers: { Authorization: `Bearer ${token}` },
        success(data) {
          switch (data.status) {
            case `success`:
            case `failed`:
            case `timeout`:
              window.location.href = `/building/${vm.$route.params.floor_id}/viewer`;
              break;
            case `inprogress`:
              vm.progress = `Status: ${data.progress}`;
              setTimeout(() => {
                vm.getTranslateStatus(token, vm);
              }, 10000);
              break;
          }
        },
        error(err) {
          if (err.status === 401) {
            window.location.reload(true);
          }
        },
      });
    },
  },
};
</script>
