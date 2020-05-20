import Axios from '@/plugins/http.config';

const BASE_URL = `/change-request`;

export const ChangeRequestService = {
  create: ({ attributes, created_on, floor_id }) => Axios.post(`${BASE_URL}`, {
    request: {
      attributes,
      created_on,
      floor_id,
    },
  })
    .then(response => response.data.data.request)
    .catch(err => {
      throw new Error(err);
    }),

  delete: (id) => Axios.delete(`${BASE_URL}/${id}`)
    .then(response => response.data.data.request)
    .catch(err => {
      throw new Error(err);
    }),

  getForUrn: (urn_id) => Axios.get(`${BASE_URL}/urn/${urn_id}`)
    .then(response => response.data.data.requests)
    .catch(err => {
      throw new Error(err);
    }),

  setStatus: ({ comment, created_on, id, status_id }) => Axios.post(`${BASE_URL}/status`, {
    status: {
      change_request_id: id,
      comment,
      created_on,
      status_id,
    },
  })
    .then(response => response.data.data.request)
    .catch(err => {
      throw new Error(err);
    }),
};
