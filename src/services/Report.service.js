import Axios from '@/plugins/http.config';

const BASE_URL = `/report`;

export const ReportService = {
  getDistrictStatusReport: () => Axios.get(`${BASE_URL}/graphical/district-status`)
    .then(response => response.data.data)
    .catch(err => {
      throw new Error(err);
    }),
};
