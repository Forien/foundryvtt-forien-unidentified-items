import type DefaultIcons from "./apps/DefaultIcons";
import CONSTANTS from "./constants";
import { MystifiedData, MystifiedFlags } from "./ForienUnidentifiedItemsModels";
import { error, i18n, i18nFormat, info, warn } from "./lib/lib";

export default class Identification {
  /**
   *
   * @hook 'forien-unidentified-items:onMystifyItem'
   *
   * @param {string} itemUuid
   * @param {Object} options
   * @param {boolean} options.replace - set true to replace provided item with mystified one
   * @param {MystifiedData|undefined} options.mystifiedData - item data object that should become front of mystified item
   * @returns {Promise<void>}
   */
  static async mystify(
    itemUuid: string,
    options: { replace: boolean; mystifiedData: MystifiedData | undefined } = {
      replace: false,
      mystifiedData: undefined
    }
  ): Promise<Item | undefined> {
    if (!game.user?.isGM) {
      error(`Only a GM can mistify a item`, true);
      return;
    }
    if (!itemUuid) {
      warn(`Cannot mystify a no item`, true);
      return;
    }
    const item = await this._itemFromUuid(itemUuid);
    if (!item) {
      warn(`Cannot mystify a no item from uuid '${itemUuid}'`, true);
      return;
    }

    const origData = duplicate(item);
    let mystifiedData = <MystifiedData>options.mystifiedData;

    if (mystifiedData === undefined) {
      mystifiedData = this._getMystifiedData(origData);
    }

    Hooks.call(`${CONSTANTS.MODULE_NAME}:onMystifyItem`, item, origData, mystifiedData, options);

    let mystifiedItem;
    if (options.replace) {
      const template = { data: game.system.model.Item[item.type] };
      mystifiedData = mergeObject(template, mystifiedData);
      if(!mystifiedData.flags) {
        mystifiedData.flags = {};
      }
      await item.update(mystifiedData);
      mystifiedItem = item;
    } else {
      if(!mystifiedData.flags) {
        mystifiedData.flags = {};
      }
      mystifiedItem = await Item.create(mystifiedData);
    }

    await mystifiedItem.setFlag(CONSTANTS.MODULE_NAME, MystifiedFlags.ORIG_DATA, origData);
    return mystifiedItem;
  }

  /**
   *
   * @param {string} itemUuid
   * @returns {Promise<void>}
   */
  static async mystifyReplace(itemUuid: string): Promise<Item | undefined> {
    return await this.mystify(itemUuid, { replace: true, mystifiedData: undefined });
  }

  /**
   *
   * @param {string} itemUuid
   * @returns {Promise<void>}
   */
  static async mystifyAsDialog(itemUuid: string): Promise<void> {
    if (!itemUuid) {
      warn(`Cannot mystify advanced a no item`, true);
      return;
    }
    const origItem: any = await this._itemFromUuid(itemUuid);
    if (!origItem) {
      warn(`Cannot  mystify advanced a no item from uuid '${itemUuid}'`, true);
      return;
    }

    const nameItem = origItem.name;
    let itemTmp;
    let replace;

    const dialog = new Dialog(
      {
        title: i18nFormat(`${CONSTANTS.MODULE_NAME}.Dialog.MystifyAs.Title`, { nameItem }),
        content: `<h3>${i18n(`${CONSTANTS.MODULE_NAME}.Dialog.MystifyAs.Header`)}</h3>
					<div class="dropzone">
						<p>${i18nFormat(`${CONSTANTS.MODULE_NAME}.Dialog.MystifyAs.DropZone`, { nameItem })}</p>
						<div class="item" style="display: none">
							<img/>
							<span></span>
						</div>
					</div>`,
        buttons: {
          mystifyAdvanced: {
            icon: '<i class="fas fa-cogs"></i>',
            label: i18n(`${CONSTANTS.MODULE_NAME}.Dialog.MystifyAs.MystifyAdvanced`),
            callback: (html) => {
              const source = $(html).find(".item").data("item");
              this.mystifyAdvancedDialog(itemUuid, source);
            }
          },
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: i18n(`${CONSTANTS.MODULE_NAME}.Dialog.MystifyAs.Cancel`)
          },
          mystifyReplace: {
            icon: '<i class="fas fa-sync-alt"></i>',
            label: i18n(`${CONSTANTS.MODULE_NAME}.Dialog.MystifyAs.MystifyReplace`),
            callback: (html) => {
              itemTmp = $(html).find(".item").data("item");
              replace = true;
            }
          },
          mystify: {
            icon: '<i class="fas fa-eye-slash"></i>',
            label: i18n(`${CONSTANTS.MODULE_NAME}.Dialog.MystifyAs.Mystify`),
            callback: (html) => {
              itemTmp = $(html).find(".item").data("item");
            }
          }
        },
        default: "cancel",
        close: () => {
          if (itemTmp) {
            delete itemTmp._id;
            //let options = {mystifiedData: item};
            //if (replace) options.replace = true;
            //this.mystify(itemUuid, options);
            if (replace) {
              this.mystify(itemUuid, { replace: true, mystifiedData: itemTmp });
            } else {
              this.mystify(itemUuid, { replace: false, mystifiedData: itemTmp });
            }
          }
        },
        render: (html) => {
          $(html)
            .on("dragover", false)
            .on("drop", ".dropzone", async (event) => {
              event.preventDefault();
              event.stopPropagation();
              let item;
              const data = JSON.parse(<string>event.originalEvent?.dataTransfer?.getData("text/plain"));
              if (data.type === "Item") {
                if (data.uuid) {
                  const witem = await this._uuidToDocument(data.uuid);
                  item = duplicate(witem);
                  // } else if (data.pack) {
                  // 	const witem = await this._getItemFromPack(data.pack, data.id);
                  // 	item = duplicate(witem);
                } else if (data) {
                  item = data;
                } else {
                  const witem = game.items?.get(data.id);
                  if (!witem) {
                    return;
                  }
                  item = duplicate(witem);
                }
                if (item) {
                  $(event.currentTarget).find(".item").data("item", item);
                  $(event.currentTarget)
                    .find(".item")
                    .slideUp(200, () => {
                      $(event.currentTarget).find(".item img").attr("src", item.img);
                      $(event.currentTarget).find(".item span").text(item.name);
                      $(event.currentTarget).find(".item").slideDown();
                    });
                }
              }
            });
        }
      },
      {
        id: "forien-unidentified-items-mystifyAsDialog",
        width: 440,
        height: "auto"
      }
    );

    await dialog.render(true);
  }

  /**
   *
   * @param {string} itemUuid
   * @param {Item|undefined} source
   * @returns {Promise<void>}
   */
  static async mystifyAdvancedDialog(itemUuid: string, source: Item | undefined = undefined) {
    if (!itemUuid) {
      warn(`Cannot mystify advanced a no item`, true);
      return;
    }
    const origItem = <Item>await this._itemFromUuid(itemUuid);
    if (!origItem) {
      warn(`Cannot  mystify advanced a no item from uuid '${itemUuid}'`, true);
      return;
    }

    const nameItem = origItem.name;
    const sourceData = <Item>(source ? source : duplicate(origItem));
    const meta = this._getMystifiedMeta(sourceData);
    const keepOldIcon = this.keepOriginalImage();

    const selectedImg = keepOldIcon ? sourceData.img : meta.img;

    let properties = this._getTypeProperties(sourceData);
    properties = Object.fromEntries(
      Object.keys(properties).map((property) => {
        return [
          property,
          {
            key: property,
            orig: getProperty(sourceData, `data.${property}`),
            default: getProperty(<object>game.system?.model.Item[sourceData.type], property),
            value: properties[property]
          }
        ];
      })
    );

    const htmlTmp = await renderTemplate(`/scripts/${CONSTANTS.MODULE_NAME}/templates/mystify-advanced.html`, {
      item: sourceData,
      meta: meta,
      properties: properties,
      keepOldIcon: keepOldIcon,
      selectedImg: selectedImg
    });

    let confirmed = false;
    let replace;
    const dialog = new Dialog(
      {
        title: i18nFormat(`${CONSTANTS.MODULE_NAME}.Dialog.MystifyAdvanced.Title`, { nameItem }),
        content: htmlTmp,
        buttons: {
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: i18n(`${CONSTANTS.MODULE_NAME}.Dialog.MystifyAdvanced.Cancel`)
          },
          mystifyReplace: {
            icon: '<i class="fas fa-sync-alt"></i>',
            label: i18n(`${CONSTANTS.MODULE_NAME}.Dialog.MystifyAdvanced.MystifyReplace`),
            callback: (html) => {
              confirmed = true;
              replace = true;
            }
          },
          mystify: {
            icon: '<i class="fas fa-eye-slash"></i>',
            label: i18n(`${CONSTANTS.MODULE_NAME}.Dialog.MystifyAdvanced.Mystify`),
            callback: (html) => {
              confirmed = true;
            }
          }
        },
        default: "cancel",
        close: (html: HTMLElement | JQuery<HTMLElement>) => {
          if (!confirmed) {
            return;
          }
          const form = <HTMLFormElement>(<JQuery<HTMLElement>>html).find("form")[0];
          const formDataBase = new FormDataExtended(form, {});

          formDataBase.delete("img-keep");
          formDataBase.delete("name-keep");

          const formData: Record<string, unknown> = Object.fromEntries(
            Object.entries(formDataBase.toObject()).filter((e) => e[1] !== false)
          );

          for (const property of Object.keys(formData)) {
            // if (property.startsWith("data.")) {
            // 	delete formData[property];
            // 	setProperty(formData, property, getProperty(sourceData, property));
            // }
            if (property) {
              if (property.startsWith("system.")) {
                if(formData[property]) {
                  delete formData[property];
                }
                setProperty(formData, property, getProperty(sourceData, property));
              } else {
                warn(`Cannot set the property '${property}' maybe is a issue ?`);
              }
            }
          }

          //let options = {mystifiedData: formData};
          //if (replace) options.replace = true;
          //this.mystify(itemUuid, options);
          if (replace) {
            this.mystify(itemUuid, { replace: true, mystifiedData: <any>formData });
            this.mystify(itemUuid, { replace: true, mystifiedData: <any>formData });
          } else {
            this.mystify(itemUuid, { replace: false, mystifiedData: <any>formData });
          }
        }
      },
      {
        id: "forien-unidentified-items-mystifyAdvancedDialog"
      }
    );
    await dialog.render(true);

    const jqDialog = $("#forien-unidentified-items-mystifyAdvancedDialog");

    jqDialog.on("change", "input[name=img-keep]", async (event) => {
      const checked = $(event.currentTarget).prop("checked");

      const src = checked ? <string>sourceData.img : <string>meta.img;
      jqDialog.find(".img-preview").attr("src", src);
      jqDialog.find("input[name=img]").val(src);
    });

    jqDialog.on("change", "input[name=name-keep]", async (event) => {
      const checked = <boolean>$(event.currentTarget).prop("checked");

      const nameChanged = checked ? sourceData.name : meta.name;
      jqDialog.find(".name-preview").text(nameChanged ?? "");
      jqDialog.find("input[name=name]").val(nameChanged ?? "");
    });
  }

  /**
   *
   * @hook 'forien-unidentified-items:onIdentifyItem'
   *
   * @param {Item} item
   * @returns {Promise<Item|undefined>}
   */
  static async identify(item: Item): Promise<Item | undefined> {
    if (!item) {
      warn(`Cannot identify a no item`, true);
      return;
    }
    const origData = <MystifiedData>item.getFlag(CONSTANTS.MODULE_NAME, MystifiedFlags.ORIG_DATA);
    if (!origData) {
      warn(`Cannot identify a no mistify item`, true);
      return;
    }
    // things to keep from mystified item:
    // delete origData._id;
    if(origData.permission) {
      try {
        delete origData.permission;
      }catch(e){
        // do nothing
      }
    }
    //@ts-ignore
    if(origData.ownership) {
      try {
        //@ts-ignore
        delete origData.ownership;
      }catch(e){
        // do nothing
      }
    }
    if(origData.folder) {
      try {
        //@ts-ignore
        delete origData.folder;
      }catch(e){
        // do nothing
      }
    }
    const hook = Hooks.call(`${CONSTANTS.MODULE_NAME}:onIdentifyItem`, item, origData);
    if (hook !== false) {
      await item.update(origData, { diff: false });
      await item.unsetFlag(CONSTANTS.MODULE_NAME, MystifiedFlags.ORIG_DATA);
      // If there was nested origData, carry it over.
      const origDataOrigData = getProperty(origData.flags, `${CONSTANTS.MODULE_NAME}.origData`);
      await item.setFlag(CONSTANTS.MODULE_NAME, MystifiedFlags.ORIG_DATA, origDataOrigData);
    }
    return item;
  }

  /**
   *
   * @param {Item} item
   * @return {boolean}
   */
  static isMystified(item: Item): boolean {
    if (!item) {
      return false;
    }
    const origData = item.getFlag(CONSTANTS.MODULE_NAME, MystifiedFlags.ORIG_DATA);
    return origData !== undefined;
  }

  /**
   *
   * @param {Item} item
   * @return {Object}
   */
  static getOrigData(item: Item): MystifiedData {
    return <MystifiedData>item.getFlag(CONSTANTS.MODULE_NAME, MystifiedFlags.ORIG_DATA);
  }

  /**
   *
   * @param {string} uuid
   * @return {boolean}
   */
  static async isUuidMystified(uuid: string) {
    if (!uuid) {
      return false;
    }
    const item = <Item>await this._itemFromUuid(uuid);
    if (!item) {
      warn(`No item found for uuid '${uuid}'`, true);
      return false;
    }
    const origData = item.getFlag(CONSTANTS.MODULE_NAME, MystifiedFlags.ORIG_DATA);
    return origData !== undefined;
  }

  /**
   *
   * @param {MystifiedData} origData
   * @returns {{img: String, name: String, type: String, data: Object}}
   * @private
   */
  static _getMystifiedData(origData: MystifiedData): MystifiedData {
    const mystifiedData = this._getMystifiedMeta(origData);
    const itemProperties = this._getDefaultProperties(origData);

    for (const property of itemProperties) {
      // const propertyTmp = "data." + property;
      // const valueTmp = getProperty(origData, propertyTmp);
      // setProperty(mystifiedData, propertyTmp, valueTmp);
      if (property) {
        let propertyTmp: string | undefined = undefined;
        if (property.startsWith("system.")) {
          propertyTmp = property;
        } else {
          propertyTmp = "system." + property;
        }
        const valueTmp = getProperty(origData, <string>propertyTmp);
        setProperty(mystifiedData, <string>propertyTmp, valueTmp);
      } else {
        warn(`Cannot set the property '${property}' maybe is a issue ?`);
      }
    }

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
    const defaultProperties = <any>game.settings.get(CONSTANTS.MODULE_NAME, "itemProperties");
    return defaultProperties[origData.type];
  }

  static keepOriginalImage() {
    return <string>game.settings.get(CONSTANTS.MODULE_NAME, "keepOldIcon");
  }

  /**
   *
   * @param {Object} origData
   * @returns {{img: String, name: String, type: String}}
   * @private
   */
  static _getMystifiedMeta(origData): MystifiedData {
    const iconSettings = <DefaultIcons>game.settings.get(CONSTANTS.MODULE_NAME, "defaultIcons");
    const iconType =
      <string>getProperty(iconSettings, origData.type) ||
      `/scripts/${CONSTANTS.MODULE_NAME}/icons/${CONSTANTS.DEFAULT_ICON}`;

    return {
      name: <string>i18n(`${CONSTANTS.MODULE_NAME}.NewMystified`),
      type: <string>origData.type,
      img: <string>iconType
    };
  }

  /**
   *
   * @param {string} uuid
   * @returns {Promise<Item|undefined>}
   * @private
   */
  static async _itemFromUuid(uuid: string): Promise<Item | undefined> {
    return this._uuidToDocument(uuid);
    // const parts = <string[]>uuid.split(".");
    // const [entityName, entityId, embeddedName, embeddedId] = parts;

    // if (embeddedName === "OwnedItem" || embeddedName === "Item") {
    // 	if (parts.length === 4) {
    // 		const actor = <Actor>game.actors?.get(<string>entityId);
    // 		if (!actor) {
    // 			return undefined;
    // 		}
    // 		return <Item>actor.items.get(<string>embeddedId);
    // 	}
    // } else {
    // 	return <Item>await fromUuid(uuid);
    // }
    // return;
  }

  // /**
  //  *
  //  * @param {string} packId
  //  * @param {string} itemId
  //  * @return {Promise.<Item|undefined>}
  //  * @deprecated do not use this anymore
  //  * @private
  //  */
  // static async _getItemFromPack(packId:string, itemId:string) {
  // 	const pack = <CompendiumCollection<CompendiumCollection.Metadata>>game.packs.get(packId);
  // 	if (pack.documentName !== "Item") {
  // 		return null;
  // 	}
  // 	return await pack.getDocument(itemId).then((ent) => {
  // 		//delete ent?._id;
  // 		//@ts-ignore
  // 		if (ent?._id) {
  // 			//@ts-ignore
  // 			ent._id = "";
  // 		}
  // 		return ent;
  // 	});
  // }

  static async _uuidToDocument(uuid) {
    const parts = uuid.split(".");
    let result: any | null = null;
    if (parts[0] === "Compendium") {
      const pack = game["packs"].get(parts[1] + "." + parts[2]);
      if (pack !== undefined) {
        result = await pack.getDocument(parts[3]);
      }
    } else {
      result = await fromUuid(uuid);
    }
    if (result === null) {
      error(`Document Not Found for uuid ${uuid}`);
      result = null;
    }
    return result;
  }
}
