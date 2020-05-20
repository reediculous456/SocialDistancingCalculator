import Axios from '@/plugins/http.config';

const BASE_URL = `/floor`;

export const FloorService = {
  getForBuilding: ({ activeOnly = false, building_id }) => Axios.get(`${BASE_URL}/building/${building_id}`, {
    params: {
      active: activeOnly,
    },
  })
    .then(response => response.data.data.floors)
    .catch(err => {
      throw new Error(err);
    }),
};
