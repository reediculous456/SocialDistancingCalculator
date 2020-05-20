const OPTION_TITLE = `Viewing a Change Request`;

export const addViewChangeRequestHelpOptions = (markupHelpPanel) => {
  markupHelpPanel.displayProperty(OPTION_TITLE, NOP_VIEWER.container);
  markupHelpPanel.addProperty(`1.`, `Press the list icon on the toolbar.`, OPTION_TITLE);
  markupHelpPanel.addProperty(`2.`, `A menu on your right will appear.`, OPTION_TITLE);
  markupHelpPanel.addProperty(`3.`, `Click on a change request, if there is one.`, OPTION_TITLE);
  markupHelpPanel.addProperty(`4.`, `The system will zoom in to the change request location.`, OPTION_TITLE);
};
