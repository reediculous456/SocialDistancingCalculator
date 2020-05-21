<template>
  <viewer />
</template>

<script>
export default {
  name: `viewer-wrapper`,
  components: {
    Viewer: () => new Promise((resolve) => {
      const viewerCss = document.createElement(`link`);
      viewerCss.rel = `stylesheet`;
      viewerCss.href = `https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/style.min.css`;

      const viewerScript = document.createElement(`script`);
      viewerScript.onload = () => {
        resolve(import(`./AutodeskViewer`));
      };
      viewerScript.async = true;
      viewerScript.src = `https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.min.js`;

      document.head.appendChild(viewerCss);
      document.head.appendChild(viewerScript);
    }),
  },
  beforeRouteLeave(to, from, next) {
    this.removeAutodeskCode();
    $(`.navbar`).css(`margin-bottom`, `1.5rem`);
    $(`body`).removeAttr(`style`);
    $(`#footer`).removeAttr(`style`);
    next();
  },
  methods: {
    removeAutodeskCode() {
      $(`link[href*='developer.api.autodesk.com']`).remove();
      $(`script[src*='developer.api.autodesk.com']`).remove();
    },
  },
};
</script>
