import API from "./api.mjs";
import DefaultIcons from "./apps/DefaultIcons.mjs";
import ItemProperties from "./apps/ItemProperties.mjs";
import CONSTANTS from "./constants/constants.mjs";
import SETTINGS from "./constants/settings.mjs";
import { debug, dialogWarning, i18n, info, log, warn } from "./lib/lib.mjs";
import { SYSTEMS } from "./systems.mjs";

/**
 * @param key
 * @returns {*}
 */
export function getSetting(key) {
  return game.settings.get(CONSTANTS.MODULE_NAME, key);
}

export function setSetting(key, value) {
  if (value === undefined) {
    throw new Error("setSetting | value must not be undefined!");
  }
  return game.settings.set(CONSTANTS.MODULE_NAME, key, value);
}

export default function registerSettings() {
  game.settings.registerMenu(CONSTANTS.MODULE_NAME, "resetAllSettings", {
    name: `${CONSTANTS.MODULE_NAME}.Settings.reset.name`,
    hint: `${CONSTANTS.MODULE_NAME}.Settings.reset.hint`,
    icon: "fas fa-coins",
    type: ResetSettingsDialog,
    restricted: true,
  });

  // =====================================================================

  game.settings.register(CONSTANTS.MODULE_NAME, "removeLabelButtonsSheetHeader", {
    name: i18n(`${CONSTANTS.MODULE_NAME}.Settings.removeLabelButtonsSheetHeader.name`),
    hint: i18n(`${CONSTANTS.MODULE_NAME}.Settings.removeLabelButtonsSheetHeader.hint`),
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, "keepOldIcon", {
    name: `${CONSTANTS.MODULE_NAME}.Settings.keepOldIcon.name`,
    hint: `${CONSTANTS.MODULE_NAME}.Settings.keepOldIcon.hint`,
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, "allowNestedItems", {
    name: `${CONSTANTS.MODULE_NAME}.Settings.allowNestedItems.Name`,
    hint: `${CONSTANTS.MODULE_NAME}.Settings.allowNestedItems.Hint`,
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });

  // =====================================================================

  game.settings.register(CONSTANTS.MODULE_NAME, "debug", {
    name: `${CONSTANTS.MODULE_NAME}.Settings.debug.name`,
    hint: `${CONSTANTS.MODULE_NAME}.Settings.debug.hint`,
    scope: "client",
    config: true,
    default: false,
    type: Boolean,
  });

  // ========================================================================

  for (let [name, data] of Object.entries(SETTINGS.GET_DEFAULT())) {
    game.settings.register(CONSTANTS.MODULE_NAME, name, data);
  }
}

export async function applyDefaultSettings() {
  const settings = SETTINGS.GET_SYSTEM_DEFAULTS();
  for (const [name, data] of Object.entries(settings)) {
    await setSetting(name, data.default);
  }
  await setSetting(SETTINGS.SYSTEM_VERSION, SYSTEMS.DATA.VERSION);
}

export function applySystemSpecificStyles(data = false) {
  // TODO ?
}

export async function checkSystem() {
  if (!SYSTEMS.HAS_SYSTEM_SUPPORT) {
    if (getSetting(SETTINGS.SYSTEM_NOT_FOUND_WARNING_SHOWN)) return;

    let settingsValid = true;
    for (const [name, data] of Object.entries(SETTINGS.GET_DEFAULT())) {
      settingsValid = settingsValid && getSetting(name).length !== new data.type().length;
    }

    if (settingsValid) return;

    // TJSDialog.prompt({
    //   title: game.i18n.localize("ITEM-PILES.Dialogs.NoSystemFound.Title"),
    //   content: {
    //     class: CustomDialog,
    //     props: {
    //       content: game.i18n.localize("ITEM-PILES.Dialogs.NoSystemFound.Content"),
    //     },
    //   },
    // });
    new Dialog({
      title: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.Dialog.systemfound.title`),
      content: warn(game.i18n.localize(`${CONSTANTS.MODULE_NAME}.Dialog.systemfound.content`), true),
      buttons: {
        confirm: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.Dialog.systemfound.confirm`),
          callback: () => {
            applyDefaultSettings();
          },
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize("No"),
        },
      },
      default: "cancel",
    }).render(true);

    return setSetting(SETTINGS.SYSTEM_NOT_FOUND_WARNING_SHOWN, true);
  }

  if (getSetting(SETTINGS.SYSTEM_FOUND) || SYSTEMS.DATA.INTEGRATION) {
    const currentVersion = getSetting(SETTINGS.SYSTEM_VERSION);
    const newVersion = SYSTEMS.DATA.VERSION;
    debug(`Comparing system version - Current: ${currentVersion} - New: ${newVersion}`);
    if (foundry.utils.isNewerVersion(newVersion, currentVersion)) {
      debug(`Applying system settings for ${game.system.title}`);
      await applyDefaultSettings();
    }
    return;
  }

  await setSetting(SETTINGS.SYSTEM_FOUND, true);

  if (getSetting(SETTINGS.SYSTEM_NOT_FOUND_WARNING_SHOWN)) {
    dialogWarning(game.i18n.localize(`${CONSTANTS.MODULE_NAME}.Dialog.nosystemfound.content`));
  }

  return applyDefaultSettings();
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
          },
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.Dialog.resetsettings.cancel`),
        },
      },
      default: "cancel",
    });
  }

  async _updateObject(event, formData) {
    // do nothing
  }
}

/**
 * Checks if options exist, if not, orders their initialization
 */
export function checkSettingsInitialized() {
  if (!game.user?.isGM) {
    return;
  }
  const defaultIcons = game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.DEFAULT_ICONS);
  const itemProperties = game.settings.get(CONSTANTS.MODULE_NAME, SETTINGS.DEFAULT_PROPERTIES);

  if (checkObjEmpty(defaultIcons)) {
    initializeDefaultIcons();
  }

  if (checkObjEmpty(itemProperties)) {
    initializeItemProperties();
  }
}

function checkObjEmpty(obj) {
  const isEmpty = Object.keys(obj).length === 0 && obj.constructor === Object;
  if (isEmpty || obj?.object) {
    return true;
  }
  return false;
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
