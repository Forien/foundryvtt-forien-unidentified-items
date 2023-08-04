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
import registerDerivedItemSheetClass from "./scripts/ForienUnidentifiedItemsItemSheet";
import registerContextMenuHook from "./scripts/ContextMenu";
import registerSettings, { checkSettingsInitialized } from "./scripts/settings";
import registerItemClassMethod from "./scripts/ForienUnidentifiedItemsItem";
import CONSTANTS from "./scripts/constants";
import API from "./scripts/api";

/* ------------------------------------ */
/* Initialize module					*/
/* ------------------------------------ */

Hooks.once("init", () => {
  registerSettings();

  registerContextMenuHook();

  Hooks.callAll(`${CONSTANTS.MODULE_NAME}:afterInit`);
});

/* ------------------------------------ */
/* Setup module							*/
/* ------------------------------------ */

Hooks.once("setup", () => {
  //@ts-ignore
  // window.ForienIdentification = Identification;

  Hooks.callAll(`${CONSTANTS.MODULE_NAME}:afterSetup`);

  setApi(API);
});

/* ------------------------------------ */
/* When ready							*/
/* ------------------------------------ */

Hooks.once("ready", () => {
  checkSettingsInitialized();
  registerDerivedItemSheetClass();
  registerItemClassMethod();

  Hooks.callAll(`${CONSTANTS.MODULE_NAME}:afterReady`);
});

// Add any additional hooks if necessary

export interface MysteryItemModuleData {
  api: typeof API;
  socket: any;
}

/**
 * Initialization helper, to set API.
 * @param api to set to game module.
 */
export function setApi(api: typeof API): void {
  const data = game.modules.get(CONSTANTS.MODULE_NAME) as unknown as MysteryItemModuleData;
  data.api = api;
}

/**
 * Returns the set API.
 * @returns Api from games module.
 */
export function getApi(): typeof API {
  const data = game.modules.get(CONSTANTS.MODULE_NAME) as unknown as MysteryItemModuleData;
  return data.api;
}

/**
 * Initialization helper, to set Socket.
 * @param socket to set to game module.
 */
export function setSocket(socket: any): void {
  const data = game.modules.get(CONSTANTS.MODULE_NAME) as unknown as MysteryItemModuleData;
  data.socket = socket;
}

/*
 * Returns the set socket.
 * @returns Socket from games module.
 */
export function getSocket() {
  const data = game.modules.get(CONSTANTS.MODULE_NAME) as unknown as MysteryItemModuleData;
  return data.socket;
}
