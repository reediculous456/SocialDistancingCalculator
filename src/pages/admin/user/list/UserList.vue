<template>
  <b-container>
    <b-row>
      <b-col>
        <b-card>
          <datatable
            :opts="options"
            :fields="fields"
          />
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { REGEX } from 'Constants';

export default {
  name: `user-list`,
  data() {
    return {
      options: {
        ajax: {
          url: `/api/user/list`,
          dataSrc: `data.users`,
        },
        paging: true,
      },
      fields: [
        { name: `Name`, data: `name` },
        {
          name: `Role`,
          data: `role`,
          render(data) {
            return data.name || `N/A`;
          },
        },
        { name: `Username`, data: `username` },
        { name: `Email`, data: `email` },
        {
          name: `Phone`,
          data: `phone`,
          render(data) {
            return data ? data.replace(REGEX.VALID_PHONE_NUMBER, REGEX.PHONE_NUMBER_FORMAT) : `NONE`;
          },
        },
      ],
    };
  },
};
</script>
