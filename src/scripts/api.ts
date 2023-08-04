import type DefaultIcons from "./apps/DefaultIcons";
import CONSTANTS from "./constants";
import type { MystifiedData } from "./ForienUnidentifiedItemsModels";
import Identification from "./ForienUnidentifiedItemsIdentification";

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
    itemUuid: string,
    options: { replace: boolean; mystifiedData: MystifiedData | undefined } = {
      replace: false,
      mystifiedData: undefined
    }
  ): Promise<Item | undefined> {
    return await Identification.mystify(itemUuid, options);
  },

  /**
   *
   * @param {string} itemUuid
   * @returns {Promise<Item|undefined>}
   */
  async mystifyReplace(itemUuid: string): Promise<Item | undefined> {
    return await Identification.mystifyReplace(itemUuid);
  },

  /**
   *
   * @param {string} itemUuid
   * @returns {Promise<void>}
   */
  async mystifyAsDialog(itemUuid: string): Promise<void> {
    await Identification.mystifyAsDialog(itemUuid);
  },

  /**
   *
   * @param {string} itemUuid
   * @param {object} source
   * @returns {Promise<void>}
   */
  async mystifyAdvancedDialog(itemUuid: string, source: any = undefined): Promise<void> {
    await Identification.mystifyAdvancedDialog(itemUuid, source);
  },

  /**
   *
   * @hook 'forien-unidentified-items:onIdentifyItem'
   *
   * @param {Item} item
   * @returns {Promise<Item|undefined>}
   */
  async identify(item: Item): Promise<Item | undefined> {
    return await Identification.identify(item);
  },

  /**
   *
   * @param {Item} item
   * @return {boolean}
   */
  isMystified(item: Item): boolean {
    return Identification.isMystified(item);
  },

  /**
   *
   * @param {Item} item
   * @return {MystifiedData}
   */
  getOrigData(item: Item): MystifiedData {
    return Identification.getOrigData(item);
  },

  /**
   *
   * @param {string} uuid
   * @return {boolean}
   */
  async isUuidMystified(uuid): Promise<boolean> {
    return await Identification.isUuidMystified(uuid);
  }
};

export default API;
