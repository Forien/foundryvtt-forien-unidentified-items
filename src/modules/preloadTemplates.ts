import { FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME } from './settings';
export const preloadTemplates = async function () {
  const templatePaths = [
    // Add paths to "modules/VariantEncumbrance/templates"
    `/modules/${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}/templates/mystify-advanced.html`,
    `/modules/${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}/templates/settings-default-icons.html`,
    `/modules/${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}/templates/settings-item-properties.html`,
    // `/modules/${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}/templates/welcome-screen.html`,
  ];
  return loadTemplates(templatePaths);
};
