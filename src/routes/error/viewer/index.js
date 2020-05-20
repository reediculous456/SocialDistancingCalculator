const StillTranslatingError = () => import(`@/pages/error/viewer/StillTranslatingError`);
const TranslationFailedError = () => import(`@/pages/error/viewer/TranslationFailedError`);
const BASE_URL = `/error/viewer`;

export default [
  {
    component: StillTranslatingError,
    meta: {
      title: `Still translating`,
    },
    path: `${BASE_URL}/still-translating/:floor_id/:urn_string`,
  },
  {
    component: TranslationFailedError,
    meta: {
      title: `500 (translation Failed)`,
    },
    path: `${BASE_URL}/translation-failed/:message`,
  },
];
