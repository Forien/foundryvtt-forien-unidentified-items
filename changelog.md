# Changelog

## v0.3.18

- Add colors to symbol link for more flavor
- Add settings to remove label on the header button by default for a better management of little monitor and mobile [Option to disable the buttons label](https://github.com/League-of-Foundry-Developers/foundryvtt-forien-unidentified-items/issues/14)
- Update typescript and foundryvtt-types
- Little bug fix fix
- Add myself to the authors ? not sure why i was removed when my pr it was accepted

## v0.3.1-v0.3.17

- Test and final deploy
## v0.3.0

- Initial patch 0.8.8
- Integration with eslint and prettier
- Integrated workflow github from mclemente fork
## v0.2.3

* Added Setting to keep original icon while mystifying
* Added way to use "Mystify As…" along with "Mystify (advanced)…"
* Removed old Welcome Screen
* Added prompt to install new Welcome Screen
* Tested and bumped compatible core version to 0.7.0

## v0.2.2

* Added support for identifying nested items.
* Added optional setting that allows for creating nested mystified items.
* Added optional setting that displays `[Mystified]` and `[Original]` tags in Item Sheet's header.
* Added API calls for `isMystified`, `isUuidMystified` and `getOrigData`
* Added `isMystified()` and `origData` fields in Item class. 

## v0.2.1

* Added default settings for persisting item properties for Swade system thanks to SalieriC

## v0.2.0

* Added 9 more icons and 10 inverted variants
* Added "Replace with Mystified" context option. For Owned Items this is default behaviour.
* Added "Mystify As…" context option allowing for mimicing other item
* Added "Mystify (advanced)…" context option allowing for per-use configuration on kept properties
* Added Module Configuration allowing system-agnostic way of selecting default icon per item type
* Added Module Configuration allowing system-agnostic way of define which item properties should persist on mystification
* Added function that arbitrary assigns default icons on first module launch
* Added default settings initialization based on system and added built-in integration for dnd5e and wfrp4e
* Added built-in persisting item properties integration for pf2e thanks to freyrrabbit
* Added Hooks for initializing default settings
* Updated Portuguese (Brazil) translation thanks to Innocenti
* Updated Korean translation thanks to KLO

## v0.1.5

* Added Korean language thanks to KLO
* Added Portuguese (Brazil) language thanks to rinnocenti
* Fixed bug that wouldn't allow to mystify items inside Actor's inventory and Compendium
  * This is not "replace with mystified" option. this will come in future update. 


## v0.1.4

* Added await to async functions to remove bug with VTTA Iconizer

## v0.1.3

* Attempt to fix broken render Hook of extended class in FireFox 75+

## v0.1.2

* Initial release
