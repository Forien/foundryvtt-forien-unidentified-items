import constants from "../constants.js";
export default class ItemProperties extends FormApplication {
    static get defaultOptions() {
        //@ts-ignore
        let options = mergeObject(super.defaultOptions, {
            id: "fui-item-properties",
            template: `${constants.modulePath}/templates/settings-item-properties.html`,
            title: game.i18n.localize("ForienUnidentifiedItems.Settings.itemProperties.name"),
            submitOnClose: true,
            submitOnChange: false,
            closeOnSubmit: true,
            resizable: true,
            width: 640,
            height: 560,
            tabs: [{ navSelector: ".nav-tabs", contentSelector: ".nav-body" }]
        });
        if (game.system.id === 'wfrp4e')
            options.classes.push('wfrp');
        return options;
    }
    getData(options = {}) {
        let data = super.getData();
        data.types = this.getItemTypes(),
            data.propertySettings = this.getSettings(),
            data.options = this.options;
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
        let data = Object.entries(formData);
        let settings = {};
        data.sort().map(d => {
            let type = d[0].split('.', 1)[0];
            let property = d[0].replace(`${type}.`, '');
            let value = d[1];
            if (settings[type] === undefined)
                settings[type] = {};
            settings[type][property] = value;
        });
        return await this.saveSettings(settings);
    }
    getProperties() {
        let types = Object.entries(game.system.model.Item);
        let properties = new Map(types);
        properties.forEach((value, key, map) => {
            map.set(key, Object.keys(flattenObject(value)));
        });
        return properties;
    }
    getSettings() {
        let settings = this.loadSettings();
        let types = this.getItemTypes();
        let properties = this.getProperties();
        types.forEach((type) => {
            let setting = getProperty(settings, type);
            if (!setting) {
                let typeProperties = properties.get(type);
                settings[type] = typeProperties.reduce((a, b) => (a[b] = false, a), {});
            }
        });
        return settings;
    }
    loadSettings() {
        return game.settings.get(constants.moduleName, "itemProperties");
    }
    async saveSettings(data) {
        return await game.settings.set(constants.moduleName, "itemProperties", data);
    }
    getItemTypes() {
        return Object.keys(game.system.model.Item);
    }
    getIcon(icon) {
        return `${constants.modulePath}/icons/${icon}`;
    }
}
