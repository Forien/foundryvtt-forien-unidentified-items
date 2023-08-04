import API from "./api.mjs";
import DefaultIcons from "./apps/DefaultIcons.mjs";
import ItemProperties from "./apps/ItemProperties.mjs";
import CONSTANTS from "./constants.mjs";
import { dialogWarning, i18n, info, log, warn } from "./lib/lib.mjs";
import { SYSTEMS } from "./systems.mjs";

export default function registerSettings() {
  game.settings.registerMenu(CONSTANTS.MODULE_NAME, "resetAllSettings", {
    name: `${CONSTANTS.MODULE_NAME}.Settings.reset.name`,
    hint: `${CONSTANTS.MODULE_NAME}.Settings.reset.hint`,
    icon: "fas fa-coins",
    type: ResetSettingsDialog,
    restricted: true
  });

  // =====================================================================

  //registerSettingMenus();
  game.settings.registerMenu(CONSTANTS.MODULE_NAME, "defaultIcons", {
    name: `${CONSTANTS.MODULE_NAME}.Settings.defaultIcons.name`,
    label: `${CONSTANTS.MODULE_NAME}.Settings.defaultIcons.label`,
    hint: `${CONSTANTS.MODULE_NAME}.Settings.defaultIcons.hint`,
    icon: "fas fa-image",
    type,
    restricted: true
  });

  game.settings.registerMenu(CONSTANTS.MODULE_NAME, "itemProperties", {
    name: `${CONSTANTS.MODULE_NAME}.Settings.itemProperties.name`,
    label: `${CONSTANTS.MODULE_NAME}.Settings.itemProperties.label`,
    hint: `${CONSTANTS.MODULE_NAME}.Settings.itemProperties.hint`,
    icon: "fas fa-cogs",
    typeProperties,
    restricted: true
  });

  game.settings.register(CONSTANTS.MODULE_NAME, "removeLabelButtonsSheetHeader", {
    name: i18n(`${CONSTANTS.MODULE_NAME}.Settings.removeLabelButtonsSheetHeader.name`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.Settings.removeLabelButtonsSheetHeader.hint`),
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(CONSTANTS.MODULE_NAME, "keepOldIcon", {
    name: `${CONSTANTS.MODULE_NAME}.Settings.keepOldIcon.name`,
    hint: `${CONSTANTS.MODULE_NAME}.Settings.keepOldIcon.hint`,
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  game.settings.register(CONSTANTS.MODULE_NAME, "allowNestedItems", {
    name: `${CONSTANTS.MODULE_NAME}.Settings.allowNestedItems.Name`,
    hint: `${CONSTANTS.MODULE_NAME}.Settings.allowNestedItems.Hint`,
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });

  // =====================================================================

  game.settings.register(CONSTANTS.MODULE_NAME, "debug", {
    name: `${CONSTANTS.MODULE_NAME}.Settings.debug.name`,
    hint: `${CONSTANTS.MODULE_NAME}.Settings.debug.hint`,
    scope: "client",
    config: true,
    default: false,
    type: Boolean
  });

  game.settings.register(CONSTANTS.MODULE_NAME, "debugHooks", {
    scope: "world",
    config: false,
    default: false,
    type: Boolean
  });

  game.settings.register(CONSTANTS.MODULE_NAME, "systemFound", {
    scope: "world",
    config: false,
    default: false,
    type: Boolean
  });

  game.settings.register(CONSTANTS.MODULE_NAME, "systemNotFoundWarningShown", {
    scope: "world",
    config: false,
    default: false,
    type: Boolean
  });

  game.settings.register(CONSTANTS.MODULE_NAME, "preconfiguredSystem", {
    name: `${CONSTANTS.MODULE_NAME}.Settings.preconfiguredSystem.name`,
    hint: `${CONSTANTS.MODULE_NAME}.Settings.preconfiguredSystem.hint`,
    scope: "world",
    config: false,
    default: false,
    type: Boolean
  });

  // ========================================================================

  const settings = defaultSettings();
  for (const [name, data] of Object.entries(settings)) {
    game.settings.register(CONSTANTS.MODULE_NAME, name, data);
  }

  // for (const [name, data] of Object.entries(otherSettings)) {
  //     game.settings.register(CONSTANTS.MODULE_NAME, name, data);
  // }
}

class ResetSettingsDialog extends FormApplication {
  constructor(...args) {
    //@ts-ignore
    super(...args);
    //@ts-ignore
    return new Dialog({
      title: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.Dialog.resetsettings.title`),
      content:
        '<p style="margin-bottom:1rem;">' +
        game.i18n.localize(`${CONSTANTS.MODULE_NAME}.Dialog.resetsettings.content`) +
        "</p>",
      buttons: {
        confirm: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.Dialog.resetsettings.confirm`),
          callback: async () => {
            const worldSettings = game.settings.storage
              ?.get("world")
              ?.filter((setting) => setting.key.startsWith(`${CONSTANTS.MODULE_NAME}.`));
            for (let setting of worldSettings) {
              console.log(`Reset setting '${setting.key}'`);
              await setting.delete();
            }
            await applyDefaultSettings();
            window.location.reload();
          }
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.Dialog.resetsettings.cancel`)
        }
      },
      default: "cancel"
    });
  }

  async _updateObject(event, formData) {
    // do nothing
  }
}

async function applyDefaultSettings() {
  const settings = defaultSettings(true);
  for (const [name, data] of Object.entries(settings)) {
    await game.settings.set(CONSTANTS.MODULE_NAME, name, data.default);
  }
  // const settings2 = otherSettings(true);
  // for (const [name, data] of Object.entries(settings2)) {
  // 	//@ts-ignore
  // 	await game.settings.set(CONSTANTS.MODULE_NAME, name, data.default);
  // }
}

function defaultSettings(apply = false) {
  return {
    defaultIcons: {
      name: `${CONSTANTS.MODULE_NAME}.Settings.defaultIcons.name`,
      hint: `${CONSTANTS.MODULE_NAME}.Settings.defaultIcons.hint`,
      scope: "world",
      config: false,
      default: {}
    },
    itemProperties: {
      name: `${CONSTANTS.MODULE_NAME}.Settings.itemProperties.name`,
      hint: `${CONSTANTS.MODULE_NAME}.Settings.itemProperties.hint`,
      scope: "world",
      config: false,
      default: {}
    }
  };
}

export async function checkSystem() {
  if (!SYSTEMS.DATA) {
    if (game.settings.get(CONSTANTS.MODULE_NAME, "systemNotFoundWarningShown")) return;

    await game.settings.set(CONSTANTS.MODULE_NAME, "systemNotFoundWarningShown", true);

    return Dialog.prompt({
      title: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.Dialog.nosystemfound.title`),
      content: dialogWarning(game.i18n.localize(`${CONSTANTS.MODULE_NAME}.Dialog.nosystemfound.content`)),
      callback: () => {
        // empty body just for avoid the error on eslint
      }
    });
  }

  if (game.settings.get(CONSTANTS.MODULE_NAME, "systemFound")) return;

  game.settings.set(CONSTANTS.MODULE_NAME, "systemFound", true);

  if (game.settings.get(CONSTANTS.MODULE_NAME, "systemNotFoundWarningShown")) {
    return new Dialog({
      title: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.Dialog.systemfound.title`),
      content: warn(game.i18n.localize(`${CONSTANTS.MODULE_NAME}.Dialog.systemfound.content`), true),
      buttons: {
        confirm: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.Dialog.systemfound.confirm`),
          callback: () => {
            applyDefaultSettings();
          }
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize("No")
        }
      },
      default: "cancel"
    }).render(true);
  }

  return applyDefaultSettings();
}

/**
 * Checks if options exist, if not, orders their initialization
 */
export function checkSettingsInitialized() {
  if (!game.user?.isGM) {
    return;
  }
  const defaultIcons = game.settings.get(CONSTANTS.MODULE_NAME, "defaultIcons");
  const itemProperties = game.settings.get(CONSTANTS.MODULE_NAME, "itemProperties");

  if (checkObjEmpty(defaultIcons)) {
    initializeDefaultIcons();
  }

  if (checkObjEmpty(itemProperties)) {
    initializeItemProperties();
  }
}

function checkObjEmpty(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

/**
 * One-time settings initialization function
 *
 * @hook "forien-unidentified-items:onInitializeDefaultIcons"
 */
function initializeDefaultIcons() {
  const di = new DefaultIcons({}, {});
  let settings = di.getSettings();
  const icons = duplicate(settings);
  log(JSON.stringify(icons));
  Hooks.call(`${CONSTANTS.MODULE_NAME}:onInitializeDefaultIcons`, icons);
  settings = mergeObject(settings, icons);
  di.saveSettings(settings);
  log(`Initialized default item icons.`);
  info(game.i18n.localize(`${CONSTANTS.MODULE_NAME}.Notifications.defaultIconsInitialized`), true, true);
}

/**
 * One-time settings initialization function
 *
 * @hook "forien-unidentified-items:onInitializeItemProperties"
 */
function initializeItemProperties() {
  const ip = new ItemProperties({}, {});
  let settings = ip.getSettings();
  settings = Object.entries(settings);
  settings = settings.map((type) => {
    let entries = Object.entries(type[1]);
    entries = entries.sort((a, b) => {
      if (a[0] < b[0]) {
        return -1;
      }
      if (a[0] > b[0]) {
        return 1;
      }
      return 0;
    });
    type[1] = Object.fromEntries(entries);
    return type;
  });
  settings = Object.fromEntries(settings);
  //settings = setDefaultItemProperties(settings);
  settings = mergeObject(settings, API.DEFAULT_PROPERTIES);
  const properties = duplicate(settings);
  Hooks.call(`${CONSTANTS.MODULE_NAME}:onInitializeItemProperties`, properties);
  log(JSON.stringify(properties));
  settings = mergeObject(settings, properties);
  ip.saveSettings(settings);
  log(` Initialized default item properties.`);
  info(i18n(`${CONSTANTS.MODULE_NAME}.Notifications.defaultPropertiesInitialized`), true, true);
}
