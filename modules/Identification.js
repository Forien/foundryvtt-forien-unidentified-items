import constants from "./constants.mjs";

export default class Identification {

  static async mystify(itemUuid) {
    if (!game.user.isGM) return;
    let item;

    item = await fromUuid(itemUuid);

    if (!item) {
      ui.notifications.error("ForienUnidentifiedItems.NotAnItem", {});
      return;
    }

    const origData = duplicate(item);
    let iconSettings = game.settings.get(constants.moduleName, "defaultIcons");
    let iconType = getProperty(iconSettings, origData.type) || `${constants.modulePath}/icons/${constants.defaultIcon}`;

    let mystifiedData = {
      name: game.i18n.localize("ForienUnidentifiedItems.NewMystified"),
      type: origData.type,
      img: iconType
    };

    let defaultProperties = game.settings.get(constants.moduleName, "itemProperties");
    let itemProperties = defaultProperties[origData.type];
    itemProperties = Object.entries(itemProperties).filter(p => p[1]).map(p => p[0]);

    itemProperties.forEach(property => {
      property = "data." + property;
      setProperty(mystifiedData, property, getProperty(origData, property));
    });

    Hooks.call(`${constants.moduleName}:onMystifyItem`, item, origData, mystifiedData);

    const mystifiedItem = await Item.create(mystifiedData);

    await mystifiedItem.setFlag(constants.moduleName, "origData", origData);
  }

  static async identify(item) {
    const origData = item.getFlag(constants.moduleName, "origData");
    let hook = Hooks.call(`${constants.moduleName}:onIdentifyItem`, item, origData);
    if (hook !== false) {
      await item.update(origData);
      await item.unsetFlag(constants.moduleName, "origData");
    }
  }
}