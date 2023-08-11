import CONSTANTS from "../constants/constants.mjs";

export default {
  DEFAULT_PROPERTIES: {
    weapon: {
      "bulkCapacity.value": true,
      "quantity.value": true,
      "weaponType.value": true,
    },
    melee: {
      "bulkCapacity.value": true,
      "quantity.value": true,
    },
    armor: {
      "armorType.value": true,
      "bulkCapacity.value": true,
      "quantity.value": true,
    },
    equipment: {
      "bulkCapacity.value": true,
      "quantity.value": true,
    },
    consumable: {
      "bulkCapacity.value": true,
      "consumableType.value": true,
      "quantity.value": true,
      "uses.value": true,
    },
    treasure: {
      "bulkCapacity.value": true,
      "quantity.value": true,
    },
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
};
