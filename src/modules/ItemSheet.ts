import constants from "./constants";
import Identification from "./Identification";

export default function registerDerivedItemSheetClass() {
  for (let k in CONFIG.Item.sheetClasses) {
    for (let l in CONFIG.Item.sheetClasses[k]) {
      let cls = CONFIG.Item.sheetClasses[k][l].cls;
      //@ts-ignore
      CONFIG.Item.sheetClasses[k][l].cls = getItemSheetClass(cls, l);
    }
  }
}

function getItemSheetClass(cls, sheet) {
  const ParentClass = cls;

  const ItemClass = class extends ParentClass {

    constructor(...args) {
      super(...args);
      this.name = sheet.split(".")[1];
    }

    /**
     * Adds `[Mystified]` to the windows title if item is Mystified
     * Adds `[Original]` to the windows title if item is Original
     * @return {string}
     */
    get title() {
      let title = super.title;
      if (!game.user.isGM) return title;

      if (this.item.isMystified()) title = `[${game.i18n.localize('ForienUnidentifiedItems.Item.Mystified')}] ${title}`;
      if (this.item.data.isAbstract) title = `[${game.i18n.localize('ForienUnidentifiedItems.Item.Original')}] ${title}`;

      return title;
    }

    /**
     * @override
     *
     * @hook "forien-unidentified-items:getItemPermissions"
     */
    _getHeaderButtons() {
      const buttons = super._getHeaderButtons();
      const isAbstract = this.item.data.isAbstract || false;

      let permissions = {
        canIdentify: game.user.isGM,
        canPeek: game.user.isGM,
        canMystify: game.user.isGM
      };
      let hookPermissions = duplicate(permissions);
      Hooks.call(`${constants.moduleName}:getItemPermissions`, this.item, hookPermissions);
      //@ts-ignore
      permissions = mergeObject(permissions, hookPermissions);

      let origData = this.item.getFlag(constants.moduleName, "origData");

      if (origData) {
        if (permissions.canIdentify && !isAbstract) {
          buttons.unshift({
            label: "ForienUnidentifiedItems.Identify",
            class: "identify-item",
            icon: "fas fa-search",
            onclick: ev => {
              Identification.identify(this.item);
            }
          });
        }

        if (permissions.canPeek) {
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
            }
          );
        }
      } else {
        if (permissions.canMystify && !isAbstract) {
          if (this.item.isOwned) {
            buttons.unshift({
              label: "ForienUnidentifiedItems.Mystify",
              class: "mystify-item",
              icon: "far fa-eye-slash",
              onclick: ev => {
                Identification.mystifyReplace(this.item.uuid);
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
        }
      }

      return buttons;
    }

    async _updateObject(...args) {
      if (this.item.data.isAbstract) return this;
      return super._updateObject(...args);
    }
  };

  return ItemClass;
}
