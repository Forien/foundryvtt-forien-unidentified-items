import constants from "./constants.js";
import Identification from "./Identification.js";
export default function registerContextMenuHook() {
    Hooks.on('getItemDirectoryEntryContext', (html, entryOptions) => {
        const getOrigData = (li) => {
            const id = li[0].dataset.entityId;
            const item = game.items.get(id);
            return item.getFlag(constants.moduleName, "origData");
        };
        const mystifyCondition = (li) => {
            if (!game.user.isGM)
                return false;
            const origData = getOrigData(li);
            const allowNested = game.settings.get(constants.moduleName, "allowNestedItems");
            return !origData || allowNested;
        };
        const identifyCondition = (li) => {
            if (!game.user.isGM)
                return false;
            const origData = getOrigData(li);
            return !!origData;
        };
        let mystifyOptions = [
            {
                name: "ForienUnidentifiedItems.Mystify",
                icon: '<i class="far fa-eye-slash"></i>',
                condition: mystifyCondition,
                callback: li => {
                    const id = li[0].dataset.entityId;
                    Identification.mystify(`Item.${id}`);
                }
            },
            {
                name: "ForienUnidentifiedItems.MystifyReplace",
                icon: '<i class="far fa-eye-slash"></i>',
                condition: mystifyCondition,
                callback: li => {
                    const id = li[0].dataset.entityId;
                    Identification.mystifyReplace(`Item.${id}`);
                }
            },
            {
                name: "ForienUnidentifiedItems.MystifyAs",
                icon: '<i class="far fa-eye-slash"></i>',
                condition: mystifyCondition,
                callback: li => {
                    const id = li[0].dataset.entityId;
                    Identification.mystifyAsDialog(`Item.${id}`);
                }
            },
            {
                name: "ForienUnidentifiedItems.MystifyAdvanced",
                icon: '<i class="far fa-eye-slash"></i>',
                condition: mystifyCondition,
                callback: li => {
                    const id = li[0].dataset.entityId;
                    Identification.mystifyAdvancedDialog(`Item.${id}`);
                }
            }
        ];
        entryOptions.unshift(...mystifyOptions);
        entryOptions.unshift({
            name: "ForienUnidentifiedItems.Identify",
            icon: '<i class="fas fa-search"></i>',
            condition: identifyCondition,
            callback: li => {
                const id = li[0].dataset.entityId;
                const item = game.items.get(id);
                Identification.identify(item);
            }
        });
        entryOptions.unshift({
            name: "ForienUnidentifiedItems.Peek",
            icon: '<i class="far fa-eye"></i>',
            condition: identifyCondition,
            callback: li => {
                const id = li[0].dataset.entityId;
                const item = game.items.get(id);
                const origData = item.getFlag(constants.moduleName, "origData");
                //@ts-ignore
                origData.isAbstract = true;
                const entity = new CONFIG.Item.entityClass(origData, { editable: false });
                const sheet = entity.sheet;
                sheet.render(true);
            }
        });
    });
}
