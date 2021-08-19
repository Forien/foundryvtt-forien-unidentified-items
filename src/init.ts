import registerSettings, { FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME } from './modules/settings';
/**
 * This is your TypeScript entry file for Foundry VTT.
 * Register custom settings, sheets, and constants using the Foundry API.
 * Change this heading to be more descriptive to your module, or remove it.
 * Author: [your name]
 * Content License: [copyright and-or license] If using an existing system
 * 					you may want to put a (link to a) license or copyright
 * 					notice here (e.g. the OGL).
 * Software License: [your license] Put your desired license here, which
 * 					 determines how others may use and modify your module
 */
// Import JavaScript modules

// Import TypeScript modules
import registerDerivedItemSheetClass from './modules/ItemSheet';
import registerContextMenuHook from './modules/ContextMenu';
import { checkSettingsInitialized, getGame } from './modules/settings';
import Identification from './modules/Identification';
import registerItemClassMethod from './modules/Item';

export let debugEnabled = 0;
// 0 = none, warnings = 1, debug = 2, all = 3
export let debug = (...args) => {if (debugEnabled > 1) console.log(`DEBUG:${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME} | `, ...args)};
export let log = function(...args){ console.log(`forien-unidentified-items | `, ...args) };
export let warn = (...args) => {if (debugEnabled > 0) console.warn(`${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME} | `, ...args)};
export let error = (...args) => console.error(`${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME} | `, ...args);
export let timelog = (...args) => warn(`${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME} | `, Date.now(), ...args);

export let i18n = key => {
  return getGame().i18n.localize(key);
};
export let i18nFormat = (key, data = {}) => {
  return getGame().i18n.format(key, data);
}

export let setDebugLevel = (debugText: string) => {
  debugEnabled = {'none': 0, 'warn': 1, 'debug': 2, 'all': 3}[debugText] || 0;
  // 0 = none, warnings = 1, debug = 2, all = 3
  if (debugEnabled >= 3) CONFIG.debug.hooks = true;
}

/* ------------------------------------ */
/* Initialize module					*/
/* ------------------------------------ */

Hooks.once('init', () => {
  registerSettings();

  registerContextMenuHook();

  Hooks.callAll(`${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}:afterInit`);
});

/* ------------------------------------ */
/* Setup module							*/
/* ------------------------------------ */

Hooks.once('setup', () => {
  //@ts-ignore
  window.ForienIdentification = Identification;

  Hooks.callAll(`${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}:afterSetup`);
});

/* ------------------------------------ */
/* When ready							*/
/* ------------------------------------ */

Hooks.once('ready', () => {
  checkSettingsInitialized();
  registerDerivedItemSheetClass();
  registerItemClassMethod();

  Hooks.callAll(`${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}:afterReady`);
});


