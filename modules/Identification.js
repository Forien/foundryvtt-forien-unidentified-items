import constants from "./constants.mjs";

export default class Identification {

  /**
   *
   * @hook "forien-unidentified-items:onMystifyItem"
   *
   * @param {string} itemUuid
   * @param {Object} options
   * @param {boolean} options.replace - set true to replace provided item with mystified one
   * @param {undefined|Object} options.mystifiedData - item data object that should become front of mystified item
   * @returns {Promise<void>}
   */
  static async mystify(itemUuid, options = {replace: false, mystifiedData: undefined}) {
    if (!game.user.isGM) return;
    let item;

    item = await this._itemFromUuid(itemUuid);

    if (!item) {
      ui.notifications.error("ForienUnidentifiedItems.NotAnItem", {});
      return;
    }

    const origData = duplicate(item);
    let mystifiedData = options.mystifiedData;

    if (mystifiedData === undefined)
      mystifiedData = this._getMystifiedData(origData);

    Hooks.call(`${constants.moduleName}:onMystifyItem`, item, origData, mystifiedData, options);

    let mystifiedItem;
    if (options.replace) {
      let template = {data: game.system.model.Item[item.type]};
      mystifiedData = mergeObject(template, mystifiedData);
      await item.update(mystifiedData);
      mystifiedItem = item;
    } else {
      mystifiedItem = await Item.create(mystifiedData);
    }

    await mystifiedItem.setFlag(constants.moduleName, "origData", origData);
  }

  /**
   *
   * @param {string} itemUuid
   * @returns {Promise<void>}
   */
  static async mystifyReplace(itemUuid) {
    await this.mystify(itemUuid, {replace: true})
  }

  /**
   *
   * @param {string} itemUuid
   * @returns {Promise<void>}
   */
  static async mystifyAsDialog(itemUuid) {
    const origItem = await this._itemFromUuid(itemUuid);
    let name = origItem.data.name;

    let item;
    let replace;

    const dialog = new Dialog(
      {
        title: game.i18n.format("ForienUnidentifiedItems.Dialog.MystifyAs.Title", {name}),
        content: `<h3>${game.i18n.localize("ForienUnidentifiedItems.Dialog.MystifyAs.Header")}</h3>
        <div class="dropzone">
            <p>${game.i18n.format("ForienUnidentifiedItems.Dialog.MystifyAs.DropZone", {name})}</p>
            <div class="item" style="display: none">
                <img/>
                <span></span>
            </div>
        </div>`,
        buttons: {
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: game.i18n.localize("ForienUnidentifiedItems.Dialog.MystifyAs.Cancel")
          },
          mystifyReplace: {
            icon: '<i class="fas fa-sync-alt"></i>',
            label: game.i18n.localize("ForienUnidentifiedItems.Dialog.MystifyAs.MystifyReplace"),
            callback: (html) => {
              item = $(html).find('.item').data('item');
              replace = true;
            }
          },
          mystify: {
            icon: '<i class="fas fa-eye-slash"></i>',
            label: game.i18n.localize("ForienUnidentifiedItems.Dialog.MystifyAs.Mystify"),
            callback: (html) => {
              item = $(html).find('.item').data('item');
            }
          }
        },
        default: 'cancel',
        close: () => {
          if (item) {
            delete item._id;
            let options = {mystifiedData: item};
            if (replace) options.replace = true;
            this.mystify(itemUuid, options);
          }
        }
      },
      {
        id: "mystifyAsDialog"
      }
    );

    await dialog._render(true);

    $('#mystifyAsDialog').on("drop", ".dropzone", async (event) => {
      event.preventDefault();
      let item;
      let data = JSON.parse(event.originalEvent.dataTransfer.getData('text/plain'));
      if (data.type === 'Item') {
        if (data.pack) {
          item = await this._getItemFromPack(data.pack, data.id);
        } else if (data.data) {
          item = data.data;
        } else {
          let witem = game.items.get(data.id);
          if (!witem)
            return;
          item = duplicate(witem);
        }
        if (item) {
          $(event.currentTarget).find('.item').data('item', item);
          $(event.currentTarget).find('.item').slideUp(200, () => {
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
   * @returns {Promise<void>}
   */
  static async mystifyAdvancedDialog(itemUuid) {
    const origItem = await this._itemFromUuid(itemUuid);
    let name = origItem.data.name;
    let origData = duplicate(origItem);
    let meta = this._getMystifiedMeta(origData);

    let properties = this._getTypeProperties(origData);
    properties = Object.fromEntries(Object.keys(properties).map((property) => {
      return [
        property,
        {
          "key": property,
          "orig": getProperty(origData, `data.${property}`),
          "default": getProperty(game.system.model.Item[origData.type], property),
          "value": properties[property]
        }
      ]
    }));

    let html = await renderTemplate(`${constants.modulePath}/templates/mystify-advanced.html`, {
      item: origItem,
      meta: meta,
      properties: properties
    });

    let confirmed = false;
    let replace;
    const dialog = new Dialog(
      {
        title: game.i18n.format("ForienUnidentifiedItems.Dialog.MystifyAdvanced.Title", {name}),
        content: html,
        buttons: {
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: game.i18n.localize("ForienUnidentifiedItems.Dialog.MystifyAdvanced.Cancel")
          },
          mystifyReplace: {
            icon: '<i class="fas fa-sync-alt"></i>',
            label: game.i18n.localize("ForienUnidentifiedItems.Dialog.MystifyAdvanced.MystifyReplace"),
            callback: (html) => {
              confirmed = true;
              replace = true;
            }
          },
          mystify: {
            icon: '<i class="fas fa-eye-slash"></i>',
            label: game.i18n.localize("ForienUnidentifiedItems.Dialog.MystifyAdvanced.Mystify"),
            callback: (html) => {
              confirmed = true
            }
          }
        },
        default: 'cancel',
        close: (html) => {
          if (!confirmed) return;

          let form = html.find('form')[0];
          let formData = validateForm(form);

          delete formData["img-keep"];
          delete formData["name-keep"];

          formData = Object.fromEntries(Object.entries(formData).filter(e => e[1] !== false));

          Object.keys(formData).forEach(property => {
            if (property.startsWith("data.")) {
              delete formData[property];
              setProperty(formData, property, getProperty(origData, property));
            }
          });

          let options = {mystifiedData: formData};
          if (replace) options.replace = true;

          this.mystify(itemUuid, options);
        }
      },
      {
        id: "mystifyAdvancedDialog"
      }
    );
    await dialog._render(true);

    let jqDialog = $('#mystifyAdvancedDialog');

    jqDialog.on("change", "input[name=img-keep]", async (event) => {
      let checked = $(event.currentTarget).prop('checked');

      let src = checked ? origItem.img : meta.img;
      jqDialog.find('.img-preview').attr('src', src);
      jqDialog.find('input[name=img]').val(src);
    });

    jqDialog.on("change", "input[name=name-keep]", async (event) => {
      let checked = $(event.currentTarget).prop('checked');

      let name = checked ? origItem.name : meta.name;
      jqDialog.find('.name-preview').text(name);
      jqDialog.find('input[name=name]').val(name);
    });
  }

  /**
   *
   * @hook "forien-unidentified-items:onIdentifyItem"
   *
   * @param {Item} item
   * @returns {Promise<void>}
   */
  static async identify(item) {
    const origData = item.getFlag(constants.moduleName, "origData");
    let hook = Hooks.call(`${constants.moduleName}:onIdentifyItem`, item, origData);
    if (hook !== false) {
      await item.update(origData);
      await item.unsetFlag(constants.moduleName, "origData");
    }
  }

  /**
   *
   * @param {Object} origData
   * @returns {{img: String, name: String, type: String, data: Object}}
   * @private
   */
  static _getMystifiedData(origData) {
    let mystifiedData = this._getMystifiedMeta(origData);
    let itemProperties = this._getDefaultProperties(origData);

    itemProperties.forEach(property => {
      property = "data." + property;
      setProperty(mystifiedData, property, getProperty(origData, property));
    });

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
    itemProperties = Object.entries(itemProperties).filter(p => p[1]).map(p => p[0]);

    return itemProperties;
  }

  /**
   *
   * @param {Object} origData
   * @return {Object}
   * @private
   */
  static _getTypeProperties(origData) {
    let defaultProperties = game.settings.get(constants.moduleName, "itemProperties");

    return defaultProperties[origData.type];
  }

  /**
   *
   * @param {Object} origData
   * @returns {{img: String, name: String, type: String}}
   * @private
   */
  static _getMystifiedMeta(origData) {
    let iconSettings = game.settings.get(constants.moduleName, "defaultIcons");
    let iconType = getProperty(iconSettings, origData.type) || `${constants.modulePath}/icons/${constants.defaultIcon}`;

    return {
      name: game.i18n.localize("ForienUnidentifiedItems.NewMystified"),
      type: origData.type,
      img: iconType
    };
  }

  /**
   *
   * @param {string} uuid
   * @returns {Promise<Item|null>}
   * @private
   */
  static async _itemFromUuid(uuid) {
    const parts = uuid.split(".");
    const [entityName, entityId, embeddedName, embeddedId] = parts;

    if (embeddedName === "OwnedItem") {
      if (parts.length === 4) {
        const actor = game.actors.get(entityId);
        if (actor === null) return null;

        return actor.items.get(embeddedId);
      }
    } else {
      return fromUuid(uuid);
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
    const pack = game.packs.get(packId);
    if (pack.metadata.entity !== "Item")
      return null;
    return await pack.getEntity(itemId).then(ent => {
      delete ent._id;
      return ent;
    });
  }
}