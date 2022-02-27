import API from './api';
import DefaultIcons from './apps/DefaultIcons';
import ItemProperties from './apps/ItemProperties';
import CONSTANTS from './constants';
import { dialogWarning, i18n, log, warn } from './lib/lib';
import { SYSTEMS } from './systems';

export const FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME = 'forien-unidentified-items';

export const FORIEN_UNIDENTIFIED_ITEMS_DEFAULT_ICON = 'unidentified.png';

export const game = getGame();
export const canvas = getCanvas();

/**
 * Because typescript doesn't know when in the lifecycle of foundry your code runs, we have to assume that the
 * canvas is potentially not yet initialized, so it's typed as declare let canvas: Canvas | {ready: false}.
 * That's why you get errors when you try to access properties on canvas other than ready.
 * In order to get around that, you need to type guard canvas.
 * Also be aware that this will become even more important in 0.8.x because no canvas mode is being introduced there.
 * So you will need to deal with the fact that there might not be an initialized canvas at any point in time.
 * @returns
 */
function getCanvas(): Canvas {
  if (!(canvas instanceof Canvas) || !canvas.ready) {
    throw new Error('Canvas Is Not Initialized');
  }
  return canvas;
}
/**
 * Because typescript doesn't know when in the lifecycle of foundry your code runs, we have to assume that the
 * canvas is potentially not yet initialized, so it's typed as declare let canvas: Canvas | {ready: false}.
 * That's why you get errors when you try to access properties on canvas other than ready.
 * In order to get around that, you need to type guard canvas.
 * Also be aware that this will become even more important in 0.8.x because no canvas mode is being introduced there.
 * So you will need to deal with the fact that there might not be an initialized canvas at any point in time.
 * @returns
 */
function getGame(): Game {
  if (!(game instanceof Game)) {
    throw new Error('Game Is Not Initialized');
  }
  return game;
}

export default function registerSettings() {
  game.settings.registerMenu(CONSTANTS.MODULE_NAME, 'resetAllSettings', {
    name: `${CONSTANTS.MODULE_NAME}.setting.reset.name`,
    hint: `${CONSTANTS.MODULE_NAME}.setting.reset.hint`,
    icon: 'fas fa-coins',
    type: ResetSettingsDialog,
    restricted: true,
  });

  // =====================================================================

  //registerSettingMenus();
  game.settings.registerMenu(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME, 'defaultIcons', {
    name: `${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}.Settings.defaultIcons.name`,
    label: `${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}.Settings.defaultIcons.label`,
    hint: `${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}.Settings.defaultIcons.hint`,
    icon: 'fas fa-image',
    type: DefaultIcons,
    restricted: true,
  });

  game.settings.registerMenu(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME, 'itemProperties', {
    name: `${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}.Settings.itemProperties.name`,
    label: `${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}.Settings.itemProperties.label`,
    hint: `${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}.Settings.itemProperties.hint`,
    icon: 'fas fa-cogs',
    type: ItemProperties,
    restricted: true,
  });

  game.settings.register(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME, 'removeLabelButtonsSheetHeader', {
    name: i18n(`${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}.Setting.removeLabelButtonsSheetHeader.name`),
    hint: i18n(`${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}.Setting.removeLabelButtonsSheetHeader.hint`),
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME, 'keepOldIcon', {
    name: `${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}.Settings.keepOldIcon.name`,
    hint: `${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}.Settings.keepOldIcon.hint`,
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME, 'allowNestedItems', {
    name: `${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}.Settings.allowNestedItems.Name`,
    hint: `${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}.Settings.allowNestedItems.Hint`,
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
  });

  // =====================================================================

  game.settings.register(CONSTANTS.MODULE_NAME, 'debug', {
    name: `${CONSTANTS.MODULE_NAME}.setting.debug.name`,
    hint: `${CONSTANTS.MODULE_NAME}.setting.debug.hint`,
    scope: 'client',
    config: true,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'debugHooks', {
    scope: 'world',
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'systemFound', {
    scope: 'world',
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'systemNotFoundWarningShown', {
    scope: 'world',
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(CONSTANTS.MODULE_NAME, 'preconfiguredSystem', {
    name: `${CONSTANTS.MODULE_NAME}.setting.preconfiguredSystem.name`,
    hint: `${CONSTANTS.MODULE_NAME}.setting.preconfiguredSystem.hint`,
    scope: 'world',
    config: false,
    default: false,
    type: Boolean,
  });

  // ========================================================================

  const settings = defaultSettings();
  for (const [name, data] of Object.entries(settings)) {
    game.settings.register(CONSTANTS.MODULE_NAME, name, <any>data);
  }

  // for (const [name, data] of Object.entries(otherSettings)) {
  //     game.settings.register(CONSTANTS.MODULE_NAME, name, data);
  // }
}

class ResetSettingsDialog extends FormApplication<FormApplicationOptions, object, any> {
  constructor(...args) {
    //@ts-ignore
    super(...args);
    //@ts-ignore
    return new Dialog({
      title: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.resetsettings.title`),
      content:
        '<p style="margin-bottom:1rem;">' +
        game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.resetsettings.content`) +
        '</p>',
      buttons: {
        confirm: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.resetsettings.confirm`),
          callback: async () => {
            await applyDefaultSettings();
            window.location.reload();
          },
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.resetsettings.cancel`),
        },
      },
      default: 'cancel',
    });
  }

  async _updateObject(event: Event, formData?: object): Promise<any> {
    // do nothing
  }
}

async function applyDefaultSettings() {
  const settings = defaultSettings(true);
  for (const [name, data] of Object.entries(settings)) {
    await game.settings.set(CONSTANTS.MODULE_NAME, name, data.default);
  }
  const settings2 = otherSettings(true);
  for (const [name, data] of Object.entries(settings2)) {
    //@ts-ignore
    await game.settings.set(CONSTANTS.MODULE_NAME, name, data.default);
  }
}

function defaultSettings(apply = false) {
  return {
    defaultIcons: {
      name: `${CONSTANTS.MODULE_NAME}.setting.defaultIcons.name`,
      hint: `${CONSTANTS.MODULE_NAME}.setting.defaultIcons.hint`,
      scope: 'world',
      config: false,
      default: {},
    },
    itemProperties: {
      name: `${CONSTANTS.MODULE_NAME}.setting.itemProperties.name`,
      hint: `${CONSTANTS.MODULE_NAME}.setting.itemProperties.hint`,
      scope: 'world',
      config: false,
      default: {},
    },
  };
}

function otherSettings(apply = false) {
  return {
    debug: {
      name: `${CONSTANTS.MODULE_NAME}.setting.debug.name`,
      hint: `${CONSTANTS.MODULE_NAME}.setting.debug.hint`,
      scope: 'client',
      config: true,
      default: false,
      type: Boolean,
    },

    debugHooks: {
      name: `${CONSTANTS.MODULE_NAME}.setting.debugHooks.name`,
      hint: `${CONSTANTS.MODULE_NAME}.setting.debugHooks.hint`,
      scope: 'world',
      config: false,
      default: false,
      type: Boolean,
    },

    systemFound: {
      name: `${CONSTANTS.MODULE_NAME}.setting.systemFound.name`,
      hint: `${CONSTANTS.MODULE_NAME}.setting.systemFound.hint`,
      scope: 'world',
      config: false,
      default: false,
      type: Boolean,
    },

    systemNotFoundWarningShown: {
      name: `${CONSTANTS.MODULE_NAME}.setting.systemNotFoundWarningShown.name`,
      hint: `${CONSTANTS.MODULE_NAME}.setting.systemNotFoundWarningShown.hint`,
      scope: 'world',
      config: false,
      default: false,
      type: Boolean,
    },

    preconfiguredSystem: {
      name: `${CONSTANTS.MODULE_NAME}.setting.preconfiguredSystem.name`,
      hint: `${CONSTANTS.MODULE_NAME}.setting.preconfiguredSystem.hint`,
      scope: 'world',
      config: false,
      default: false,
      type: Boolean,
    },
  };
}

export async function checkSystem() {
  if (!SYSTEMS.DATA) {
    if (game.settings.get(CONSTANTS.MODULE_NAME, 'systemNotFoundWarningShown')) return;

    await game.settings.set(CONSTANTS.MODULE_NAME, 'systemNotFoundWarningShown', true);

    return Dialog.prompt({
      title: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.nosystemfound.title`),
      content: dialogWarning(game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.nosystemfound.content`)),
      callback: () => {},
    });
  }

  if (game.settings.get(CONSTANTS.MODULE_NAME, 'systemFound')) return;

  game.settings.set(CONSTANTS.MODULE_NAME, 'systemFound', true);

  if (game.settings.get(CONSTANTS.MODULE_NAME, 'systemNotFoundWarningShown')) {
    return new Dialog({
      title: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.systemfound.title`),
      content: warn(game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.systemfound.content`), true),
      buttons: {
        confirm: {
          icon: '<i class="fas fa-check"></i>',
          label: game.i18n.localize(`${CONSTANTS.MODULE_NAME}.dialogs.systemfound.confirm`),
          callback: () => {
            applyDefaultSettings();
          },
        },
        cancel: {
          icon: '<i class="fas fa-times"></i>',
          label: game.i18n.localize('No'),
        },
      },
      default: 'cancel',
    }).render(true);
  }

  return applyDefaultSettings();
}

// /**
//  * Registers settings menu (button)
//  */
// function registerSettingMenus() {
//   game.settings.registerMenu(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME, 'defaultIcons', {
//     name: `${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}.Settings.defaultIcons.name`,
//     label: `${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}.Settings.defaultIcons.label`,
//     hint: `${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}.Settings.defaultIcons.hint`,
//     icon: 'fas fa-image',
//     type: DefaultIcons,
//     restricted: true,
//   });

//   game.settings.registerMenu(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME, 'itemProperties', {
//     name: `${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}.Settings.itemProperties.name`,
//     label: `${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}.Settings.itemProperties.label`,
//     hint: `${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}.Settings.itemProperties.hint`,
//     icon: 'fas fa-cogs',
//     type: ItemProperties,
//     restricted: true,
//   });

//   game.settings.register(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME, 'removeLabelButtonsSheetHeader', {
//     name: i18n(`${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}.Setting.removeLabelButtonsSheetHeader.name`),
//     hint: i18n(`${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}.Setting.removeLabelButtonsSheetHeader.hint`),
//     scope: 'world',
//     config: true,
//     type: Boolean,
//     default: true,
//   });
// }

/**
 * Checks if options exist, if not, orders their initialization
 */
export function checkSettingsInitialized() {
  if (!game.user?.isGM) {
    return;
  }
  const defaultIcons = game.settings.get(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME, 'defaultIcons');
  const itemProperties = game.settings.get(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME, 'itemProperties');

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
  console.log(JSON.stringify(icons));
  Hooks.call(`${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}:onInitializeDefaultIcons`, icons);
  settings = mergeObject(settings, icons);
  di.saveSettings(settings);
  log(` Initialized default item icons.`);
  ui.notifications?.info(
    game.i18n.localize(`${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}.Notifications.defaultIconsInitialized`),
    { permanent: true },
  );
}

/**
 * One-time settings initialization function
 *
 * @hook "forien-unidentified-items:onInitializeItemProperties"
 */
function initializeItemProperties() {
  const ip = new ItemProperties({}, {});
  let settings: any = ip.getSettings();
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
  Hooks.call(`${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}:onInitializeItemProperties`, properties);
  console.log(JSON.stringify(properties));
  settings = mergeObject(settings, properties);
  ip.saveSettings(settings);
  log(` Initialized default item properties.`);
  ui.notifications?.info(i18n(`${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}.defaultPropertiesInitialized`), {
    permanent: true,
  });
}

// /**
//  * Function responsible for out-of-the-box integration with systems.
//  *
//  * Function must return object of key-value entries:
//  *   - key   - item type
//  *   - value - objects of of key-value pairs of flattened
//  *             data names and boolean values
//  *
//  * Example of "defaults" object:
//  *   {
//  *     weapon: {
//  *       "description": true,
//  *       "attack.damage": true
//  *     },
//  *     armor: {
//  *       "weight": true
//  *     }
//  *   }
//  *
//  * @param settings
//  * @returns {Object}
//  */
// function setDefaultItemProperties(settings) {
//   let defaults;
//   switch (game.system.id) {
//     case 'dnd5e':
//       defaults = defaultPropertiesDND5e;
//       break;
//     case 'wfrp4e':
//       defaults = defaultPropertiesWFRP4e;
//       break;
//     case 'pf2e':
//       defaults = defaultPropertiesPF2e;
//       break;
//     case 'swade':
//       defaults = defaultPropertiesSwade;
//       break;
//     default:
//   }

//   if (defaults) {
//     log(` Loaded Default Properties from ${game.system.id} built-in integration.`);
//   }
//   return mergeObject(settings, defaults);
// }
