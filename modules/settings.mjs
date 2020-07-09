import constants from "./constants.mjs";
import DefaultIcons from "./apps/DefaultIcons.mjs";

export default function registerSettings() {
  registerSettingMenus();

  game.settings.register(constants.moduleName, "defaultIcons", {
    scope: "world",
    config: false,
    default: {}
  });

  game.settings.register(constants.moduleName, "playersWelcomeScreen", {
    name: "ForienUnidentifiedItems.Settings.playersWelcomeScreen.Enable",
    hint: "ForienUnidentifiedItems.Settings.playersWelcomeScreen.EnableHint",
    scope: "world",
    config: true,
    default: true,
    type: Boolean
  });
}

function registerSettingMenus() {
  game.settings.registerMenu(constants.moduleName, "defaultIcons", {
    name: "ForienUnidentifiedItems.Settings.defaultIcons.name",
    label: "ForienUnidentifiedItems.Settings.defaultIcons.label",
    hint: "ForienUnidentifiedItems.Settings.defaultIcons.hint",
    icon: "fas fa-image",
    type: DefaultIcons,
    restricted: true
  });
}