<template>
  <b-container>
    <b-row>
      <b-col>
        <b-card
          header="Square Footage Support"
          header-tag="h4"
        >
          <p style="margin-bottom: 1rem;">
            For technical assistance with the system or to report an issue, please contact {{ supportName }}:
          </p>
          <b-table-simple striped>
            <b-tbody>
              <b-tr>
                <b-td>Email</b-td>
                <b-td>
                  <a :href="'mailto:' + supportEmail">{{ supportEmail }}</a>
                </b-td>
              </b-tr>
              <b-tr>
                <b-td>Phone</b-td>
                <b-td>
                  <a :href="'tel:' + supportPhone">{{ supportPhoneFormatted }}</a>
                </b-td>
              </b-tr>
            </b-tbody>
          </b-table-simple>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { REGEX } from 'Constants';

export default {
  name: `help`,
  data() {
    return {
      supportName: `IT Solutions Center`,
      supportEmail: `itsolctr@ucmail.uc.edu`,
      supportPhone: `5135564357`,
    };
  },
  computed: {
    supportPhoneFormatted() {
      return this.supportPhone.replace(REGEX.VALID_PHONE_NUMBER, REGEX.PHONE_NUMBER_FORMAT);
    },
  },
};
</script>
