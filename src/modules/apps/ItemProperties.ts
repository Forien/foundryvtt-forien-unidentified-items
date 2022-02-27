import { i18n } from '../lib/lib';
import { FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME } from '../settings';
import { canvas, game } from '../settings';
export default class ItemProperties extends FormApplication<FormApplicationOptions, object, any> {
  static get defaultOptions(): any {
    const options = mergeObject(super.defaultOptions, {
      id: 'fui-item-properties',
      template: `/modules/${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}/templates/settings-item-properties.html`,
      title: i18n(`${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}.itemProperties.name`),
      submitOnClose: true,
      submitOnChange: false,
      closeOnSubmit: true,
      resizable: true,
      width: 640,
      height: 560,
      tabs: [{ navSelector: '.nav-tabs', contentSelector: '.nav-body' }],
    });

    if (game.system.id === 'wfrp4e') {
      options.classes.push('wfrp');
    }
    return options;
  }

  getData(options = {}): any {
    const data: any = super.getData();
    (data.types = this.getItemTypes()), (data.propertySettings = this.getSettings()), (data.options = this.options);
    return data;
    // return {
    //   types: this.getItemTypes(),
    //   propertySettings: this.getSettings(),
    //   options: this.options
    // };
  }

  activateListeners(html): void {
    super.activateListeners(html);
  }

  async _updateObject(event, formData): Promise<any> {
    const data = Object.entries(formData);
    const settings = {};

    data.sort().map((d) => {
      const type = d[0].split('.', 1)[0];
      const property = d[0].replace(`${type}.`, '');
      const value = d[1];

      if (settings[type] === undefined) {
        settings[type] = {};
      }
      settings[type][property] = value;
    });

    return await this.saveSettings(settings);
  }

  getProperties(): Map<string, any> {
    const types = Object.entries(game.system.model.Item);
    const properties = new Map<string, any>(types);
    properties.forEach((value, key, map) => {
      map.set(key, Object.keys(flattenObject(value)));
    });
    return properties;
  }

  getSettings(): any {
    const settings: any = this.loadSettings();
    const types = this.getItemTypes();
    const properties: Map<string, any> = this.getProperties();

    types.forEach((type) => {
      const setting = getProperty(settings, type);
      if (!setting) {
        const typeProperties = properties.get(type);
        settings[type] = typeProperties.reduce((a, b) => ((a[b] = false), a), {});
      }
    });

    return settings;
  }

  loadSettings(): any {
    return game.settings.get(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME, 'itemProperties');
  }

  async saveSettings(data) {
    return await game.settings.set(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME, 'itemProperties', data);
  }

  getItemTypes() {
    return Object.keys(game.system.model.Item);
  }

  getIcon(icon) {
    return `/modules/${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}/icons/${icon}`;
  }
}
