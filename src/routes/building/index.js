const BuildingList = () => import(`@/pages/building/list/BuildingList`);
const BuildingProfile = () => import(`@/pages/building/profile/BuildingProfile`);
const AutodeskViewer = () => import(`@/pages/building/viewer/ViewerWrapper`);
const BASE_URL = `/building`;

export default [
  {
    component: BuildingList,
    meta: {
      title: `Buildings`,
    },
    path: `${BASE_URL}/list`,
  },
  {
    component: BuildingProfile,
    path: `${BASE_URL}/:building_id/profile`,
  },
  {
    component: AutodeskViewer,
    path: `${BASE_URL}/:floor_id/viewer`,
  },
];
