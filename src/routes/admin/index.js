const UserList = () => import(`@/pages/admin/user/list/UserList`);
const BuildingManagement = () => import(`@/pages/admin/building-management/BuildingManagement`);
const FloorPlanMgmtList = () => import(`@/pages/admin/floor-plan-management/list/FloorPlanManagementList`);
const FloorPlanMgmtUpload = () => import(`@/pages/admin/floor-plan-management/upload/FloorPlanManagement`);
const BASE_URL = `/admin`;

export default [
  {
    component: UserList,
    meta: {
      title: `Users`,
    },
    path: `${BASE_URL}/user/list`,
  },
  {
    component: BuildingManagement,
    meta: {
      title: `Building Management`,
    },
    path: `${BASE_URL}/building`,
  },
  {
    component: FloorPlanMgmtList,
    meta: {
      title: `Floor Plan Management`,
    },
    path: `${BASE_URL}/floors/list`,
  },
  {
    component: FloorPlanMgmtUpload,
    path: `${BASE_URL}/floors/upload/building/:building_id`,
  },
];
