import registerSettings, { checkSettingsInitialized } from './modules/settings';
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
import Identification from './modules/Identification';
import registerItemClassMethod from './modules/Item';
import { canvas, game } from './modules/settings';
import CONSTANTS from './modules/constants';

/* ------------------------------------ */
/* Initialize module					*/
/* ------------------------------------ */

Hooks.once('init', () => {
  registerSettings();

  registerContextMenuHook();

  Hooks.callAll(`${CONSTANTS.MODULE_NAME}:afterInit`);
});

/* ------------------------------------ */
/* Setup module							*/
/* ------------------------------------ */

Hooks.once('setup', () => {
  //@ts-ignore
  window.ForienIdentification = Identification;

  Hooks.callAll(`${CONSTANTS.MODULE_NAME}:afterSetup`);
});

/* ------------------------------------ */
/* When ready							*/
/* ------------------------------------ */

Hooks.once('ready', () => {
  checkSettingsInitialized();
  registerDerivedItemSheetClass();
  registerItemClassMethod();

  Hooks.callAll(`${CONSTANTS.MODULE_NAME}:afterReady`);
});
