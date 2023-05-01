import API from "./api";
import CONSTANTS from "./constants";
import { MystifiedData, MystifiedFlags } from "./ForienUnidentifiedItemsModels";

export default function registerContextMenuHook() {
  Hooks.on("getItemDirectoryEntryContext", (html, entryOptions) => {
    const getOrigData = (li) => {
      const id = li[0].dataset.documentId;
      const item = <Item>game.items?.get(id);

      return item.getFlag(CONSTANTS.MODULE_NAME, MystifiedFlags.ORIG_DATA);
    };

    const mystifyCondition = (li) => {
      if (!game.user?.isGM) return false;
      const origData = getOrigData(li);
      const allowNested = game.settings.get(CONSTANTS.MODULE_NAME, "allowNestedItems");

      return !origData || allowNested;
    };

    const identifyCondition = (li) => {
      if (!game.user?.isGM) return false;
      const origData = getOrigData(li);

      return !!origData;
    };

    const mystifyOptions = [
      {
        name: `${CONSTANTS.MODULE_NAME}.Mystify`,
        icon: '<i class="far fa-eye-slash"></i>',
        condition: mystifyCondition,
        callback: (li) => {
          const id = li[0].dataset.documentId;
          API.mystify(`Item.${id}`);
        }
      },
      {
        name: `${CONSTANTS.MODULE_NAME}.MystifyReplace`,
        icon: '<i class="far fa-eye-slash"></i>',
        condition: mystifyCondition,
        callback: (li) => {
          const id = li[0].dataset.documentId;
          API.mystifyReplace(`Item.${id}`);
        }
      },
      {
        name: `${CONSTANTS.MODULE_NAME}.MystifyAs`,
        icon: '<i class="far fa-eye-slash"></i>',
        condition: mystifyCondition,
        callback: (li) => {
          const id = li[0].dataset.documentId;
          API.mystifyAsDialog(`Item.${id}`);
        }
      },
      {
        name: `${CONSTANTS.MODULE_NAME}.MystifyAdvanced`,
        icon: '<i class="far fa-eye-slash"></i>',
        condition: mystifyCondition,
        callback: (li) => {
          const id = li[0].dataset.documentId;
          API.mystifyAdvancedDialog(`Item.${id}`);
        }
      }
    ];

    entryOptions.unshift(...mystifyOptions);

    entryOptions.unshift({
      name: `${CONSTANTS.MODULE_NAME}.Identify`,
      icon: '<i class="fas fa-search"></i>',
      condition: identifyCondition,
      callback: (li) => {
        const id = li[0].dataset.documentId;
        const item = <Item>game.items?.get(id);
        API.identify(item);
      }
    });

    entryOptions.unshift({
      name: `${CONSTANTS.MODULE_NAME}.Peek`,
      icon: '<i class="far fa-eye"></i>',
      condition: identifyCondition,
      callback: (li) => {
        const id = li[0].dataset.documentId;
        const item = <Item>game.items?.get(id);
        const origData = <MystifiedData>item.getFlag(CONSTANTS.MODULE_NAME, MystifiedFlags.ORIG_DATA);
        origData.isAbstract = true;
        //@ts-ignore
        const entity = new CONFIG.Item.documentClass(origData, { editable: false });
        const sheet = entity.sheet;
        sheet?.render(true);
      }
    });
  });
}
