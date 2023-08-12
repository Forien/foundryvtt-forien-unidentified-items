This page is meant for **System** and **Module** developers that wish to integrate their systems & modules with **Unidentified Items**, although some information here might be useful for people wanting to write **Macros** as well.

# API

## `ForienIdentification`

This is the only public class exposed by this module. 

### async `mystify(itemUuid, options = {replace: false, mystifiedData: undefined})`
* `itemUuid` – `string` – UUID of Original Item to be mystified
* `options` – `Object` – object of options
* `options.replace` – `boolean` – `true` means, Original Item should be replaced with Mystified one
* `options.mystifiedData` – `undefined | Object` – if defined, it acts as a basis for setting data of Mystified Item. Properties not defined will be set to system's default.  

This method handles the Mystification proccess. Fires the `forien-unidentified-items:onMystifyItem` Hook right before mystifying.

### async `mystifyReplace(itemUuid)`
* `itemUuid` – `string` – UUID of Original Item to be mystified

Alias for `mystify(itemUuid, {replace: true})`.

### async `mystifyAsDialog(itemUuid)`
* `itemUuid` – `string` – UUID of Original Item to be mystified

Opens "Mystify As…" Dialog. Callbacks for buttons fire the `mystify()` method with respective settings. 


### async `mystifyAdvancedDialog(itemUuid) `
* `itemUuid` – `string` – UUID of Original Item to be mystified

Opens "Mystify (advanced)…" Dialog. Callbacks for buttons fire the `mystify()` method with respective settings. 


### async `identify(item)`
* `item` – `Item` – instance of Item class to be identified

If item has `OrigData` flag, this method will replace Mystified Item with OrigData.  
Fires the `forien-unidentified-items:onIdentifyItem` hook. If Hook returns `false`, it will not proceed with full identification. 


### `isMystified(item)`
* `item` – `Item` – instance of Item class

Returns Boolean. `True` if item is mystified (has Original Data), `false` otherwise.


### async `isUuidMystified(itemUuid)`
* `itemUuid` – `string` – UUID of Original Item to be mystified

Returns Boolean. `True` if item is mystified (has Original Data), `false` otherwise.


### `getOrigData(item)`
* `item` – `Item` – instance of Item class

Returns Object of item's Original Data, or undefined if it isn't mystified.


## `Item`

This module expands the `prototype` of registered Item entity class.

### `item.isMystified()`
Returns `true` if item is Mystified (has Original Data), false otherwise

### getter `item.origData`
Returns Object of item's Original Data, or undefined if it isn't mystified.



# Hooks

## General Hooks

### Hooks.callAll `forien-unidentified-items:afterInit`
At this hook, context menu event listener and settings are already redistered 

### Hooks.callAll`forien-unidentified-items:afterSetup`
At this hook, the `ForienIdentification` API class is already available under global scope

### Hooks.callAll `forien-unidentified-items:afterReady`
At this hook, settings are initialized (if first launch) and derived Item classes are generated and replaced the original Item classes in `CONFIG.Item`

## Setting Initialization Hooks

***There Hooks fire only once per world, they are used to initialize default state of Settings. GMs will be able to freely change settings afterwards***

### Hooks.call `forien-unidentified-items:onInitializeDefaultIcons`
* `icons` – `Object` – a key-value pair object containing item types as keys and image paths as values

Example for dnd5e:
```json
{
  "weapon": "modules/forien-unidentified-items/icons/inv-unidentified.png",
  "equipment": "modules/forien-unidentified-items/icons/inv-unidentified-armor.png",
  "consumable": "modules/forien-unidentified-items/icons/inv-unidentified-potion.png",
  "tool": "modules/forien-unidentified-items/icons/inv-unidentified-tool.png",
  "loot": "modules/forien-unidentified-items/icons/inv-unidentified-loot.png",
  "class": "modules/forien-unidentified-items/icons/inv-unidentified-book.png",
  "spell": "modules/forien-unidentified-items/icons/inv-unidentified-scroll.png",
  "feat": "modules/forien-unidentified-items/icons/inv-unidentified-book.png",
  "backpack": "modules/forien-unidentified-items/icons/inv-unidentified-knapsack.png"
}
```
You can replace any path by for example: 
```js
Hooks.on('forien-unidentified-items:onInitializeDefaultIcons', (icons) => {
  icons.weapon = "path/to/icon.png";
});
```
_Important note:_ if you perform assignment on `icons`, you will remove it's reference and fail to override data.


### Hooks.call `forien-unidentified-items:onInitializeItemProperties`
* `properties` – `Object` – a key-value pair object containing item types as keys and key-pair object as value

Property Paths set to `true` mean they will by default be kept when mystifying items. 

Example for dnd5e:
```json
{
  "weapon": {
    "ability": false,
    "actionType": false,
    "description.chat": false,
    "description.unidentified": false,
    "quantity": true,
    "weight": true,
    "...": "..."
  },
  "equipment": {
    "armor.dex": false,
    "armor.type": true,
    "armor.value": false,
    "...": "..."
  },
  "...": "...",
  "backpack": {
    "...": "..."
  }
}
```
You can replace any path by for example: 
```js
Hooks.on('forien-unidentified-items:onInitializeItemProperties', (properties) => {
  properties.equipment = {
    "armor.value": true,
    "armor.dex": true
  };
});
```
Not defined paths will be kept (so in above example, `equipment.armor.type` will remain `true`)

_Important note:_ if you perform assignment on `icons`, you will remove it's reference and fail to override data.



## Identification & Mystification Hooks

### Hooks.call `forien-unidentified-items:onMystifyItem`
* `item` – `Item` – an Item Entity instance of [Original Item](https://github.com/Forien/foundryvtt-forien-unidentified-items/wiki#original-item)
* `origData` – `Object` – result of `duplicate(item)`, will be directly applied to `OrigData` flag and will represent Original Item data for purpose of Peek and Identify
* `mystifiedData` – `Object` – data object directly destined to become Mystified Object data. Properties not defined will be set to default (as in create new Item)
* `options` – `Object` – options as passed to [`mystify()` method](#mystifyitemuuid-options--replace-false-mystifieddata-undefined).

If you perform changes on above parameters and keep object references, you can decide entire Mystification process. 


### Hooks.call `forien-unidentified-items:onIdentifyItem`
* `item` – `Item` – an Item Entity instance of [Mystified Item](https://github.com/Forien/foundryvtt-forien-unidentified-items/wiki#mystified-item)
* `origData` – `Object` – directly taken from `OrigData` flag and represents Original Item data.

If you perform changes on above parameters and keep object references, you can influence Identification process. The `OrigData` flag is removed by default.

If your Hook returns `false`, the default Identification process will not happen. So you can perform partial identification. For example (in pseudo-code):
```js
Hooks.on('forien-unidentified-items:onIdentifyItem', (item, data) => {
  // perform skill check if identification can happen
  let testResult = SomeClass.rollIdentification(data);

  // If result was only partial:
  switch (testResult.result) {
    case 'partial':
      // update description with new information
      item.update({"data.description": testResult.newDescription});
    case 'failed':
      return false; //and stop default full identification
    default:
      return true;
  }
});
```

## Item Sheet Hooks

### Hooks.call `forien-unidentified-items:getItemPermissions`
* `item` – `Item` – an Item Entity instance of opened ItemSheet
* `permission` – `Object` – object containing permissions. All permission default to `game.user.isGM`

```js
let permissions = {
  canIdentify: game.user.isGM,
  canPeek: game.user.isGM,
  canMystify: game.user.isGM
}
```
#### `canIdentify`
If `true`, user can see and press `Identify` Header Button. 
#### `canPeek`
If `true`, user can see and press `Peek` Header Button to open Original Item sheet. 
#### `canMystify`
If `true`, user can see and press `Mystify` Header Button. 