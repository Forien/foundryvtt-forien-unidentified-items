import CONSTANTS from "../constants/constants.mjs";

export default {
  DEFAULT_PROPERTIES: {
    ammunition: {
      "encumbrance.value": true,
      "quantity.value": true,
      "gmdescription.value": true,
      "ammunitionType.value": true,
    },
    armour: {
      "encumbrance.value": true,
      "quantity.value": true,
      "gmdescription.value": true,
      "location.value": true,
      "armorType.value": true,
    },
    container: {
      "encumbrance.value": true,
      "quantity.value": true,
      "gmdescription.value": true,
    },
    money: {
      "encumbrance.value": true,
      "quantity.value": true,
      "gmdescription.value": true,
    },
    trapping: {
      "encumbrance.value": true,
      "quantity.value": true,
      "gmdescription.value": true,
      "trappingType.value": true,
    },
    weapon: {
      "encumbrance.value": true,
      "quantity.value": true,
      "gmdescription.value": true,
      "twohanded.value": true,
      "ammunitionGroup.value": true,
      "weaponGroup.value": true,
      "reach.value": true,
    },
    DEFAULT_ICONS: {
      weapon: `/modules/${CONSTANTS.MODULE_NAME}/icons/unidentified.png`,
      equipment: `/modules/${CONSTANTS.MODULE_NAME}/icons/unidentified-armor.png`,
      consumable: `/modules/${CONSTANTS.MODULE_NAME}/icons/unidentified-potion.png`,
      tool: `/modules/${CONSTANTS.MODULE_NAME}/icons/unidentified-tool.png`,
      loot: `/modules/${CONSTANTS.MODULE_NAME}/icons/inv-unidentified-loot.png`,
      background: `/modules/${CONSTANTS.MODULE_NAME}/icons/inv-unidentified.png`,
      class: `/modules/${CONSTANTS.MODULE_NAME}/icons/unidentified-book.png`,
      subclass: `/modules/${CONSTANTS.MODULE_NAME}/icons/inv-unidentified.png`,
      spell: `/modules/${CONSTANTS.MODULE_NAME}/icons/inv-unidentified-scroll.png`,
      feat: `/modules/${CONSTANTS.MODULE_NAME}/icons/unidentified-book.png`,
      backpack: `/modules/${CONSTANTS.MODULE_NAME}/icons/unidentified-knapsack.png`,
    },
  },
};
