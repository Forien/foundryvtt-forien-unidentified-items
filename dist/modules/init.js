import constants from "./constants.js";
import registerDerivedItemSheetClass from "./ItemSheet.js";
import registerContextMenuHook from "./ContextMenu.js";
import registerSettings, { checkSettingsInitialized } from "./settings.js";
import Identification from "./Identification.js";
import registerItemClassMethod from "./Item.js";
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
