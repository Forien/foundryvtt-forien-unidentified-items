import DefaultIcons from "./apps/DefaultIcons.mjs";
import ItemProperties from "./apps/ItemProperties.mjs";
import { defaultPropertiesDND5e } from "./integrations/dnd5e.mjs";
import { defaultPropertiesWFRP4e } from "./integrations/wfrp4e.mjs";
import { defaultPropertiesPF2e } from "./integrations/pf2e.mjs";
import { defaultPropertiesSwade } from "./integrations/swade.mjs";
import { i18n, log } from "../init.mjs";
export const FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME = 'forien-unidentified-items';
export const FORIEN_UNIDENTIFIED_ITEMS_DEFAULT_ICON = 'unidentified.png';
// export const FORIEN_UNIDENTIFIED_ITEMS_MODULE_LABEL = "Forien's Unidentified Items";
/**
 * Because typescript doesn't know when in the lifecycle of foundry your code runs, we have to assume that the
 * canvas is potentially not yet initialized, so it's typed as declare let canvas: Canvas | {ready: false}.
 * That's why you get errors when you try to access properties on canvas other than ready.
 * In order to get around that, you need to type guard canvas.
 * Also be aware that this will become even more important in 0.8.x because no canvas mode is being introduced there.
 * So you will need to deal with the fact that there might not be an initialized canvas at any point in time.
 * @returns
 */
export function getCanvas() {
    if (!(canvas instanceof Canvas) || !canvas.ready) {
        throw new Error('Canvas Is Not Initialized');
    }
    return canvas;
}
/**
 * Because typescript doesn't know when in the lifecycle of foundry your code runs, we have to assume that the
 * canvas is potentially not yet initialized, so it's typed as declare let canvas: Canvas | {ready: false}.
 * That's why you get errors when you try to access properties on canvas other than ready.
 * In order to get around that, you need to type guard canvas.
 * Also be aware that this will become even more important in 0.8.x because no canvas mode is being introduced there.
 * So you will need to deal with the fact that there might not be an initialized canvas at any point in time.
 * @returns
 */
export function getGame() {
    if (!(game instanceof Game)) {
        throw new Error('Game Is Not Initialized');
    }
    return game;
}
export default function registerSettings() {
    registerSettingMenus();
    getGame().settings.register(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME, 'defaultIcons', {
        scope: 'world',
        config: false,
        default: {},
    });
    getGame().settings.register(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME, 'itemProperties', {
        scope: 'world',
        config: false,
        default: {},
    });
    getGame().settings.register(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME, 'keepOldIcon', {
        name: FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME + '.Settings.keepOldIcon.name',
        hint: FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME + '.Settings.keepOldIcon.hint',
        scope: 'world',
        config: true,
        default: false,
        type: Boolean,
    });
    getGame().settings.register(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME, 'allowNestedItems', {
        name: FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME + '.Settings.allowNestedItems.Name',
        hint: FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME + '.Settings.allowNestedItems.Hint',
        scope: 'world',
        config: true,
        default: false,
        type: Boolean,
    });
}
/**
 * Registers settings menu (button)
 */
function registerSettingMenus() {
    getGame().settings.registerMenu(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME, 'defaultIcons', {
        name: FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME + '.Settings.defaultIcons.name',
        label: FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME + '.Settings.defaultIcons.label',
        hint: FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME + '.Settings.defaultIcons.hint',
        icon: 'fas fa-image',
        type: DefaultIcons,
        restricted: true,
    });
    getGame().settings.registerMenu(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME, 'itemProperties', {
        name: FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME + '.Settings.itemProperties.name',
        label: FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME + '.Settings.itemProperties.label',
        hint: FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME + '.Settings.itemProperties.hint',
        icon: 'fas fa-cogs',
        type: ItemProperties,
        restricted: true,
    });
}
/**
 * Checks if options exist, if not, orders their initialization
 */
export function checkSettingsInitialized() {
    if (!getGame().user?.isGM) {
        return;
    }
    const defaultIcons = getGame().settings.get(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME, 'defaultIcons');
    const itemProperties = getGame().settings.get(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME, 'itemProperties');
    if (checkObjEmpty(defaultIcons)) {
        initializeDefaultIcons();
    }
    if (checkObjEmpty(itemProperties)) {
        initializeItemProperties();
    }
}
function checkObjEmpty(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}
/**
 * One-time settings initialization function
 *
 * @hook "forien-unidentified-items:onInitializeDefaultIcons"
 */
function initializeDefaultIcons() {
    const di = new DefaultIcons({}, {});
    let settings = di.getSettings();
    const icons = duplicate(settings);
    console.log(JSON.stringify(icons));
    Hooks.call(`${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}:onInitializeDefaultIcons`, icons);
    settings = mergeObject(settings, icons);
    di.saveSettings(settings);
    log(` Initialized default item icons.`);
    ui.notifications?.info(getGame().i18n.localize(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME + '.Notifications.defaultIconsInitialized'), { permanent: true });
}
/**
 * One-time settings initialization function
 *
 * @hook "forien-unidentified-items:onInitializeItemProperties"
 */
function initializeItemProperties() {
    const ip = new ItemProperties({}, {});
    let settings = ip.getSettings();
    settings = Object.entries(settings);
    settings = settings.map((type) => {
        let entries = Object.entries(type[1]);
        entries = entries.sort((a, b) => {
            if (a[0] < b[0]) {
                return -1;
            }
            if (a[0] > b[0]) {
                return 1;
            }
            return 0;
        });
        type[1] = Object.fromEntries(entries);
        return type;
    });
    settings = Object.fromEntries(settings);
    settings = setDefaultItemProperties(settings);
    const properties = duplicate(settings);
    Hooks.call(`${FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME}:onInitializeItemProperties`, properties);
    console.log(JSON.stringify(properties));
    settings = mergeObject(settings, properties);
    ip.saveSettings(settings);
    log(` Initialized default item properties.`);
    ui.notifications?.info(i18n(FORIEN_UNIDENTIFIED_ITEMS_MODULE_NAME + '.defaultPropertiesInitialized'), {
        permanent: true,
    });
}
/**
 * Function responsible for out-of-the-box integration with systems.
 *
 * Function must return object of key-value entries:
 *   - key   - item type
 *   - value - objects of of key-value pairs of flattened
 *             data names and boolean values
 *
 * Example of "defaults" object:
 *   {
 *     weapon: {
 *       "description": true,
 *       "attack.damage": true
 *     },
 *     armor: {
 *       "weight": true
 *     }
 *   }
 *
 * @param settings
 * @returns {Object}
 */
function setDefaultItemProperties(settings) {
    let defaults;
    switch (getGame().system.id) {
        case 'dnd5e':
            defaults = defaultPropertiesDND5e;
            break;
        case 'wfrp4e':
            defaults = defaultPropertiesWFRP4e;
            break;
        case 'pf2e':
            defaults = defaultPropertiesPF2e;
            break;
        case 'swade':
            defaults = defaultPropertiesSwade;
            break;
        default:
    }
    if (defaults) {
        log(` Loaded Default Properties from ${getGame().system.id} built-in integration.`);
    }
    return mergeObject(settings, defaults);
}
