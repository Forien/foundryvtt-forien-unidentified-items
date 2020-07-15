import VersionCheck from "./versioning/version-check.mjs";
import renderWelcomeScreen from "./versioning/welcome-screen.mjs";
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
  if (VersionCheck.check(constants.moduleName)) {
    if (game.user.isGM || game.settings.get(constants.moduleName, 'playersWelcomeScreen')) {
      renderWelcomeScreen();
    }
  }

  checkSettingsInitialized();
  registerDerivedItemSheetClass();
  registerItemClassMethod();

  Hooks.callAll(`${constants.moduleName}:afterReady`);
});


