import Axios from '@/plugins/http.config';

const BASE_URL = `/freeform-markup`;

export const FreeformMarkupService = {
  create: (markup) => Axios.post(`${BASE_URL}`, {
    markup,
  })
    .then(response => response.data.data.markup)
    .catch(err => {
      throw new Error(err);
    }),

  getAllByUrn: ({ type_ids, urn_id }) => Axios.get(`${BASE_URL}/urn/${urn_id}`, {
    params: {
      type_ids,
    },
  })
    .then(response => response.data.data.markups)
    .catch(err => {
      throw new Error(err);
    }),

  getById: (markup_id) => Axios.get(`${BASE_URL}/${markup_id}`)
    .then(response => response.data.data)
    .catch(err => {
      throw new Error(err);
    }),

  update: ({ id, markup }) => Axios.put(`${BASE_URL}/${id}`, {
    markup,
  })
    .then(response => response.data.data)
    .catch(err => {
      throw new Error(err);
    }),
};
