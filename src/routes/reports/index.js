const ChangeRequestsReport = () => import(`@/pages/reports/changeRequests/ChangeRequestReport`);
const BASE_URL = `/report`;

export default [
  {
    component: ChangeRequestsReport,
    meta: {
      title: `SQFT - Change Request Report`,
    },
    path: `${BASE_URL}/change-requests`,
  },
];
