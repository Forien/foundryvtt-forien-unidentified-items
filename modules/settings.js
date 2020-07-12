import constants from "./constants.mjs";
import DefaultIcons from "./apps/DefaultIcons.js";
import ItemProperties from "./apps/ItemProperties.js";
import {defaultPropertiesDND5e} from "./integrations/dnd5e.js";
import {defaultPropertiesWFRP4e} from "./integrations/wfrp4e.js";
import {defaultPropertiesPF2e} from "./integrations/pf2e.js";

export default function registerSettings() {
  registerSettingMenus();

  game.settings.register(constants.moduleName, "defaultIcons", {
    scope: "world",
    config: false,
    default: {}
  });

  game.settings.register(constants.moduleName, "itemProperties", {
    scope: "world",
    config: false,
    default: {}
  });

  game.settings.register(constants.moduleName, "playersWelcomeScreen", {
    name: "ForienUnidentifiedItems.Settings.playersWelcomeScreen.Enable",
    hint: "ForienUnidentifiedItems.Settings.playersWelcomeScreen.EnableHint",
    scope: "world",
    config: true,
    default: true,
    type: Boolean
  });
}

/**
 * Registers settings menu (button)
 */
function registerSettingMenus() {
  game.settings.registerMenu(constants.moduleName, "defaultIcons", {
    name: "ForienUnidentifiedItems.Settings.defaultIcons.name",
    label: "ForienUnidentifiedItems.Settings.defaultIcons.label",
    hint: "ForienUnidentifiedItems.Settings.defaultIcons.hint",
    icon: "fas fa-image",
    type: DefaultIcons,
    restricted: true
  });

  game.settings.registerMenu(constants.moduleName, "itemProperties", {
    name: "ForienUnidentifiedItems.Settings.itemProperties.name",
    label: "ForienUnidentifiedItems.Settings.itemProperties.label",
    hint: "ForienUnidentifiedItems.Settings.itemProperties.hint",
    icon: "fas fa-cogs",
    type: ItemProperties,
    restricted: true
  });
}


/**
 * Checks if options exist, if not, orders their initialization
 */
export function checkSettingsInitialized() {
  if (!game.user.isGM) return;

  let defaultIcons = game.settings.get(constants.moduleName, "defaultIcons");
  let itemProperties = game.settings.get(constants.moduleName, "itemProperties");

  if (checkObjEmpty(defaultIcons))
    initializeDefaultIcons();

  if (checkObjEmpty(itemProperties))
    initializeItemProperties();
}

function checkObjEmpty(obj) {
  return (Object.keys(obj).length === 0 && obj.constructor === Object);
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
  Hooks.call(`${constants.moduleName}:onInitializeDefaultIcons`, icons);
  settings = mergeObject(settings, icons);
  di.saveSettings(settings);
  console.log(`${constants.moduleLabel} | Initialized default item icons.`);
  ui.notifications.info(game.i18n.localize("ForienUnidentifiedItems.Notifications.defaultIconsInitialized"), {permanent: true});
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
  settings = settings.map(type => {
    let entries = Object.entries(type[1]);
    entries = entries.sort((a, b) => {
      if (a[0] < b[0]) return -1;
      if (a[0] > b[0]) return 1;
      return 0;
    });
    type[1] = Object.fromEntries(entries);
    return type;
  });
  settings = Object.fromEntries(settings);
  settings = setDefaultItemProperties(settings);
  const properties = duplicate(settings);
  Hooks.call(`${constants.moduleName}:onInitializeItemProperties`, properties);
  console.log(JSON.stringify(properties));
  settings = mergeObject(settings, properties);
  ip.saveSettings(settings);
  console.log(`${constants.moduleLabel} | Initialized default item properties.`);
  ui.notifications.info(game.i18n.localize("ForienUnidentifiedItems.Notifications.defaultPropertiesInitialized"), {permanent: true});
}


/**
 * Function responsible for out-of-the-box integration with systems.
 *
 * Function must return object of key-value entries:
 *   - key   - item type
 *   - value - objects of of key-value pairs of flattened
 *             data names and boolean values
 *
 * Example of "defaults" object:
 *   {
 *     weapon: {
 *       "description": true,
 *       "attack.damage": true
 *     },
 *     armor: {
 *       "weight": true
 *     }
 *   }
 *
 * @param settings
 * @returns {Object}
 */
function setDefaultItemProperties(settings) {
  let defaults;
  switch (game.system.id) {
    case 'dnd5e':
      defaults = defaultPropertiesDND5e;
      break;
    case 'wfrp4e':
      defaults = defaultPropertiesWFRP4e;
      break;
    case 'pf2e':
      defaults = defaultPropertiesPF2e;
      break;
    default:
  }

  if (defaults)
    console.log(`${constants.moduleLabel} | Loaded Default Properties from ${game.system.id} built-in integration.`);

  return mergeObject(settings, defaults);
}