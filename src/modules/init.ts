import constants from "./constants";
import registerDerivedItemSheetClass from "./ItemSheet";
import registerContextMenuHook from "./ContextMenu";
import registerSettings, {checkSettingsInitialized} from "./settings";
import Identification from "./Identification";
import registerItemClassMethod from "./Item";

Hooks.once('init', () => {
  registerSettings();

  registerContextMenuHook();

  Hooks.callAll(`${constants.moduleName}:afterInit`);
});

Hooks.once('setup', () => {
  //@ts-ignore
  window.ForienIdentification = Identification;

  Hooks.callAll(`${constants.moduleName}:afterSetup`);
});

Hooks.once("ready", () => {
  checkSettingsInitialized();
  registerDerivedItemSheetClass();
  registerItemClassMethod();

  Hooks.callAll(`${constants.moduleName}:afterReady`);
});


