import constants from "./constants.mjs";
import Identification from "./Identification.js";

export default function registerDerivedItemSheetClass() {
  for (let k in CONFIG.Item.sheetClasses) {
    for (let l in CONFIG.Item.sheetClasses[k]) {
      let cls = CONFIG.Item.sheetClasses[k][l].cls;
      CONFIG.Item.sheetClasses[k][l].cls = getItemSheetClass(cls, l);
    }
  }
}

function getItemSheetClass(cls, sheet) {
  const ParentClass = cls;

  const ItemClass = class extends ParentClass {
    /** @override */
    _getHeaderButtons() {
      const buttons = super._getHeaderButtons();
      const canIdentify = game.user.isGM;
      if (!canIdentify) return buttons;
      if (this.item.data.isAbstract) return buttons;

      let origData = this.item.getFlag(constants.moduleName, "origData");

      if (origData) {
        buttons.unshift({
          label: "ForienUnidentifiedItems.Identify",
          class: "identify-item",
          icon: "fas fa-search",
          onclick: ev => {
            Identification.identify(this.item);
          }
        });

        buttons.unshift({
          label: "ForienUnidentifiedItems.Peek",
          class: "peek-original-item",
          icon: "far fa-eye",
          onclick: ev => {
            origData.isAbstract = true;
            const entity = new CONFIG.Item.entityClass(origData, {editable: false});
            const sheet = entity.sheet;
            sheet.render(true);
          }
        });
      } else {
        buttons.unshift({
          label: "ForienUnidentifiedItems.Mystify",
          class: "mystify-item",
          icon: "far fa-eye-slash",
          onclick: ev => {
            Identification.mystify(this.item.uuid);
          }
        });
      }
      return buttons;
    }

    async _updateObject(...args) {
      if (this.item.data.isAbstract) return this;
      return super._updateObject(...args);
    }
  };

  let sheetName = sheet.split('.');
  sheetName = sheetName[1];

  // Because FireFox is stupid
  Object.defineProperty(ItemClass, 'name', {value: sheetName});

  return ItemClass;
}
