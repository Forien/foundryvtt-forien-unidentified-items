import { i18n } from '../init';
import { MystifiedData } from './ForienUnidentifiedItemsModels';
import Identification from './Identification';
import { FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME, getGame } from './settings';

export default function registerDerivedItemSheetClass() {
  for (const k in CONFIG.Item.sheetClasses) {
    for (const l in CONFIG.Item.sheetClasses[k]) {
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
      if (!getGame().user?.isGM) {
        return title;
      }
      if (this.item.isMystified()) {
        title = `[${i18n(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME + '.Item.Mystified')}] ${title}`;
      }
      if (this.item.data.isAbstract) {
        title = `[${i18n(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME + '.Item.Original')}] ${title}`;
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

      let permissions = {
        canIdentify: getGame().user?.isGM,
        canPeek: getGame().user?.isGM,
        canMystify: getGame().user?.isGM,
      };
      const hookPermissions = duplicate(permissions);
      Hooks.call(`${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}:getItemPermissions`, this.item, hookPermissions);
      permissions = mergeObject(permissions, hookPermissions);

      const origData = <MystifiedData>this.item.getFlag(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME, 'origData');

      if (origData) {
        if (permissions.canIdentify && !isAbstract) {
          buttons.unshift({
            label: FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME + '.Identify',
            class: 'identify-item',
            icon: 'fas fa-search',
            onclick: (ev) => {
              Identification.identify(this.item);
            },
          });
        }

        if (permissions.canPeek) {
          buttons.unshift({
            label: FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME + '.Peek',
            class: 'peek-original-item',
            icon: 'far fa-eye',
            onclick: (ev) => {
              origData.isAbstract = true;
              //@ts-ignore
              const entity = new CONFIG.Item.documentClass(origData, { editable: false });
              const sheetTmp = entity.sheet;
              sheetTmp?.render(true);
            },
          });
        }
      } else {
        if (permissions.canMystify && !isAbstract) {
          if (this.item.isOwned) {
            buttons.unshift({
              label: FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME + '.Mystify',
              class: 'mystify-item',
              icon: 'far fa-eye-slash',
              onclick: (ev) => {
                Identification.mystifyReplace(this.item.uuid);
              },
            });
          } else {
            buttons.unshift({
              label: FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME + '.Mystify',
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
