import DefaultIcons from "./apps/DefaultIcons.mjs";
import CONSTANTS from "./constants/constants.mjs";
import { MystifiedData } from "./ForienUnidentifiedItemsModels.mjs";
import Identification from "./ForienUnidentifiedItemsIdentification.mjs";
import SETTINGS from "./constants/settings.mjs";

const API = {
  get DEFAULT_PROPERTIES() {
    const settingDefaultProperties = game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.DEFAULT_PROPERTIES);
    if (settingDefaultProperties?.object) {
      return settingDefaultProperties.object;
    }
    return settingDefaultProperties;
  },

  /**
   * The attributes used to track dynamic attributes in this system
   *
   * @returns {array}
   */
  get DEFAULT_ICONS() {
    const settingDefaultIcons = game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.DEFAULT_ICONS);
    if (settingDefaultIcons?.object) {
      return settingDefaultIcons.object;
    }
    return settingDefaultIcons;
  },

  /**
   *
   * @hook 'forien-unidentified-items:onMystifyItem'
   *
   * @param {string} itemUuid
   * @param {Object} options
   * @param {boolean} options.replace - set true to replace provided item with mystified one
   * @param {MystifiedData|undefined} options.mystifiedData - item data object that should become front of mystified item
   * @returns {Promise<Item|undefined>}
   */
  async mystify(
    itemUuid,
    options = {
      replace: false,
      mystifiedData: undefined,
    }
  ) {
    return await Identification.mystify(itemUuid, options);
  },

  /**
   *
   * @param {string} itemUuid
   * @returns {Promise<Item|undefined>}
   */
  async mystifyReplace(itemUuid) {
    return await Identification.mystifyReplace(itemUuid);
  },

  /**
   *
   * @param {string} itemUuid
   * @returns {Promise<void>}
   */
  async mystifyAsDialog(itemUuid) {
    await Identification.mystifyAsDialog(itemUuid);
  },

  /**
   *
   * @param {string} itemUuid
   * @param {object} source
   * @returns {Promise<void>}
   */
  async mystifyAdvancedDialog(itemUuid, source = undefined) {
    await Identification.mystifyAdvancedDialog(itemUuid, source);
  },

  /**
   *
   * @hook 'forien-unidentified-items:onIdentifyItem'
   *
   * @param {Item} item
   * @returns {Promise<Item|undefined>}
   */
  async identify(item) {
    return await Identification.identify(item);
  },

  /**
   *
   * @param {Item} item
   * @return {boolean}
   */
  isMystified(item) {
    return Identification.isMystified(item);
  },

  /**
   *
   * @param {Item} item
   * @return {MystifiedData}
   */
  getOrigData(item) {
    return Identification.getOrigData(item);
  },

  /**
   *
   * @param {string} uuid
   * @return {boolean}
   */
  async isUuidMystified(uuid) {
    return await Identification.isUuidMystified(uuid);
  },
};

export default API;
