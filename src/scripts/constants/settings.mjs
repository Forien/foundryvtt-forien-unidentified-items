import { SYSTEMS } from "../systems.mjs";
import { applySystemSpecificStyles } from "../settings.mjs";
import CONSTANTS from "./constants.mjs";
import ItemProperties from "../apps/ItemProperties.mjs";
import DefaultIcons from "../apps/DefaultIcons.mjs";

const SETTINGS = {
  // Client settings

  // Module Settings
  DEFAULT_ICONS: "defaultIcons",
  // Style settings

  // System Settings
  DEFAULT_PROPERTIES: "itemProperties",

  // Hidden settings
  SYSTEM_FOUND: "systemFound",
  SYSTEM_NOT_FOUND_WARNING_SHOWN: "systemNotFoundWarningShown",
  SYSTEM_VERSION: "systemVersion",

  GET_DEFAULT() {
    return foundry.utils.deepClone(SETTINGS.DEFAULTS());
  },

  GET_SYSTEM_DEFAULTS() {
    return Object.fromEntries(
      Object.entries(SETTINGS.GET_DEFAULT()).filter((entry) => {
        return entry[1].system;
      })
    );
  },

  DEFAULTS: () => ({
    [SETTINGS.DEFAULT_ICONS]: {
      name: `${CONSTANTS.MODULE_NAME}.Settings.defaultIcons.name`,
      hint: `${CONSTANTS.MODULE_NAME}.Settings.defaultIcons.hint`,
      scope: "world",
      config: false,
      system: true,
      type: DefaultIcons,
      default: {},
    },
    [SETTINGS.DEFAULT_PROPERTIES]: {
      name: `${CONSTANTS.MODULE_NAME}.Settings.itemProperties.name`,
      hint: `${CONSTANTS.MODULE_NAME}.Settings.itemProperties.hint`,
      scope: "world",
      config: false,
      system: true,
      type: ItemProperties,
      default: SYSTEMS.DATA.DEFAULT_PROPERTIES,
    },
  }),
};

export default SETTINGS;
