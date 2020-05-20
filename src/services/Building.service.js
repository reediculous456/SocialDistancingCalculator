import Axios from '@/plugins/http.config';

const BASE_URL = `/building`;

export const BuildingService = {
  getById: (building_id) => Axios.get(`${BASE_URL}/${building_id}`)
    .then(response => response.data.data.building)
    .catch(err => {
      throw new Error(err);
    }),

  getForCampus: ({ activeOnly = true, campus_id }) => Axios.get(`${BASE_URL}/campus/${campus_id}`, {
    params: {
      active: activeOnly,
    },
  })
    .then(response => response.data.data.buildings)
    .catch(err => {
      throw new Error(err);
    }),

  getList: ({ activeOnly = true }) => Axios.get(`${BASE_URL}/list`, {
    params: {
      active: activeOnly,
    },
  })
    .then(response => response.data.data.buildings)
    .catch(err => {
      throw new Error(err);
    }),
};
