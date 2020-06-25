import constants from "./constants.mjs";

export default class Identification {

  static async mystify(itemId) {
    if (!game.user.isGM) return;

    const item = game.items.get(itemId);
    const origData = duplicate(item);

    let mystifiedData = {
      name: game.i18n.localize("ForienUnidentifiedItems.NewMystified"),
      type: origData.type,
      img: `modules/${constants.moduleName}/icons/unidentified.png`
    };

    Hooks.call(`${constants.moduleName}:onMystifyItem`, item, origData, mystifiedData);

    const mystifiedItem = await Item.create(mystifiedData);

    mystifiedItem.setFlag(constants.moduleName, "origData", origData);
  }

  static identify(item) {
    const origData = item.getFlag(constants.moduleName, "origData");
    let hook = Hooks.call(`${constants.moduleName}:onIdentifyItem`, item, origData);
    if (hook) {
      item.update(origData);
      item.unsetFlag(constants.moduleName, "origData");
    }
  }
}