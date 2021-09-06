# FoundryVTT - Forien's Unidentified Items

![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/League-of-Foundry-Developers/foundryvtt-forien-unidentified-items?style=for-the-badge) 
![GitHub Releases](https://img.shields.io/github/downloads/League-of-Foundry-Developers/foundryvtt-forien-unidentified-items/latest/total?style=for-the-badge) 
![GitHub All Releases](https://img.shields.io/github/downloads/League-of-Foundry-Developers/foundryvtt-forien-unidentified-items/total?style=for-the-badge&label=Downloads+total)  
**[Compatibility]**: *FoundryVTT* 0.6.0+  
**[Systems]**: *any*  
**[Languages]**: *English, Korean, Polish, Portuguese (Brazil), Japanese (Thanks Touge!)*

This module aims to provides system agnostic solution to handle unidentified items and their identification for games via Foundry Virtual Tabletop.

## NOTE: If you are a javascript developer and not a typescript developer, you can just use the javascript files under the dist folder
# Installation

It's always easiest to install modules from the in game add-on browser.

To install this module manually:
1.  Inside the Foundry "Configuration and Setup" screen, click "Add-on Modules"
2.  Click "Install Module"
3.  In the "Manifest URL" field, paste the following url:
`https://raw.githubusercontent.com/League-of-Foundry-Developers/foundryvtt-forien-unidentified-items/master/module.json`
4.  Click 'Install' and wait for installation to complete
5.  Don't forget to enable the module in game using the "Manage Module" button

# Usage


Right click on items in sidebar, or use buttons on Item Sheet's header to Mystify an item. It will create new apparently blank item.

Mystified item can be fully edited and works just as a normal item in that system. However, GM can at any point peek at what the original item is (currently it's not possible to edit original data).

GM can also click on "Identify" button, which transforms entire Item into original, using embedded data.  
Data used during identification is decided upon at the time of mystification.

## 1. Context Menu Options

Right click on any entry in Item Directory (either Sidebar or Popup) to bring Context Menu for Items.

![](https://i.gyazo.com/3e764e0c4fb0a54035854e7b35e333d5.png) ![](https://i.gyazo.com/9a8e32db257136af9fa728c57e05201b.png)  

### Mystify

Will duplicate the Item, with duplicate being [mystified](#mystified-item).

### Replace with Mystified

Exactly as **Mystify**, but will replace [Original Item](#original-item), instead of duplicating it.

### Mystify As…

This option will create new Dialog Popup:

![](https://i.gyazo.com/1c440fd3a3d4867d3c96fcd3bd2cb585.png)

Drag & Drop an item which will become new "face" of [Original Item](#original-item). This basically allows to use some other item as template for [Mystified](#mystified-item) item, instead of using Default properties

#### Mystify 
This option works like "Mystify" context menu option
#### Replace
This option works like "Replace with Mystified" context menu option

### Mystify (advanced)…

This option will open a Dialog Popup:

![](https://i.gyazo.com/ee294dbe6fb2eeefe25c51ac9825b58f.png)

This popup allows you to choose which properties of Original Item should be kept (checkboxes checked) and which should be set as default (unchecked)

#### Buttons work like buttons in `Mystify As…` Dialog

### Peek 

Opens sheet for [Original Item](#original-item) allowing to "Peek" what the item really is, without identifying it. 

### Identify

Replaces [Mystified Item](#mystified-item) with [Original Item](#original-item).


## 2. Item Sheet Header Buttons

![](https://i.gyazo.com/b9069300a3a388897f94d2a972df00de.png)

### Mystify

1. If it's `World Item` or `Compendium Item`, it works like "Mystify" Context Menu option
1. If it's `Owned Item` of an `Actor`, it works like "Replace with Mystified" Context Menu option

### Peek

Works exactly like "Peek" Context Menu option

### Identify

Works exactly like "Identify" Context Menu option


# Definitions

## Mystified Item

Mystified Item is normal item, that has all or most of it's properties reset to default ones (like when you create new Item), while saving Original Data of Source Item deep inside Item's flags. Original Data is normally inaccessible and item for the purpose of Foundry VTT and game system acts just as it would without Original Data.

## Original Item

Item that went through, or is about to go through "mystification". All data of Original Item is serialized and hidden within Mystified Item.

## Screenshots 

<img src="https://i.gyazo.com/1c440fd3a3d4867d3c96fcd3bd2cb585.png" alt="Mystify As - Transmogrify" width=400/>
<img src="https://i.gyazo.com/ee294dbe6fb2eeefe25c51ac9825b58f.png" alt="Advanced mystification" width=400/><br/>
<img src="https://i.gyazo.com/f862aa34e373c4c7f1e47adfb27e5bf6.png" alt="Mystified Acid Vial" width=400/>
<img src="https://i.gyazo.com/9a8e32db257136af9fa728c57e05201b.png" alt="Context Menu" width=200/>
<img src="https://i.gyazo.com/c8d75fc3c6f205655f3eb14e59f661bb.png" alt="Context Menu" width=200/>

# API

This page is meant for **System** and **Module** developers that wish to integrate their systems & modules with **Unidentified Items**, although some information here might be useful for people wanting to write **Macros** as well.
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

# System Integration

|            	| dnd5e 	| pf2e 	| wfrp4e 	| swade 	|
|------------	|-------	|------	|--------	|--------	|
| Settings   	| ✓     	| ✓    	| ✓      	| ✓      	|
| Logic      	| ✗     	| ✗    	| ✗      	| ✗      	|

One of main principles of this module is being [**System Agnostic**](https://github.com/League-of-Foundry-Developers/foundryvtt-forien-unidentified-items/wiki#1-completely-system-agnostic). There is however, way of integrating systems.

Basic settings initialization (like setting default persisting properties for dnd5e) I will allow to be built-in this module. These can, however, be defined from the System's side.

#### What about logic? Skill Checks for Identification?

According to this module's Primary Principle, there will never be any system-specific logic in module. Feel free to integrate logic into your System or your Module, using API and Hooks

### How to integrate?

If you are **System** or **Module** developer, please read the [Developers Wiki](https://github.com/League-of-Foundry-Developers/foundryvtt-forien-unidentified-items/wiki/Developers) for API and Hooks references.

Also, do not hesitate to contact me with questions and for assistance. 

## Future plans

* _none currently_

You can **always** check current and up-to-date [planned and requested features here](https://github.com/League-of-Foundry-Developers/foundryvtt-forien-unidentified-items/issues?q=is%3Aopen+is%3Aissue+label%3Aenhancement)

*If you have **any** suggestion or idea on new contents, hit me up on Discord!*

# Build

## Install all packages

```bash
npm install
```
## npm build scripts
### build

will build the code and copy all necessary assets into the dist folder and make a symlink to install the result into your foundry data; create a
`foundryconfig.json` file with your Foundry Data path.

```json
{
  "dataPath": "~/.local/share/FoundryVTT/"
}
```

`build` will build and set up a symlink between `dist` and your `dataPath`.

```bash
npm run-script build
```

### NOTE:

You don't need to build the `foundryconfig.json` file you can just copy the content of the `dist` folder on the module folder under `modules` of Foundry

### build:watch

`build:watch` will build and watch for changes, rebuilding automatically.

```bash
npm run-script build:watch
```

### clean

`clean` will remove all contents in the dist folder (but keeps the link from build:install).

```bash
npm run-script clean
```
### lint and lintfix

`lint` launch the eslint process based on the configuration [here](./.eslintrc)

```bash
npm run-script lint
```

`lintfix` launch the eslint process with the fix argument

```bash
npm run-script lintfix
```

### prettier-format

`prettier-format` launch the prettier plugin based on the configuration [here](./.prettierrc)

```bash
npm run-script prettier-format
```

### package

`package` generates a zip file containing the contents of the dist folder generated previously with the `build` command. Useful for those who want to manually load the module or want to create their own release

```bash
npm run-script package
```

## [Changelog](./changelog.md)

## Issues

Any issues, bugs, or feature requests are always welcome to be reported directly to the [Issue Tracker](https://github.com/ShoyuVanilla/FoundryVTT-Chat-Portrait/issues ), or using the [Bug Reporter Module](https://foundryvtt.com/packages/bug-reporter/).

## License

This package is under an [MIT license](LICENSE) and the [Foundry Virtual Tabletop Limited License Agreement for module development](https://foundryvtt.com/article/license/).

## Acknowledgements

* Thanks to `Forien#2130` (discord contact)
* Bootstrapped with League of Extraordinary FoundryVTT Developers  [foundry-vtt-types](https://github.com/League-of-Foundry-Developers/foundry-vtt-types).
* Icons were created by transforming assets made by Lorc and Willdabeast from [game-icons.net](https://game-icons.net/)
* Thanks to unsoluble for the idea for this Module!
* Thanks to KLO for providing Korean translation
* Thanks to rinnocenti for providing Portuguese (Brazil) translation
* Thanks to freyrrabbit for help with defining default properties for PF2e system
* Thanks to SalieriC for help with defining default properties for Swade system
