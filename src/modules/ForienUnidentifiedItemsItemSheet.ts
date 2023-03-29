import API from "./api";
import CONSTANTS from "./constants";
import { MystifiedData, MystifiedFlags } from "./ForienUnidentifiedItemsModels";
import { i18n } from "./lib/lib";

export default function registerDerivedItemSheetClass() {
  //@ts-ignore
  for (const k in CONFIG.Item.sheetClasses) {
    //@ts-ignore
    for (const l in CONFIG.Item.sheetClasses[k]) {
      //@ts-ignore
      const cls = CONFIG.Item.sheetClasses[k][l].cls;
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
      if (!game.user?.isGM) {
        return title;
      }
      if (this.item.isMystified()) {
        title = "[" + i18n(`${CONSTANTS.MODULE_NAME}.Item.Mystified`) + "] " + `${title}`;
      }
      if (this.item.isAbstract) {
        title = "[" + i18n(`${CONSTANTS.MODULE_NAME}.Item.Original`) + "] " + `${title}`;
      }
      return title;
    }

    /**
     * @override
     *
     * @hook "forien-unidentified-items:getItemPermissions"
     */
    _getHeaderButtons() {
      const buttons = super._getHeaderButtons();
      const isAbstract = this.item.isAbstract || false;
      const removeLabelButtonsSheetHeader = <boolean>(
        game.settings.get(CONSTANTS.MODULE_NAME, "removeLabelButtonsSheetHeader")
      );

      let permissions = {
        canIdentify: game.user?.isGM,
        canPeek: game.user?.isGM,
        canMystify: game.user?.isGM
      };
      const hookPermissions = duplicate(permissions);
      Hooks.call(`${CONSTANTS.MODULE_NAME}:getItemPermissions`, this.item, hookPermissions);
      permissions = mergeObject(permissions, hookPermissions);

      const origData = <MystifiedData>this.item.getFlag(CONSTANTS.MODULE_NAME, MystifiedFlags.ORIG_DATA);

      if (origData) {
        if (permissions.canIdentify && !isAbstract) {
          buttons.unshift({
            label: removeLabelButtonsSheetHeader ? "" : `${CONSTANTS.MODULE_NAME}.Identify`,
            class: "forien-unidentified-items-identify-item",
            icon: "fas fa-search",
            onclick: (ev) => {
              API.identify(this.item);
            }
          });
        }

        if (permissions.canPeek) {
          buttons.unshift({
            label: removeLabelButtonsSheetHeader ? "" : `${CONSTANTS.MODULE_NAME}.Peek`,
            class: "forien-unidentified-items-peek-original-item",
            icon: "far fa-eye",
            onclick: (ev) => {
              //@ts-ignore
              const entity = new CONFIG.Item.documentClass(origData, { editable: false });
              //@ts-ignore
              entity.isAbstract = true;
              const sheetTmp = entity.sheet;
              sheetTmp?.render(true);
            }
          });
        }
      } else {
        if (permissions.canMystify && !isAbstract) {
          if (this.item.isOwned) {
            buttons.unshift({
              label: removeLabelButtonsSheetHeader ? "" : `${CONSTANTS.MODULE_NAME}.Mystify`,
              class: "forien-unidentified-items-mystify-item",
              icon: "far fa-eye-slash",
              onclick: (ev) => {
                API.mystifyReplace(this.item.uuid);
              }
            });
          } else {
            buttons.unshift({
              label: removeLabelButtonsSheetHeader ? "" : `${CONSTANTS.MODULE_NAME}.Mystify`,
              class: "forien-unidentified-items-mystify-item",
              icon: "far fa-eye-slash",
              onclick: (ev) => {
                API.mystify(this.item.uuid);
              }
            });
          }
        }
      }

      return buttons;
    }

    async _updateObject(...args) {
      if (this.item.isAbstract) {
        return this;
      }
      return super._updateObject(...args);
    }
  };

  return ItemClass;
}
