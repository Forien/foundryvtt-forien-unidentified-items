import VersionCheck from "./versioning/version-check.mjs";
import renderWelcomeScreen from "./versioning/welcome-screen.mjs";
import constants from "./constants.mjs";
import registerDerivedItemSheetClass from "./Item.js";
import registerContextMenuHook from "./ContextMenu.mjs";
import registerSettings from "./settings.js";

Hooks.once('init', () => {
  registerSettings();
  
  registerContextMenuHook();

  Hooks.callAll("ForienUnidentifiedItems.afterInit");
});

Hooks.once('setup', () => {

  Hooks.callAll("ForienUnidentifiedItems.afterSetup");
});

Hooks.once("ready", () => {
  if (VersionCheck.check(constants.moduleName)) {
    if (game.user.isGM || game.settings.get(constants.moduleName, 'playersWelcomeScreen')) {
      renderWelcomeScreen();
    }
  }

  registerDerivedItemSheetClass();

  Hooks.callAll("ForienUnidentifiedItems.afterReady");
});


