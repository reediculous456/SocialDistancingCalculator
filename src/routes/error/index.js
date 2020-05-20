const Error403 = () => import(`@/pages/error/Error403`);
const Error404 = () => import(`@/pages/error/Error404`);
const Error500 = () => import(`@/pages/error/Error500`);
import ViewerErrors from './viewer';
const BASE_URL = `/error`;

export default [
  {
    component: Error403,
    meta: {
      title: `403 (Forbidden)`,
    },
    path: `${BASE_URL}/403/:message?`,
  },
  {
    component: Error404,
    meta: {
      title: `404 (Page Not Found)`,
    },
    path: `${BASE_URL}/404/:message?`,
  },
  {
    component: Error500,
    meta: {
      title: `500 (Server Error)`,
    },
    path: `${BASE_URL}/500/:message?`,
  },
  ...ViewerErrors,
  // This route must be last!
  {
    component: Error404,
    meta: {
      title: `404 (Page Not Found)`,
    },
    path: `*`,
  },
];
