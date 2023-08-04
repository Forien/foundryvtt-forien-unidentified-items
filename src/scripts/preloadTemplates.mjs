import CONSTANTS from "./constants";

export const preloadTemplates = async function () {
  const templatePaths = [
    // Add paths to "modules/VariantEncumbrance/templates"
    `/scripts/${CONSTANTS.MODULE_NAME}/templates/mystify-advanced.html`,
    `/scripts/${CONSTANTS.MODULE_NAME}/templates/settings-default-icons.html`,
    `/scripts/${CONSTANTS.MODULE_NAME}/templates/settings-item-properties.html`
    // `/scripts/${CONSTANTS.MODULE_NAME}/templates/welcome-screen.html`,
  ];
  return loadTemplates(templatePaths);
};
