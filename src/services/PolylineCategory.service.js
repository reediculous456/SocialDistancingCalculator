import Axios from '@/plugins/http.config';

const BASE_URL = `/polyline-category`;

export const PolylineCategoryService = {
  getById: (id) => Axios.get(`${BASE_URL}/${id}`)
    .then(response => response.data.data.polylineCategory)
    .catch(err => {
      throw new Error(err);
    }),

  getList: ({ activeOnly = false }) => Axios.get(`${BASE_URL}/list`, {
    params: {
      active: activeOnly,
    },
  })
    .then(response => response.data.data.polylineCategories)
    .catch(err => {
      throw new Error(err);
    }),
};
