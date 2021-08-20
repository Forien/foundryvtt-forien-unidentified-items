import { i18n, i18nFormat } from "./../init.js";
import { FORIEN_UNIDENTIFIED_ITEMS_DEFAULT_ICON, FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME, getGame } from "./settings.js";
export default class Identification {
    /**
     *
     * @hook 'forien-unidentified-items:onMystifyItem'
     *
     * @param {string} itemUuid
     * @param {Object} options
     * @param {boolean} options.replace - set true to replace provided item with mystified one
     * @param {undefined|Object} options.mystifiedData - item data object that should become front of mystified item
     * @returns {Promise<void>}
     */
    static async mystify(itemUuid, options = { replace: false, mystifiedData: undefined }) {
        if (!getGame().user?.isGM) {
            return;
        }
        const item = await this._itemFromUuid(itemUuid);
        if (!item) {
            ui.notifications?.error(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME + '.NotAnItem', {});
            return;
        }
        const origData = duplicate(item);
        let mystifiedData = options.mystifiedData;
        if (mystifiedData === undefined) {
            mystifiedData = this._getMystifiedData(origData);
        }
        Hooks.call(`${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}:onMystifyItem`, item, origData, mystifiedData, options);
        let mystifiedItem;
        if (options.replace) {
            const template = { data: getGame().system.model.Item[item.type] };
            mystifiedData = mergeObject(template, mystifiedData);
            await item.update(mystifiedData);
            mystifiedItem = item;
        }
        else {
            mystifiedItem = await Item.create(mystifiedData);
        }
        await mystifiedItem.setFlag(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME, 'origData', origData);
    }
    /**
     *
     * @param {string} itemUuid
     * @returns {Promise<void>}
     */
    static async mystifyReplace(itemUuid) {
        await this.mystify(itemUuid, { replace: true, mystifiedData: undefined });
    }
    /**
     *
     * @param {string} itemUuid
     * @returns {Promise<void>}
     */
    static async mystifyAsDialog(itemUuid) {
        const origItem = await this._itemFromUuid(itemUuid);
        const nameTmp = origItem.data.name;
        let itemTmp;
        let replace;
        const dialog = new Dialog({
            title: i18nFormat(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME + '.Dialog.MystifyAs.Title', { nameTmp }),
            content: `<h3>${i18n(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME + '.Dialog.MystifyAs.Header')}</h3>
        <div class="dropzone">
            <p>${i18nFormat(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME + '.Dialog.MystifyAs.DropZone', { nameTmp })}</p>
            <div class="item" style="display: none">
                <img/>
                <span></span>
            </div>
        </div>`,
            buttons: {
                mystifyAdvanced: {
                    icon: '<i class="fas fa-cogs"></i>',
                    label: i18n(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME + '.Dialog.MystifyAs.MystifyAdvanced'),
                    callback: (html) => {
                        const source = $(html).find('.item').data('item');
                        this.mystifyAdvancedDialog(itemUuid, source);
                    },
                },
                cancel: {
                    icon: '<i class="fas fa-times"></i>',
                    label: i18n(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME + '.Dialog.MystifyAs.Cancel'),
                },
                mystifyReplace: {
                    icon: '<i class="fas fa-sync-alt"></i>',
                    label: i18n(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME + '.Dialog.MystifyAs.MystifyReplace'),
                    callback: (html) => {
                        itemTmp = $(html).find('.item').data('item');
                        replace = true;
                    },
                },
                mystify: {
                    icon: '<i class="fas fa-eye-slash"></i>',
                    label: i18n(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME + '.Dialog.MystifyAs.Mystify'),
                    callback: (html) => {
                        itemTmp = $(html).find('.item').data('item');
                    },
                },
            },
            default: 'cancel',
            close: () => {
                if (itemTmp) {
                    delete itemTmp._id;
                    //let options = {mystifiedData: item};
                    //if (replace) options.replace = true;
                    //this.mystify(itemUuid, options);
                    if (replace) {
                        this.mystify(itemUuid, { replace: true, mystifiedData: itemTmp });
                    }
                    else {
                        this.mystify(itemUuid, { replace: false, mystifiedData: itemTmp });
                    }
                }
            },
        }, {
            id: 'mystifyAsDialog',
            width: 440,
            height: 'auto',
        });
        await dialog.render(true);
        $('#mystifyAsDialog').on('drop', '.dropzone', async (event) => {
            event.preventDefault();
            let item;
            const data = JSON.parse(event.originalEvent?.dataTransfer?.getData('text/plain'));
            if (data.type === 'Item') {
                if (data.pack) {
                    item = await this._getItemFromPack(data.pack, data.id);
                    item = duplicate(item);
                }
                else if (data.data) {
                    item = data.data;
                }
                else {
                    const witem = getGame().items?.get(data.id);
                    if (!witem) {
                        return;
                    }
                    item = duplicate(witem);
                }
                if (item) {
                    $(event.currentTarget).find('.item').data('item', item);
                    $(event.currentTarget)
                        .find('.item')
                        .slideUp(200, () => {
                        $(event.currentTarget).find('.item img').attr('src', item.img);
                        $(event.currentTarget).find('.item span').text(item.name);
                        $(event.currentTarget).find('.item').slideDown();
                    });
                }
            }
        });
    }
    /**
     *
     * @param {string} itemUuid
     * @param {object} source
     * @returns {Promise<void>}
     */
    static async mystifyAdvancedDialog(itemUuid, source = undefined) {
        const origItem = await this._itemFromUuid(itemUuid);
        const nameTmp = origItem.data.name;
        const sourceData = source ? source : duplicate(origItem);
        const meta = this._getMystifiedMeta(sourceData);
        const keepOldIcon = this.keepOriginalImage();
        const selectedImg = keepOldIcon ? sourceData.img : meta.img;
        let properties = this._getTypeProperties(sourceData);
        properties = Object.fromEntries(Object.keys(properties).map((property) => {
            return [
                property,
                {
                    key: property,
                    orig: getProperty(sourceData, `data.${property}`),
                    default: getProperty(getGame().system?.model.Item[sourceData.type], property),
                    value: properties[property],
                },
            ];
        }));
        const htmlTmp = await renderTemplate(`/modules/${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}/templates/mystify-advanced.html`, {
            item: sourceData,
            meta: meta,
            properties: properties,
            keepOldIcon: keepOldIcon,
            selectedImg: selectedImg,
        });
        let confirmed = false;
        let replace;
        const dialog = new Dialog({
            title: i18nFormat(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME + '.Dialog.MystifyAdvanced.Title', { nameTmp }),
            content: htmlTmp,
            buttons: {
                cancel: {
                    icon: '<i class="fas fa-times"></i>',
                    label: i18n(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME + '.Dialog.MystifyAdvanced.Cancel'),
                },
                mystifyReplace: {
                    icon: '<i class="fas fa-sync-alt"></i>',
                    label: i18n(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME + '.Dialog.MystifyAdvanced.MystifyReplace'),
                    callback: (html) => {
                        confirmed = true;
                        replace = true;
                    },
                },
                mystify: {
                    icon: '<i class="fas fa-eye-slash"></i>',
                    label: i18n(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME + '.Dialog.MystifyAdvanced.Mystify'),
                    callback: (html) => {
                        confirmed = true;
                    },
                },
            },
            default: 'cancel',
            close: (html) => {
                if (!confirmed) {
                    return;
                }
                const form = html.find('form')[0];
                const formDataBase = new FormDataExtended(form, {});
                formDataBase.delete('img-keep');
                formDataBase.delete('name-keep');
                const formData = Object.fromEntries(Object.entries(formDataBase.toObject()).filter((e) => e[1] !== false));
                Object.keys(formData).forEach((property) => {
                    if (property.startsWith('data.')) {
                        delete formData[property];
                        setProperty(formData, property, getProperty(sourceData, property));
                    }
                });
                //let options = {mystifiedData: formData};
                //if (replace) options.replace = true;
                //this.mystify(itemUuid, options);
                if (replace) {
                    this.mystify(itemUuid, { replace: true, mystifiedData: formData });
                }
                else {
                    this.mystify(itemUuid, { replace: false, mystifiedData: formData });
                }
            },
        }, {
            id: 'mystifyAdvancedDialog',
        });
        await dialog.render(true);
        const jqDialog = $('#mystifyAdvancedDialog');
        jqDialog.on('change', 'input[name=img-keep]', async (event) => {
            const checked = $(event.currentTarget).prop('checked');
            const src = checked ? sourceData.img : meta.img;
            jqDialog.find('.img-preview').attr('src', src);
            jqDialog.find('input[name=img]').val(src);
        });
        jqDialog.on('change', 'input[name=name-keep]', async (event) => {
            const checked = $(event.currentTarget).prop('checked');
            const nameChanged = checked ? sourceData.name : meta.name;
            jqDialog.find('.name-preview').text(nameChanged);
            jqDialog.find('input[name=name]').val(nameChanged);
        });
    }
    /**
     *
     * @hook 'forien-unidentified-items:onIdentifyItem'
     *
     * @param {Item} item
     * @returns {Promise<Item>}
     */
    static async identify(item) {
        const origData = item.getFlag(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME, 'origData');
        // things to keep from mystified item:
        delete origData._id;
        delete origData.permission;
        delete origData.folder;
        const hook = Hooks.call(`${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}:onIdentifyItem`, item, origData);
        if (hook !== false) {
            await item.update(origData, { diff: false });
            await item.unsetFlag(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME, 'origData');
            // If there was nested origData, carry it over.
            const origDataOrigData = getProperty(origData.flags, `${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}.origData`);
            await item.setFlag(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME, 'origData', origDataOrigData);
        }
    }
    /**
     *
     * @param {Item} item
     * @return {boolean}
     */
    static isMystified(item) {
        const origData = item.getFlag(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME, 'origData');
        return origData !== undefined;
    }
    /**
     *
     * @param {Item} item
     * @return {Object}
     */
    static getOrigData(item) {
        return item.getFlag(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME, 'origData');
    }
    /**
     *
     * @param {string} uuid
     * @return {boolean}
     */
    static async isUuidMystified(uuid) {
        const item = await this._itemFromUuid(uuid);
        if (!item) {
            return false;
        }
        const origData = item.getFlag(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME, 'origData');
        return origData !== undefined;
    }
    /**
     *
     * @param {Object} origData
     * @returns {{img: String, name: String, type: String, data: Object}}
     * @private
     */
    static _getMystifiedData(origData) {
        const mystifiedData = this._getMystifiedMeta(origData);
        const itemProperties = this._getDefaultProperties(origData);
        itemProperties.forEach((property) => {
            property = 'data.' + property;
            setProperty(mystifiedData, property, getProperty(origData, property));
        });
        if (this.keepOriginalImage()) {
            mystifiedData.img = origData.img;
        }
        return mystifiedData;
    }
    /**
     *
     * @param {Object} origData
     * @returns {Array}
     * @private
     */
    static _getDefaultProperties(origData) {
        let itemProperties = this._getTypeProperties(origData);
        itemProperties = Object.entries(itemProperties)
            .filter((p) => p[1])
            .map((p) => p[0]);
        return itemProperties;
    }
    /**
     *
     * @param {Object} origData
     * @return {Object}
     * @private
     */
    static _getTypeProperties(origData) {
        const defaultProperties = getGame().settings.get(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME, 'itemProperties');
        return defaultProperties[origData.type];
    }
    static keepOriginalImage() {
        return getGame().settings.get(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME, 'keepOldIcon');
    }
    /**
     *
     * @param {Object} origData
     * @returns {{img: String, name: String, type: String}}
     * @private
     */
    static _getMystifiedMeta(origData) {
        const iconSettings = getGame().settings.get(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME, 'defaultIcons');
        const iconType = getProperty(iconSettings, origData.type) ||
            `/modules/${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}/icons/${FORIEN_UNIDENTIFIED_ITEMS_DEFAULT_ICON}`;
        return {
            name: i18n(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME + '.NewMystified'),
            type: origData.type,
            img: iconType,
        };
    }
    /**
     *
     * @param {string} uuid
     * @returns {Promise<Item|null>}
     * @private
     */
    static async _itemFromUuid(uuid) {
        const parts = uuid.split('.');
        const [entityName, entityId, embeddedName, embeddedId] = parts;
        if (embeddedName === 'OwnedItem' || embeddedName === 'Item') {
            if (parts.length === 4) {
                const actor = getGame().actors?.get(entityId);
                if (actor === null)
                    return null;
                return actor.items.get(embeddedId);
            }
        }
        else {
            return await fromUuid(uuid);
        }
        return null;
    }
    /**
     *
     * @param {string} packId
     * @param {string} itemId
     * @return {Promise.<Entity|null>}
     * @private
     */
    static async _getItemFromPack(packId, itemId) {
        const pack = getGame().packs.get(packId);
        if (pack.metadata.entity !== 'Item') {
            return null;
        }
        return await pack.getDocument(itemId).then((ent) => {
            delete ent?.data._id;
            return ent;
        });
    }
}
