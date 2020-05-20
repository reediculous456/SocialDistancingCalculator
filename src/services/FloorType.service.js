import Axios from '@/plugins/http.config';

const BASE_URL = `/floor-type`;

export const FloorTypeService = {
  getList: () => Axios.get(`${BASE_URL}/list`)
    .then(response => response.data.data.floor_types)
    .catch(err => {
      throw new Error(err);
    }),
};
