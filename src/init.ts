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
import CONSTANTS from './modules/constants';
import API from './modules/api';

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

  setApi(API);
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

// Add any additional hooks if necessary

export interface ForienUnidentifiedItemModuleData {
  api: typeof API;
  socket: any;
}

/**
 * Initialization helper, to set API.
 * @param api to set to game module.
 */
export function setApi(api: typeof API): void {
  const data = game.modules.get(CONSTANTS.MODULE_NAME) as unknown as ForienUnidentifiedItemModuleData;
  data.api = api;
}

/**
 * Returns the set API.
 * @returns Api from games module.
 */
export function getApi(): typeof API {
  const data = game.modules.get(CONSTANTS.MODULE_NAME) as unknown as ForienUnidentifiedItemModuleData;
  return data.api;
}

/**
 * Initialization helper, to set Socket.
 * @param socket to set to game module.
 */
export function setSocket(socket: any): void {
  const data = game.modules.get(CONSTANTS.MODULE_NAME) as unknown as ForienUnidentifiedItemModuleData;
  data.socket = socket;
}

/*
 * Returns the set socket.
 * @returns Socket from games module.
 */
export function getSocket() {
  const data = game.modules.get(CONSTANTS.MODULE_NAME) as unknown as ForienUnidentifiedItemModuleData;
  return data.socket;
}

Hooks.once('libChangelogsReady', function () {
  //@ts-ignore
  libChangelogs.register(
    CONSTANTS.MODULE_NAME,
    `
    - Update typescript to 9
    - Abbandoned support for 0.8.9
    - Apply new design pattern to the project
  `,
    'minor',
  );
});
