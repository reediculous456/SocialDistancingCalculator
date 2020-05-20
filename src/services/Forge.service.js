import Axios from '@/plugins/http.config';

const BASE_URL = `/forge`;

export const ForgeService = {
  getToken: (callback) => Axios.get(`${BASE_URL}/token`)
    .then(response => {
      callback(response.data.access_token, response.data.expires_in);
    })
    .catch(err => {
      throw new Error(err);
    }),
};
