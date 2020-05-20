const Help = () => import(`@/pages/help/Help`);
const BASE_URL = `/help`;

export default [
  {
    component: Help,
    meta: {
      title: `Help`,
    },
    path: `${BASE_URL}`,
  },
];
