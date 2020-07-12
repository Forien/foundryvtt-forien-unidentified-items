import VersionCheck from "./versioning/version-check.mjs";
import renderWelcomeScreen from "./versioning/welcome-screen.mjs";
import constants from "./constants.mjs";
import registerDerivedItemSheetClass from "./Item.js";
import registerContextMenuHook from "./ContextMenu.mjs";
import registerSettings, {checkSettingsInitialized} from "./settings.js";
import Identification from "./Identification.js";

Hooks.once('init', () => {
  registerSettings();
  
  registerContextMenuHook();

  Hooks.callAll("ForienUnidentifiedItems.afterInit");
});

Hooks.once('setup', () => {
  window.ForienIdentification = Identification;

  Hooks.callAll("ForienUnidentifiedItems.afterSetup");
});

Hooks.once("ready", () => {
  if (VersionCheck.check(constants.moduleName)) {
    if (game.user.isGM || game.settings.get(constants.moduleName, 'playersWelcomeScreen')) {
      renderWelcomeScreen();
    }
  }

  checkSettingsInitialized();
  registerDerivedItemSheetClass();

  Hooks.callAll("ForienUnidentifiedItems.afterReady");
});


