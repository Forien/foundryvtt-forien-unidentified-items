import constants from "./constants.mjs";

export default class Identification {

  /**
   *
   * @hook "forien-unidentified-items:onMystifyItem"
   *
   * @param itemUuid
   * @param options
   * @returns {Promise<void>}
   */
  static async mystify(itemUuid, options = {replace: false, mystifiedData: undefined}) {
    if (!game.user.isGM) return;
    let item;

    console.log(itemUuid);
    item = await this.itemFromUuid(itemUuid);

    if (!item) {
      ui.notifications.error("ForienUnidentifiedItems.NotAnItem", {});
      return;
    }

    const origData = duplicate(item);
    let mystifiedData = options.mystifiedData;

    if (mystifiedData === undefined)
      mystifiedData = await this.getMystifiedData(origData);

    Hooks.call(`${constants.moduleName}:onMystifyItem`, item, origData, mystifiedData, options);

    let mystifiedItem;
    if (options.replace) {
      let template = {data: game.system.model.Item[item.type]};
      mystifiedData = mergeObject(template, mystifiedData);
      await item.update(mystifiedData);
      mystifiedItem = item;
    } else {
      mystifiedItem = await Item.create(mystifiedData);
    }

    await mystifiedItem.setFlag(constants.moduleName, "origData", origData);
  }

  /**
   *
   * @param itemUuid
   * @returns {Promise<void>}
   */
  static async mystifyReplace(itemUuid) {
    await this.mystify(itemUuid, {replace: true})
  }

  /**
   *
   * @param itemUuid
   * @returns {Promise<void>}
   */
  static async mystifyAsDialog(itemUuid) {

  }

  /**
   *
   * @param itemUuid
   * @returns {Promise<void>}
   */
  static async mystifyAdvancedDialog(itemUuid) {

  }

  /**
   *
   * @hook "forien-unidentified-items:onIdentifyItem"
   *
   * @param item
   * @returns {Promise<void>}
   */
  static async identify(item) {
    const origData = item.getFlag(constants.moduleName, "origData");
    let hook = Hooks.call(`${constants.moduleName}:onIdentifyItem`, item, origData);
    if (hook !== false) {
      await item.update(origData);
      await item.unsetFlag(constants.moduleName, "origData");
    }
  }

  /**
   *
   * @param origData
   * @returns {Promise<{img: (*|string), name: String, type: *}>}
   */
  static async getMystifiedData(origData) {
    let iconSettings = game.settings.get(constants.moduleName, "defaultIcons");
    let iconType = getProperty(iconSettings, origData.type) || `${constants.modulePath}/icons/${constants.defaultIcon}`;

    let mystifiedData = {
      name: game.i18n.localize("ForienUnidentifiedItems.NewMystified"),
      type: origData.type,
      img: iconType,
      data: {
        identified: false
      }
    };

    let defaultProperties = game.settings.get(constants.moduleName, "itemProperties");
    let itemProperties = defaultProperties[origData.type];
    itemProperties = Object.entries(itemProperties).filter(p => p[1]).map(p => p[0]);

    itemProperties.forEach(property => {
      property = "data." + property;
      setProperty(mystifiedData, property, getProperty(origData, property));
    });

    return mystifiedData;
  }

  /**
   *
   * @param uuid
   * @returns {Promise<Item|null>}
   */
  static async itemFromUuid(uuid) {
    const parts = uuid.split(".");
    const [entityName, entityId, embeddedName, embeddedId] = parts;

    if (embeddedName === "OwnedItem") {
      if (parts.length === 4) {
        const actor = game.actors.get(entityId);
        if (actor === null) return null;

        return actor.items.get(embeddedId);
      }
    } else {
      return fromUuid(uuid);
    }

    return null;
  }
}