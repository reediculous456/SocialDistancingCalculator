import AdminRoute from './admin';
import DashboardRoute from './dashboard';
import ErrorRoute from './error';
import HelpRoute from './help';
import ReportsRoute from './reports';
import BuildingRoute from './building';

export default [
  { path: `/`, redirect: `/building/list` },
  ...AdminRoute,
  ...DashboardRoute,
  ...HelpRoute,
  ...BuildingRoute,
  ...ReportsRoute,
  // Error routes must be last!
  ...ErrorRoute,
];
