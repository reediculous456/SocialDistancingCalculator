import Axios from '@/plugins/http.config';

const BASE_URL = `/state`;

export const StateService = {
  getList: () => Axios.get(`${BASE_URL}/list`)
    .then(response => response.data.data.states)
    .catch(err => {
      throw new Error(err);
    }),
};
