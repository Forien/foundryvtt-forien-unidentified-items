import constants from "../constants.mjs";

export default class DefaultIcons extends FormApplication {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "fui-default-icons",
      template: `${constants.modulePath}/templates/settings-default-icons.html`,
      title: game.i18n.localize("ForienUnidentifiedItems.Settings.defaultIcons.name"),
      submitOnClose: true,
      submitOnChange: false,
      closeOnSubmit: true
    });
  }

  getData(options = {}) {
    return {
      types: this.getItemTypes(),
      typeSettings: this.getSettings(),
      options: this.options
    };
  }

  activateListeners(html) {
    super.activateListeners(html);

    html.on("change", "input", (event) => {
      let input = $(event.currentTarget);
      let type = input.attr('name');
      $(`#default-icon-img-${type}`).attr('src', input.val());
    });

    html.on("click", ".file-picker", (event) => {
      Hooks.once('closeFilePicker', () => {
        console.log('whoop!');
        let button = $(event.currentTarget);
        let target = button.data('target');
        $(`#fui-default-icons input[name=${target}]`).trigger('change');
      });
    })
  }

  async _updateObject(event, formData) {
    return await this.saveSettings(formData);
  }

  getSettings() {
    let settings = this.loadSettings();
    let types = this.getItemTypes();

    types.forEach((type) => {
      let setting = getProperty(settings, type);
      if (!setting) {
        settings[type] = this.getIcon(this.guessIcon(type))
      }
    });

    return settings;
  }

  guessIcon(type) {
    const modes = ['inv-unidentified', 'unidentified'];
    const types = {
      armor: ['armor', 'armour', 'equipment', 'gear'],
      book: ['Skill', 'book', 'career', 'class', 'feat', 'skill', 'specialization', 'spellbook', 'talent'],
      emerald: ['ancestry', 'crystal', 'jewellery'],
      knapsack: ['backpack', 'container'],
      loot: ['loot', 'treasure'],
      potion: ['consumable'],
      sack: ['artifact', 'goods', 'trapping'],
      scroll: ['ability', 'enchantment', 'magic', 'prayer', 'sorcery', 'spell'],
      tool: ['tool']
    };
    let mode = modes[Math.floor(Math.random() * modes.length)];
    let icon = mode;

    for (let iconType in types) {
      if (types[iconType].includes(type)) {
        icon = `${mode}-${iconType}`;
      }
    }

    return `${icon}.png`
  }


  loadSettings() {
    return game.settings.get(constants.moduleName, "defaultIcons");
  }

  async saveSettings(data) {
    return await game.settings.set(constants.moduleName, "defaultIcons", data);
  }

  getItemTypes() {
    return Object.keys(game.system.model.Item);
  }

  getIcon(icon) {
    return `${constants.modulePath}/icons/${icon}`;
  }
}