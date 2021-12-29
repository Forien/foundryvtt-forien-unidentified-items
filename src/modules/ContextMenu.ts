import { MystifiedData, MystifiedFlags } from './ForienUnidentifiedItemsModels';
import Identification from './Identification';
import { FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME, getGame } from './settings';

export default function registerContextMenuHook() {
  Hooks.on('getItemDirectoryEntryContext', (html, entryOptions) => {
    const getOrigData = (li) => {
      const id = li[0].dataset.documentId;
      const item = <Item>getGame().items?.get(id);

      return item.getFlag(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME, MystifiedFlags.ORIG_DATA);
    };

    const mystifyCondition = (li) => {
      if (!getGame().user?.isGM) return false;
      const origData = getOrigData(li);
      const allowNested = getGame().settings.get(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME, 'allowNestedItems');

      return !origData || allowNested;
    };

    const identifyCondition = (li) => {
      if (!getGame().user?.isGM) return false;
      const origData = getOrigData(li);

      return !!origData;
    };

    const mystifyOptions = [
      {
        name: `${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}.Mystify`,
        icon: '<i class="far fa-eye-slash"></i>',
        condition: mystifyCondition,
        callback: (li) => {
          const id = li[0].dataset.documentId;
          Identification.mystify(`Item.${id}`);
        },
      },
      {
        name: `${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}.MystifyReplace`,
        icon: '<i class="far fa-eye-slash"></i>',
        condition: mystifyCondition,
        callback: (li) => {
          const id = li[0].dataset.documentId;
          Identification.mystifyReplace(`Item.${id}`);
        },
      },
      {
        name: `${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}.MystifyAs`,
        icon: '<i class="far fa-eye-slash"></i>',
        condition: mystifyCondition,
        callback: (li) => {
          const id = li[0].dataset.documentId;
          Identification.mystifyAsDialog(`Item.${id}`);
        },
      },
      {
        name: `${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}.MystifyAdvanced`,
        icon: '<i class="far fa-eye-slash"></i>',
        condition: mystifyCondition,
        callback: (li) => {
          const id = li[0].dataset.documentId;
          Identification.mystifyAdvancedDialog(`Item.${id}`);
        },
      },
    ];

    entryOptions.unshift(...mystifyOptions);

    entryOptions.unshift({
      name: `${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}.Identify`,
      icon: '<i class="fas fa-search"></i>',
      condition: identifyCondition,
      callback: (li) => {
        const id = li[0].dataset.documentId;
        const item = getGame().items?.get(id);
        Identification.identify(item);
      },
    });

    entryOptions.unshift({
      name: `${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}.Peek`,
      icon: '<i class="far fa-eye"></i>',
      condition: identifyCondition,
      callback: (li) => {
        const id = li[0].dataset.documentId;
        const item = <Item>getGame().items?.get(id);
        const origData = <MystifiedData>item.getFlag(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME, MystifiedFlags.ORIG_DATA);
        origData.isAbstract = true;
        //@ts-ignore
        const entity = new CONFIG.Item.documentClass(origData, { editable: false });
        const sheet = entity.sheet;
        sheet?.render(true);
      },
    });
  });
}
