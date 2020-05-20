import Axios from '@/plugins/http.config';

const BASE_URL = `/user`;

export const UserService = {
  getAdmins: () => Axios.get(`${BASE_URL}/list/admins`)
    .then(response => response.data.data.users)
    .catch(err => {
      throw new Error(err);
    }),

  getForBuilding: (building_id) => Axios.get(`${BASE_URL}/list/building/${building_id}`)
    .then(response => response.data.data.users)
    .catch(err => {
      throw new Error(err);
    }),

  getForUrn: (urn_id) => Axios.get(`${BASE_URL}/list/urn/${urn_id}`)
    .then(response => response.data.data.users)
    .catch(err => {
      throw new Error(err);
    }),
};
