const OPTION_TITLE = `Viewing All Markups`;

export const addViewAllMarkupHelpOptions = (markupHelpPanel) => {
  markupHelpPanel.displayProperty(OPTION_TITLE, NOP_VIEWER.container);
  markupHelpPanel.addProperty(`1.`, `Click on the eyeball icon`, OPTION_TITLE);
  markupHelpPanel.addProperty(`2.`, `Select the Tasks or Assignees you want to see and click View`, OPTION_TITLE);
  markupHelpPanel.addProperty(`3.`, `You can now view all of the markups! You can pan/zoom around.`, OPTION_TITLE);
};
