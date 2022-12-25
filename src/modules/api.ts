import type DefaultIcons from "./apps/DefaultIcons";
import CONSTANTS from "./constants";

const API = {
	get DEFAULT_PROPERTIES(): any {
		return game.settings.get(CONSTANTS.MODULE_NAME, "itemProperties");
	},

	/**
	 * The attributes used to track dynamic attributes in this system
	 *
	 * @returns {array}
	 */
	get DEFAULT_ICONS(): DefaultIcons {
		return <DefaultIcons>game.settings.get(CONSTANTS.MODULE_NAME, "defaultIcons");
	},
};

export default API;
