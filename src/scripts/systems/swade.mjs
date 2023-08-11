import CONSTANTS from "../constants/constants.mjs";

export default {
  DEFAULT_PROPERTIES: {
    weapon: {
      quantity: true,
      weight: true,
      equippable: true,
      equipped: true,
      minStr: true,
    },
    armor: {
      quantity: true,
      weight: true,
      equippable: true,
      equipped: true,
      minStr: true,
      "locations.head": true,
      "locations.torso": true,
      "locations.arms": true,
      "locations.legs": true,
    },
    shield: {
      quantity: true,
      weight: true,
      equippable: true,
      equipped: true,
      minStr: true,
      cover: true,
    },
    gear: {
      quantity: true,
      weight: true,
      equippable: true,
      equipped: true,
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
