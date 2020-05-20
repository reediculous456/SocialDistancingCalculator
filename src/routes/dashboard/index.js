const Dashboard = () => import(`@/pages/dashboard/Dashboard`);
const BASE_URL = `/dashboard`;

export default [
  {
    component: Dashboard,
    meta: {
      title: `Dashboard`,
    },
    path: `${BASE_URL}`,
  },
];
