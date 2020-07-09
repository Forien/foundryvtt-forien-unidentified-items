import constants from "./constants.mjs";
import Identification from "./Identification.js";

export default function registerContextMenuHook() {
  Hooks.on('getItemDirectoryEntryContext', (html, entryOptions) => {
    entryOptions.unshift({
      name: "ForienUnidentifiedItems.Mystify",
      icon: '<i class="far fa-eye-slash"></i>',
      condition: li => {
        if (!game.user.isGM) return false;

        const id = li[0].dataset.entityId;
        const item = game.items.get(id);
        const origData = item.getFlag(constants.moduleName, "origData");
        if (origData) return false;

        return true;
      },
      callback: li => {
        const id = li[0].dataset.entityId;
        Identification.mystify(`Item.${id}`);
      }
    });

    entryOptions.unshift({
      name: "ForienUnidentifiedItems.Identify",
      icon: '<i class="fas fa-search"></i>',
      condition: li => {
        if (!game.user.isGM) return false;

        const id = li[0].dataset.entityId;
        const item = game.items.get(id);
        const origData = item.getFlag(constants.moduleName, "origData");
        if (origData) return true;

        return false;
      },
      callback: li => {
        const id = li[0].dataset.entityId;
        const item = game.items.get(id);
        Identification.identify(item);
      }
    });

    entryOptions.unshift({
      name: "ForienUnidentifiedItems.Peek",
      icon: '<i class="far fa-eye"></i>',
      condition: li => {
        if (!game.user.isGM) return false;

        const id = li[0].dataset.entityId;
        const item = game.items.get(id);
        const origData = item.getFlag(constants.moduleName, "origData");
        if (origData) return true;

        return false;
      },
      callback: li => {
        const id = li[0].dataset.entityId;
        const item = game.items.get(id);
        const origData = item.getFlag(constants.moduleName, "origData");
        origData.isAbstract = true;
        const entity = new CONFIG.Item.entityClass(origData, {editable: false});
        const sheet = entity.sheet;
        sheet.render(true);
      }
    });
  });
}