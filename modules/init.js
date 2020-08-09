import constants from "./constants.mjs";
import registerDerivedItemSheetClass from "./ItemSheet.js";
import registerContextMenuHook from "./ContextMenu.mjs";
import registerSettings, {checkSettingsInitialized} from "./settings.js";
import Identification from "./Identification.js";
import registerItemClassMethod from "./Item.js";

Hooks.once('init', () => {
  registerSettings();
  
  registerContextMenuHook();

  Hooks.callAll(`${constants.moduleName}:afterInit`);
});

Hooks.once('setup', () => {
  window.ForienIdentification = Identification;

  Hooks.callAll(`${constants.moduleName}:afterSetup`);
});

Hooks.once("ready", () => {
  checkSettingsInitialized();
  registerDerivedItemSheetClass();
  registerItemClassMethod();

  Hooks.callAll(`${constants.moduleName}:afterReady`);
});


