import Axios from '@/plugins/http.config';

const BASE_URL = `/dashboard`;

export const DashboardService = {
  getAvgClosedChangeRequestCountPerDay: () => Axios.get(`${BASE_URL}/change-request/avg/closed`)
    .then(response => response.data.data.avgDays)
    .catch(err => {
      throw new Error(err);
    }),

  getAvgTimeToCompleteChangeRequest: () => Axios.get(`${BASE_URL}/change-request/avg/time/closed`)
    .then(response => response.data.data.avgDays)
    .catch(err => {
      throw new Error(err);
    }),

  getChangeRequestCountByDay: () => Axios.get(`${BASE_URL}/change-request/count/day`)
    .then(response => response.data.data.requestCounts)
    .catch(err => {
      throw new Error(err);
    }),

  getClosedChangeRequestCount: () => Axios.get(`${BASE_URL}/change-request/count/closed`)
    .then(response => response.data.data.requestCounts)
    .catch(err => {
      throw new Error(err);
    }),

  getOpenChangeRequestCount: () => Axios.get(`${BASE_URL}/change-request/count/open`)
    .then(response => response.data.data.requestCounts)
    .catch(err => {
      throw new Error(err);
    }),
};
