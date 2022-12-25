import CONSTANTS from "./constants";

export const preloadTemplates = async function () {
	const templatePaths = [
		// Add paths to "modules/VariantEncumbrance/templates"
		`/modules/${CONSTANTS.MODULE_NAME}/templates/mystify-advanced.html`,
		`/modules/${CONSTANTS.MODULE_NAME}/templates/settings-default-icons.html`,
		`/modules/${CONSTANTS.MODULE_NAME}/templates/settings-item-properties.html`,
		// `/modules/${CONSTANTS.MODULE_NAME}/templates/welcome-screen.html`,
	];
	return loadTemplates(templatePaths);
};
