import Axios from '@/plugins/http.config';

const BASE_URL = `/polyline-type`;

export const PolylineTypeService = {
  getById: (id) => Axios.get(`${BASE_URL}/${id}`)
    .then(response => response.data.data.polylineType)
    .catch(err => {
      throw new Error(err);
    }),

  getForCategory: ({ activeOnly = true, polyline_type_category_id }) =>
    Axios.get(`${BASE_URL}/category/${polyline_type_category_id}`, {
      params: {
        active: activeOnly,
      },
    })
      .then(response => response.data.data.polylineTypes)
      .catch(err => {
        throw new Error(err);
      }),

  getList: ({ activeOnly = false }) => Axios.get(`${BASE_URL}/list`, {
    params: {
      active: activeOnly,
    },
  })
    .then(response => response.data.data.polylineTypes)
    .catch(err => {
      throw new Error(err);
    }),
};
