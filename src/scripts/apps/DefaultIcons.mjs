import CONSTANTS from "../constants/constants.mjs";
import SETTINGS from "../constants/settings.mjs";
import { i18n } from "../lib/lib.mjs";

export default class DefaultIcons extends FormApplication {
  static get defaultOptions() {
    const options = mergeObject(super.defaultOptions, {
      id: "forien-unidentified-items-default-icons",
      template: `/scripts/${CONSTANTS.MODULE_NAME}/templates/settings-default-icons.html`,
      title: i18n(`${CONSTANTS.MODULE_NAME}.Settings.defaultIcons.name`),
      submitOnClose: true,
      submitOnChange: false,
      closeOnSubmit: true,
    });

    if (game.system.id === "wfrp4e") {
      options.classes.push("wfrp4e");
    }
    return options;
  }

  getData(options = {}) {
    const data = super.getData();
    data.types = this.getItemTypes();
    data.typeSettings = this.getSettings();
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

    html.on("change", "input", (event) => {
      const input = $(event.currentTarget);
      const type = input.attr("name");
      $(`#default-icon-img-${type}`).attr("src", String(input.val()));
    });

    html.on("click", ".file-picker", (event) => {
      Hooks.once("closeFilePicker", () => {
        const button = $(event.currentTarget);
        const target = button.data("target");
        $(`#forien-unidentified-items-default-icons input[name=${target}]`).trigger("change");
      });
    });
  }

  async _updateObject(event, formData) {
    return await this.saveSettings(formData);
  }

  getSettings() {
    const settings = this.loadSettings();
    const types = this.getItemTypes();

    for (const type of types) {
      const setting = getProperty(settings, type);
      if (!setting) {
        settings[type] = this.getIcon(this.guessIcon(type));
      }
    }

    return settings;
  }

  guessIcon(type) {
    const modes = ["inv-unidentified", "unidentified"];
    const types = {
      armor: ["armor", "armour", "equipment", "gear"],
      book: ["Skill", "book", "career", "class", "feat", "skill", "specialization", "spellbook", "talent"],
      emerald: ["ancestry", "crystal", "jewellery"],
      knapsack: ["backpack", "container"],
      loot: ["loot", "treasure"],
      potion: ["consumable"],
      sack: ["artifact", "goods", "trapping"],
      scroll: ["ability", "enchantment", "magic", "prayer", "sorcery", "spell"],
      tool: ["tool"],
    };
    const mode = modes[Math.floor(Math.random() * modes.length)];
    let icon = mode;

    for (const iconType in types) {
      if (types[iconType].includes(type)) {
        icon = `${mode}-${iconType}`;
      }
    }

    return `${icon}.png`;
  }

  loadSettings() {
    return game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.DEFAULT_ICONS);
  }

  async saveSettings(data) {
    if (data?.object) {
      return await game.settings.set(CONSTANTS.MODULE_NAME, SETTINGS.DEFAULT_ICONS, data.object);
    } else {
      return await game.settings.set(CONSTANTS.MODULE_NAME, SETTINGS.DEFAULT_ICONS, data);
    }
  }

  getItemTypes() {
    return Object.keys(game.system.model.Item);
  }

  getIcon(icon) {
    return `/scripts/${CONSTANTS.MODULE_NAME}/icons/${icon}`;
  }
}
