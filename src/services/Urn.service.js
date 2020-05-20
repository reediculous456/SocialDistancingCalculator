import Axios from '@/plugins/http.config';

const BASE_URL = `/urn`;

export const UrnService = {
  getCurrentForFloors: (floor_ids) => Axios.get(`${BASE_URL}/current`, {
    params: {
      floor_ids,
    },
  })
    .then(response => response.data.data.urns)
    .catch(err => {
      throw new Error(err);
    }),

  getForBuilding: (building_id) => Axios.get(`${BASE_URL}/building/${building_id}`)
    .then(response => response.data.data.urns)
    .catch(err => {
      throw new Error(err);
    }),

  upload: (floor_id, file) => Axios.post(`${BASE_URL}/cadfile/floor/${floor_id}`,
    file,
    {
      headers: {
        'Content-Type': `multipart/form-data`,
      },
    })
    .then(response => response.data.data)
    .catch(err => {
      throw new Error(err);
    }),
};
