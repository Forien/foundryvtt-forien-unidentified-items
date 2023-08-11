import CONSTANTS from "../constants/constants.mjs";
import SETTINGS from "../constants/settings.mjs";
import { i18n } from "../lib/lib.mjs";
export default class ItemProperties extends FormApplication {
  static get defaultOptions() {
    const options = mergeObject(super.defaultOptions, {
      id: "forien-unidentified-items-item-properties",
      template: `/scripts/${CONSTANTS.MODULE_NAME}/templates/settings-item-properties.html`,
      title: i18n(`${CONSTANTS.MODULE_NAME}.Settings.itemProperties.name`),
      submitOnClose: true,
      submitOnChange: false,
      closeOnSubmit: true,
      resizable: true,
      width: 640,
      height: 560,
      tabs: [{ navSelector: ".nav-tabs", contentSelector: ".nav-body" }],
    });

    if (game.system.id === "wfrp4e") {
      options.classes.push("wfrp4e");
    }
    return options;
  }

  getData(options = {}) {
    const data = super.getData();
    (data.types = this.getItemTypes()), (data.propertySettings = this.getSettings()), (data.options = this.options);
    return data;
    // return {
    //   types: this.getItemTypes(),
    //   propertySettings: this.getSettings(),
    //   options: this.options
    // };
  }

  activateListeners(html) {
    super.activateListeners(html);
  }

  async _updateObject(event, formData) {
    const data = Object.entries(formData);
    const settings = {};

    data.sort().map((d) => {
      const type = d[0].split(".", 1)[0];
      const property = d[0].replace(`${type}.`, "");
      const value = d[1];

      if (settings[type] === undefined) {
        settings[type] = {};
      }
      settings[type][property] = value;
    });

    return await this.saveSettings(settings);
  }

  getProperties() {
    const types = Object.entries(game.system.model.Item);
    const properties = new Map(types);
    for (const [key, value] of properties) {
      properties.set(key, Object.keys(flattenObject(value)));
    }
    return properties;
  }

  getSettings() {
    const settings = this.loadSettings();
    const types = this.getItemTypes();
    const properties = this.getProperties();

    for (const type of types) {
      const setting = getProperty(settings, type);
      if (!setting) {
        const typeProperties = properties.get(type);
        settings[type] = typeProperties.reduce((a, b) => ((a[b] = false), a), {});
      }
    }

    return settings;
  }

  loadSettings() {
    return game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.DEFAULT_PROPERTIES);
  }

  async saveSettings(data) {
    if (data?.object) {
      return await game.settings.set(CONSTANTS.MODULE_NAME, SETTINGS.DEFAULT_PROPERTIES, data.object);
    } else {
      return await game.settings.set(CONSTANTS.MODULE_NAME, SETTINGS.DEFAULT_PROPERTIES, data);
    }
  }

  getItemTypes() {
    return Object.keys(game.system.model.Item);
  }

  getIcon(icon) {
    return `/scripts/${CONSTANTS.MODULE_NAME}/icons/${icon}`;
  }
}
