import { MystifiedData, MystifiedFlags } from './ForienUnidentifiedItemsModels';
import Identification from './Identification';
import { i18n } from './lib/lib';
import { FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME } from './settings';
import { canvas, game } from './settings';

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
      this.name = sheet.split('.')[1];
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
        title = '[' + i18n(`${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}.Item.Mystified`) + '] ' + `${title}`;
      }
      if (this.item.data.isAbstract) {
        title = '[' + i18n(`${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}.Item.Original`) + '] ' + `${title}`;
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
      const isAbstract = this.item.data.isAbstract || false;
      const removeLabelButtonsSheetHeader = <boolean>(
        game.settings.get(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME, 'removeLabelButtonsSheetHeader')
      );

      let permissions = {
        canIdentify: game.user?.isGM,
        canPeek: game.user?.isGM,
        canMystify: game.user?.isGM,
      };
      const hookPermissions = duplicate(permissions);
      Hooks.call(`${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}:getItemPermissions`, this.item, hookPermissions);
      permissions = mergeObject(permissions, hookPermissions);

      const origData = <MystifiedData>(
        this.item.getFlag(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME, MystifiedFlags.ORIG_DATA)
      );

      if (origData) {
        if (permissions.canIdentify && !isAbstract) {
          buttons.unshift({
            label: removeLabelButtonsSheetHeader ? '' : `${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}.Identify`,
            class: 'identify-item',
            icon: 'fas fa-search',
            onclick: (ev) => {
              Identification.identify(this.item);
            },
          });
        }

        if (permissions.canPeek) {
          buttons.unshift({
            label: removeLabelButtonsSheetHeader ? '' : `${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}.Peek`,
            class: 'peek-original-item',
            icon: 'far fa-eye',
            onclick: (ev) => {
              //@ts-ignore
              const entity = new CONFIG.Item.documentClass(origData, { editable: false });
              //@ts-ignore
              entity.data.isAbstract = true;
              const sheetTmp = entity.sheet;
              sheetTmp?.render(true);
            },
          });
        }
      } else {
        if (permissions.canMystify && !isAbstract) {
          if (this.item.isOwned) {
            buttons.unshift({
              label: removeLabelButtonsSheetHeader ? '' : `${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}.Mystify`,
              class: 'mystify-item',
              icon: 'far fa-eye-slash',
              onclick: (ev) => {
                Identification.mystifyReplace(this.item.uuid);
              },
            });
          } else {
            buttons.unshift({
              label: removeLabelButtonsSheetHeader ? '' : `${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}.Mystify`,
              class: 'mystify-item',
              icon: 'far fa-eye-slash',
              onclick: (ev) => {
                Identification.mystify(this.item.uuid);
              },
            });
          }
        }
      }

      return buttons;
    }

    async _updateObject(...args) {
      if (this.item.data.isAbstract) {
        return this;
      }
      return super._updateObject(...args);
    }
  };

  return ItemClass;
}
