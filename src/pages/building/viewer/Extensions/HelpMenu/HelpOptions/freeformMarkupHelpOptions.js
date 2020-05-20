const OPTION_TITLE = `Creating a Freeform Markup`;

export const addFreeformMarkupHelpOptions = (markupHelpPanel) => {
  /* eslint-disable max-len */
  markupHelpPanel.displayProperty(OPTION_TITLE, NOP_VIEWER.container);
  markupHelpPanel.addProperty(`1.`, `Press the letter A on the toolbar.`, OPTION_TITLE);
  markupHelpPanel.addProperty(`2.`, `A menu on your left will appear.`, OPTION_TITLE);
  markupHelpPanel.addProperty(`3.`, `Select a mode (text/line) from the dropdown`, OPTION_TITLE);
  markupHelpPanel.addProperty(`3.`, `Choose a size (if unsure, start with a larger size)`, OPTION_TITLE);
  markupHelpPanel.addProperty(`4a.`, `For text, type the desired text into the box on the panel. Then click in the desired location to place markup`, OPTION_TITLE);
  markupHelpPanel.addProperty(`4b.`, `For line, click and drag the mouse anywhere (without letting go of your mouse button). Let go of the mouse button when you have made your desired line.`, OPTION_TITLE);
  markupHelpPanel.addProperty(`5.`, `Wait one second before leaving the page so it saves.`, OPTION_TITLE);
  markupHelpPanel.addProperty(`6.`, `Repeat, if needed.`, OPTION_TITLE);
  /* eslint-enable max-len */
};
