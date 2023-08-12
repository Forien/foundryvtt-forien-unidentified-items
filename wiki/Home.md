Welcome to the _**Forien's Unidentified Items**_ wiki!

For compatibility, requirements, supported systems and languages, consult the `README.md` file in [Module's repository](https://github.com/League-of-Foundry-Developers/foundryvtt-forien-unidentified-items)

# Principles
## 1. Completely System Agnostic

This module primary design principle is _"to work on any and every game system for Foundry VTT"_. And while allow limited configuration integrations to be built-into this module, I will not place _any_ system related logic into it. So no Skill Checks, rolls etc.

## 2. Extendable

That said, my second design principle is extendability. I designed this module to act as a framework, that can be used by both System and Module developers to expand it's functionalities with additional logic.

Want to perform Skill Checks to identify an item in DND5e? Make a module for that!

# Usage

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
