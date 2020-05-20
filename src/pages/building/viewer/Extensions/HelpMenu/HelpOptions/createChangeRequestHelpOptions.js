const OPTION_TITLE = `Creating a Change Request`;

export const addCreateChangeRequestHelpOptions = (markupHelpPanel) => {
  /* eslint-disable max-len */
  markupHelpPanel.displayProperty(OPTION_TITLE, NOP_VIEWER.container);
  markupHelpPanel.addProperty(`1.`, `Click on the pointing finger icon.`, OPTION_TITLE);
  markupHelpPanel.addProperty(`2.`, `A menu will appear on the left asking you to make a selection.`, OPTION_TITLE);
  markupHelpPanel.addProperty(`3.`, `Make your selection. Left click on any object to do this. Note: you can select multiple things by holding control.`, OPTION_TITLE);
  markupHelpPanel.addProperty(`4.`, `Type into the input box what you would like changed about these selections.`, OPTION_TITLE);
  markupHelpPanel.addProperty(`5.`, `Press submit.`, OPTION_TITLE);
  markupHelpPanel.addProperty(`6.`, `Your change request is now submitted, and you can view it. Note: some extra ids are inserted in brackets to make CAD changes easier.`, OPTION_TITLE);
  markupHelpPanel.addProperty(`7.`, `Repeat, if needed.`, OPTION_TITLE);
  /* eslint-enable max-len */
};
