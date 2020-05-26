<template>
  <div id="forgeViewer" />
</template>

<script>
import arrify from 'arrify';
import ButtonLoader from './Extensions/ButtonLoader/extension';
import { MeasureExtension } from './Extensions/MeasureExtension/Measure';
import { EXTENSIONS } from './Extensions/viewerConstants';
import { ForgeService, UrnService } from '@/services';

export default {
  name: `autodesk-viewer`,
  data() {
    return {
      documentId: null,
      urn: null,
      viewer: null,
      error_types: {
        UNAUTHORIZED: 4,
        NOT_FOUND: 5,
        STILL_TRANSLATING: 9,
      },
      options: {
        env: `AutodeskProduction`,
        getAccessToken: ForgeService.getToken,
      },
    };
  },
  async mounted() {
    [ this.urn ] = await UrnService.getCurrentForFloors(arrify(this.$route.params.floor_id));
    if (this.urn) {
      document.title = `${this.urn.floor.fname}`;
      this.documentId = `urn:${this.urn.urn_string}`;
    } else {
      const errorMessage = `A file upload could not be found for this floor`;
      this.$router.push(`/error/404/${errorMessage}`);
    }
    Autodesk.Viewing.Initializer(this.options, this.onInitialized);
  },
  methods: {
    onInitialized() {
      const viewerDiv = document.getElementById(`forgeViewer`);
      this.viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerDiv);
      this.viewer.start();
      this.loadDocument();
      Autodesk.Viewing.theExtensionManager.registerExtension(EXTENSIONS.buttonLoader, ButtonLoader);
      Autodesk.Viewing.theExtensionManager.registerExtension(EXTENSIONS.itscMeasure, MeasureExtension);
    },
    loadDocument() {
      Autodesk.Viewing.Document.load(
        this.documentId,
        this.onDocumentLoadSuccess,
        this.onDocumentLoadFailure,
      );
    },
    onDocumentLoadSuccess(doc) {
      if (doc.myData.status === `failed`) {
        const errorMessage = doc.myData;
        this.$router.push(`/error/viewer/translation-failed/${encodeURIComponent(JSON.stringify(errorMessage))}`);
      }
      else {
        $(`.navbar`).css(`margin-bottom`, `0`);
        $(`body`).css(`overflow`, `hidden`);
        $(`#footer`).css(`display`, `none`);

        const viewable = doc.getRoot().search({ type: `geometry`, role: `2d` });

        if (viewable.length === 0) {
          return;
        }

        this.viewer.loadDocumentNode(doc, viewable[0])
          .then(this.onModelLoadSuccess);
      }
    },
    onDocumentLoadFailure(viewerErrorCode) {
      if (viewerErrorCode === this.error_types.STILL_TRANSLATING) {
        this.$router.push(`/error/viewer/still-translating/${this.urn.floor_id}/${this.urn.urn_string}`);
      } else if (viewerErrorCode === this.error_types.UNAUTHORIZED) {
        const errorMessage = `You are unauthorized to view this file. Please contact support for more information.`;
        this.$router.push(`/error/403/${errorMessage}`);
      } else if (viewerErrorCode === this.error_types.NOT_FOUND) {
        const errorMessage = `Could not find the urn referenced. Please contact support for more information.`;
        this.$router.push(`/error/404/${errorMessage}`);
      }
      console.error(`Document Load Failure - errorCode: ${viewerErrorCode}`); // eslint-disable-line no-console
    },
    onModelLoadSuccess() {
      this.viewer.addEventListener(Autodesk.Viewing.EXTENSION_LOADED_EVENT, this.onExtensionLoaded);
      this.viewer.addEventListener(Autodesk.Viewing.EXTENSION_UNLOADED_EVENT, this.onExtensionUnloaded);
      const navTools = this.viewer.toolbar.getControl(`navTools`);
      navTools.removeControl(`toolbar-cameraSubmenuTool`);
      const settingsTools = this.viewer.toolbar.getControl(`settingsTools`);
      settingsTools.removeControl(`toolbar-fullscreenTool`);
      this.viewer.loadExtension(EXTENSIONS.buttonLoader, { urn: this.urn });
    },
    onExtensionLoaded(event) {
      const { extensionId } = event;
      if (extensionId === `Autodesk.PropertiesManager`) {
        this.viewer.unloadExtension(`Autodesk.PropertiesManager`);
      } else if (extensionId === EXTENSIONS.autodeskMeasure) {
        this.viewer.unloadExtension(EXTENSIONS.autodeskMeasure);
      } else if (extensionId === EXTENSIONS.itscMeasure) {
        const extension = this.viewer.getExtension(EXTENSIONS.itscMeasure);
        extension.setUnits(`decimal-ft`);
        extension.setFreeMeasureMode(true);
        const measureTools = this.viewer.toolbar.getControl(`measureTools`);
        measureTools.removeControl(`toolbar-measureTool-angle`);
        measureTools.removeControl(`toolbar-calibrationTool`);
      }
    },
    onExtensionUnloaded(event) {
      const { extensionId } = event;
      if (extensionId === EXTENSIONS.autodeskMeasure) {
        this.viewer.loadExtension(EXTENSIONS.itscMeasure, { urn: this.urn });
      }
    },
  },
};
</script>

<style lang="scss">
  #forgeViewer {
    width: 100vw;
    height: 100vh;
    position: relative;
    display: inline-block;
    margin: 0;
  }

  #guiviewer3d-toolbar {
    margin-bottom: 4rem;
  }

  @media (hover: none) and (pointer: coarse) {
    #guiviewer3d-toolbar {
      margin-bottom: 12rem;
    }
  }

  @media (hover: none) and (pointer: coarse) and (orientation: landscape) {
    #guiviewer3d-toolbar {
      margin-bottom: 4.5rem;
    }
  }
</style>
