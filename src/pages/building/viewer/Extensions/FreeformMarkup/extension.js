import Vue from 'vue';
import {
  COLORS, CUSTOM_TOOLBAR, EXTENSIONS, FONTS, FREEFORM_MODES,
  ID_INCREMENT, LEFT_MOUSE_BUTTON, STROKES, TOOLBAR_BUTTON_IDS,
} from '../viewerConstants';
import {
  deleteMarkup, detectMarkup, loadSingleMarkup, makeToolbarVisible,
  setSingleStyle, setViewerStyle,
} from '../viewerFunctions';
import FreeformMarkupPanel from './Panel';
import mobileDetect from '@/plugins/mobileDetect';
import { FreeformMarkupService } from '@/services';
import toastr from '@/plugins/notifications';

export default class FreeformTool extends Autodesk.Viewing.Extension {
  constructor(viewer, options) {
    super(viewer, options);
    this.viewer = viewer;
    this.urn = options.urn;
    this.cancel_creation = false;
  }

  load() {
    this.viewer.unloadExtension(EXTENSIONS.changeRequestView);
    this.viewer.unloadExtension(EXTENSIONS.changeRequestCreate);
    this.viewer.unloadExtension(EXTENSIONS.viewAllMarkups);
    this.createPanel();
    return true;
  }

  unload() {
    this.panel.$destroy();
    this.viewer.unloadExtension(EXTENSIONS.markupsCore);
    const button = this.viewer.toolbar
      .getControl(CUSTOM_TOOLBAR)
      .getControl(TOOLBAR_BUTTON_IDS.freeformMarkup);
    button.setState(Autodesk.Viewing.UI.Button.State.INACTIVE);

    $(document).off(`mouseup`);
    $(document).off(`keydown`);
    $(this.MarkupPanel.container).remove();
    return true;
  }

  createPanel() {
    const toolPrototype = this;

    this.MarkupPanel = new Autodesk.Viewing.UI.DockingPanel(
      this.viewer.container,
      `FreeformMarkupPanel`,
      `Freeform Markups`,
    );
    this.MarkupPanel.container.classList.add(`docking-panel-container-solid-color-a`);
    this.MarkupPanel.container.style.top = `200px`;
    this.MarkupPanel.container.style.left = `10px`;
    this.MarkupPanel.container.style.height = `420px`;
    this.MarkupPanel.container.style.width = `300px`;
    this.MarkupPanel.container.style.resize = `none`;
    $(this.MarkupPanel.container).find(`.docking-panel-close`).remove();
    $(this.MarkupPanel.container).find(`.docking-panel-footer-resizer`).remove();
    $(this.MarkupPanel.container).append(`<div id="freeform-markup-panel" />`);

    this.panel = new Vue({
      el: `#freeform-markup-panel`,
      render: h => h(FreeformMarkupPanel, {
        props: {
          urn: this.urn,
        },
      }),
    });
    this.panel.$on(`closed`, () => {
      toolPrototype.viewer.unloadExtension(EXTENSIONS.freeformMarkup);
    });
    this.panel.$on(`size-changed`, toolPrototype.sizeSelectionChanged.bind(toolPrototype));

    this.freeformMarkupHandler();
    this.MarkupPanel.setVisible(true);
  }

  onCreationEnd(event) {
    const latestMarkup = this.markupTool.markups[this.markupTool.markups.length - 1];

    if (latestMarkup.size.x !== 0 && latestMarkup.size.y !== 0 && !event.creationCancelled && !this.cancel_creation) {
      if (latestMarkup.type === `label`) {
        this.panel.$emit(`create-text`, latestMarkup);
      } else if (latestMarkup.type === `freehand`) {
        this.handleLineCreation(latestMarkup, this.markupTool, FREEFORM_MODES.FREE_LINE);
      } else if (latestMarkup.type === `polyline`) {
        this.handleLineCreation(latestMarkup, this.markupTool, FREEFORM_MODES.POLYLINE);
      }
    }
  }

  onEditModeChanged(event) {
    let newMode;
    switch (event.target.type) {
      case `label`:
        newMode = FREEFORM_MODES.TEXT;
        break;
      case `freehand`:
        newMode = FREEFORM_MODES.FREE_LINE;
        break;
      case `polyline`:
        newMode = FREEFORM_MODES.POLYLINE;
        break;
    }
    this.panel.$emit(`mode-changed`, newMode);
    event.target.editor.editMode.addEventListener(
      Autodesk.Viewing.Extensions.Markups.Core.EVENT_EDITMODE_CREATION_END,
      this.onCreationEnd.bind(this),
    );
  }

  freeformMarkupHandler() {
    const toolPrototype = this;
    $(document).off(`mouseup`);
    this.viewer.loadExtension(EXTENSIONS.markupsCore)
      .then((markupTool) => {
        toolPrototype.markupTool = markupTool;
        markupTool.addEventListener(Autodesk.Viewing.Extensions.Markups.Core.EVENT_EDITMODE_CHANGED,
          toolPrototype.onEditModeChanged.bind(toolPrototype));
        toolPrototype.panel.$on(`change-mode`, (mode) => {
          toolPrototype.switchMarkupModes(mode, markupTool);
        });
        toolPrototype.panel.$on(`text-created`, (latestMarkup) => {
          toolPrototype.handleFreeTextCreation(latestMarkup, markupTool);
        });

        markupTool.enterEditMode();

        FreeformMarkupService.getAllByUrn({ urn_id: toolPrototype.urn.id })
          .then(markups => {
            toolPrototype.loadFreeformMarkups(markups);
          })
          .catch(() => {
            toastr.error(`An error occured fetching freeform markups`);
          });

        // See markupTool docs, this stuff is exactly the same.
        $(document).keydown(function(e) {
          // check to see if the user wants to delete the markup
          if (
            e.keyCode === Autodesk.Viewing.KeyCode.BACKSPACE ||
            e.keyCode === Autodesk.Viewing.KeyCode.DELETE && $(this).attr(`id`) !== `areaInput`
          ) {
            const selection = toolPrototype.markupTool.getSelection();
            if (selection) {
              toolPrototype.updateFreeformMarkup(selection, new Date());
            }
          } else if (e.keyCode === Autodesk.Viewing.KeyCode.ESCAPE) {
            toolPrototype.cancel_creation = true;
            toolPrototype.markupTool.onUserCancel();
          }
        });

        if (mobileDetect.mobile()) {
          document.addEventListener(`long-press`, (e) => {
            if (detectMarkup(e)) {
              if (confirm(`Would you like to delete this markup?`)) {
                const selection = toolPrototype.markupTool.getSelection();
                if (selection) {
                  toolPrototype.updateFreeformMarkup(selection, new Date());
                  deleteMarkup(markupTool, selection);
                }
              }
            }
          });
        }

        $(document).on(`mouseup touchend`, (e) => {
          if (detectMarkup(e) && (e.button === LEFT_MOUSE_BUTTON || e.type === `touchend`)) {
            toolPrototype.cancel_creation = false;

            if (toolPrototype.markupTool) {
              const selection = markupTool.getSelection();

              if (selection) {
                if (selection.type !== `polyline` || selection.selected) {
                  toolPrototype.panel.$emit(`selection-changed`, selection);
                  toolPrototype.updateFreeformMarkup(selection);
                }
              }
            }
          }
        });
      });
  }

  switchMarkupModes(id, markupTool) {
    let newEditMode;
    switch (Number(id)) {
      case FREEFORM_MODES.FREE_LINE:
        newEditMode = new Autodesk.Viewing.Extensions.Markups.Core.EditModeFreehand(markupTool);
        break;
      case FREEFORM_MODES.TEXT:
        newEditMode = new Autodesk.Viewing.Extensions.Markups.Core.EditModeText(markupTool);
        break;
      case FREEFORM_MODES.POLYLINE:
        newEditMode = new Autodesk.Viewing.Extensions.Markups.Core.EditModePolyline(markupTool);
        break;
    }
    markupTool.changeEditMode(newEditMode);
  }

  sizeSelectionChanged(size) {
    if (this.markupTool) {
      let fontSize;
      let strokeWidth;

      switch (size) {
        case `xxsSize`:
          fontSize = FONTS.EXTRA_EXTRA_SMALL_FONT_SIZE;
          strokeWidth = STROKES.EXTRA_SMALL_STROKE_WIDTH;
          break;
        case `xsSize`:
          fontSize = FONTS.EXTRA_SMALL_FONT_SIZE;
          strokeWidth = STROKES.EXTRA_SMALL_STROKE_WIDTH;
          break;
        case `smSize`:
          fontSize = FONTS.SMALL_FONT_SIZE;
          strokeWidth = STROKES.SMALL_STROKE_WIDTH;
          break;
        case `mdSize`:
          fontSize = FONTS.MEDIUM_FONT_SIZE;
          strokeWidth = STROKES.DEFAULT_STROKE_WIDTH;
          break;
        case `lgSize`:
          fontSize = FONTS.LARGE_FONT_SIZE;
          strokeWidth = STROKES.LARGE_STROKE_WIDTH;
          break;
        case `xlgSize`:
          fontSize = FONTS.X_LARGE_FONT_SIZE;
          strokeWidth = STROKES.LARGE_STROKE_WIDTH;
          break;
        case `xxlgSize`:
          fontSize = FONTS.XX_LARGE_FONT_SIZE;
          strokeWidth = STROKES.LARGE_STROKE_WIDTH;
          break;
        case `xxxlgSize`:
          fontSize = FONTS.XXX_LARGE_FONT_SIZE;
          strokeWidth = STROKES.LARGE_STROKE_WIDTH;
          break;
      }

      setViewerStyle(this.markupTool, { color: COLORS.FREEFORM_GREEN, fontSize, strokeWidth });
      const selection = this.markupTool.getSelection();
      if (selection) {
        this.updateFreeformMarkup(selection);
      }
    }
  }

  loadFreeformMarkups(markups) {
    markups.forEach(markup => {
      if (markup.type_id === FREEFORM_MODES.TEXT) {
        const markupObject = {
          height: markup.height,
          id: markup.id,
          text: markup.attributes.text,
          width: markup.width,
          x: markup.x,
          y: markup.y,
        };

        loadSingleMarkup(markupObject, this.markupTool, { color: COLORS.FREEFORM_GREEN, fontSize: markup.size });
      } else if (markup.type_id === FREEFORM_MODES.FREE_LINE) {
        this.loadSingleFreehandMarkup(markup, this.markupTool);
      } else if (markup.type_id === FREEFORM_MODES.POLYLINE) {
        this.loadSinglePolylineMarkup(markup, this.markupTool);
      }
    });

    this.switchMarkupModes(FREEFORM_MODES.TEXT, this.markupTool);

    makeToolbarVisible();
  }

  handleFreeTextCreation(latestMarkup, markupTool) {
    const toolPrototype = this;

    setTimeout(() => {
      if ($(`textArea`).val() === `` || $(`textArea`).val() === undefined) {
        deleteMarkup(markupTool, latestMarkup);
      } else {
        toolPrototype.saveFreeformMarkup(latestMarkup, markupTool);
      }
    }, 100);
  }

  saveFreeformMarkup(markup, markupTool) {
    const markupObject = {
      attributes: { text: markup.currentText },
      height: markup.size.y,
      size: markup.style[`font-size`].toString(),
      type_id: FREEFORM_MODES.TEXT,
      urn_id: this.urn.id,
      width: markup.size.x,
      x: markup.position.x,
      y: markup.position.y,
    };

    FreeformMarkupService.create(markupObject)
      .then(newMarkup => {
        markupTool.onMouseDown({ target: null });
        const latestMarkup = markupTool.markups[markupTool.markups.length - 1];
        latestMarkup.id = newMarkup.id + ID_INCREMENT;
        latestMarkup.updateStyle();
        toastr.success(`Successfully saved your markup!`);
      })
      .catch(() => {
        markupTool.onMouseDown({ target: null });
        deleteMarkup(markupTool, markup);
        toastr.error(`An error occured while saving your markup.`);
      });
  }

  updateFreeformMarkup(markup, deleted_on) {
    FreeformMarkupService.getById(markup.id - ID_INCREMENT)
      .then(originalMarkup => {
        const markupObject = {
          deleted_on,
          height: markup.size.y,
          width: markup.size.x,
          x: markup.position.x,
          y: markup.position.y,
        };

        if (markup.type === `label`) {
          markupObject.size = markup.style[`font-size`];
        } else if (markup.type === `freehand` || markup.type === `polyline`) {
          markupObject.size = markup.style[`stroke-width`];
        }

        if (originalMarkup.x !== markupObject.x ||
            originalMarkup.y !== markupObject.y ||
            originalMarkup.width !== markupObject.width ||
            originalMarkup.height !== markupObject.height ||
            originalMarkup.size !== markupObject.size ||
            originalMarkup.deleted_on !== markupObject.deleted_on) {
          FreeformMarkupService.update({
            id: markup.id - ID_INCREMENT,
            markup: markupObject,
          })
            .then(() => {
              if (markupObject.deleted_on) {
                toastr.success(`Successfully deleted your markup!`);
              } else {
                toastr.success(`Successfully updated your markup!`);
              }
            })
            .catch(() => {
              if (markupObject.deleted_on) {
                toastr.error(`An error occured while deleting your markup.`);
              } else {
                toastr.error(`An error occured while updating your markup.`);
              }
            });
        }
      })
      .catch(() => {
        toastr.error(`An error occured while updating your markup.`);
      });
  }

  handleLineCreation(markup, markupTool, type_id) {
    const markupObject = {
      height: markup.size.y,
      size: markup.style[`stroke-width`].toString(),
      type_id,
      urn_id: this.urn.id,
      width: markup.size.x,
      x: markup.position.x,
      y: markup.position.y,
    };

    if (type_id === FREEFORM_MODES.FREE_LINE) {
      markupObject.attributes = JSON.stringify(markup.locations);
    } else if (type_id === FREEFORM_MODES.POLYLINE) {
      markupObject.attributes = JSON.stringify({ closed: markup.closed, locations: markup.locations });
    }

    FreeformMarkupService.create(markupObject)
      .then(createdMarkup => {
        markup.id = createdMarkup.id + ID_INCREMENT;
        toastr.success(`Successfully saved your markup!`);
      })
      .catch(() => {
        deleteMarkup(markupTool, markup);
        toastr.error(`An error occured while saving your markup.`);
      });
  }

  loadSingleFreehandMarkup(markup, markupTool) {
    const MarkupsCore = Autodesk.Viewing.Extensions.Markups.Core;
    const line = new MarkupsCore.MarkupFreehand(markup.id + ID_INCREMENT, markupTool);
    line.locations = markup.attributes;
    markupTool.addMarkup(line);
    line.position = { x: markup.x, y: markup.y };
    line.size = { x: markup.width, y: markup.height };

    const styleObject = setSingleStyle(markupTool, { color: COLORS.FREEFORM_GREEN, strokeWidth: markup.size });
    line.setStyle(styleObject);
  }

  loadSinglePolylineMarkup(markup, markupTool) {
    const MarkupsCore = Autodesk.Viewing.Extensions.Markups.Core;

    const line = new MarkupsCore.MarkupPolyline(markup.id + ID_INCREMENT, markupTool);
    const properties = markup.attributes;
    line.locations = properties.locations;
    line.closed = properties.closed;
    markupTool.addMarkup(line);
    line.position = { x: markup.x, y: markup.y };
    line.size = { x: markup.width, y: markup.height };

    const styleObject = setSingleStyle(markupTool, { color: COLORS.FREEFORM_GREEN, strokeWidth: markup.size });
    line.setStyle(styleObject);
  }
}
