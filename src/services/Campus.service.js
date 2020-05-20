import Axios from '@/plugins/http.config';

const BASE_URL = `/campus`;

export const CampusService = {
  getById: (campus_id) => Axios.get(`${BASE_URL}/${campus_id}`)
    .then(response => response.data.data.campus)
    .catch(err => {
      throw new Error(err);
    }),

  getList: ({ activeOnly = false }) => Axios.get(`${BASE_URL}/list`, {
    params: {
      active: activeOnly,
    },
  })
    .then(response => response.data.data.campuses)
    .catch(err => {
      throw new Error(err);
    }),
};
