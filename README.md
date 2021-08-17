# FoundryVTT - Forien's Unidentified Items [MAINTANCE MODE]

![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/forien/foundryvtt-forien-unidentified-items?style=for-the-badge) 
![GitHub Releases](https://img.shields.io/github/downloads/Forien/foundryvtt-forien-unidentified-items/latest/total?style=for-the-badge) 
![GitHub All Releases](https://img.shields.io/github/downloads/Forien/foundryvtt-forien-unidentified-items/total?style=for-the-badge&label=Downloads+total)  
**[Compatibility]**: *FoundryVTT* 0.6.0+  
**[Systems]**: *any*  
**[Languages]**: *English, Korean, Polish, Portuguese (Brazil), Japanese (Thanks Touge!)*

This module aims to provides system agnostic solution to handle unidentified items and their identification for games via Foundry Virtual Tabletop.

## NOTE: If you are a javascript developer and not a typescript developer, you can just use the javascript files under the dist folder or rename the file from .ts to .js

## Installation

It's always easiest to install modules from the in game add-on browser.

To install this module manually:
1.  Inside the Foundry "Configuration and Setup" screen, click "Add-on Modules"
2.  Click "Install Module"
3.  In the "Manifest URL" field, paste the following url:
`https://raw.githubusercontent.com/League-of-Foundry-Developers/foundryvtt-forien-unidentified-items/master/module.json`
4.  Click 'Install' and wait for installation to complete
5.  Don't forget to enable the module in game using the "Manage Module" button

### libWrapper

This module uses the [libWrapper](https://github.com/ruipin/fvtt-lib-wrapper) library for wrapping core methods. It is a hard dependency and it is recommended for the best experience and compatibility with other modules.

## Usage

**Please refer to Wiki for full information on [Usage](https://github.com/Forien/foundryvtt-forien-unidentified-items/wiki#usage)**  

Right click on items in sidebar, or use buttons on Item Sheet's header to Mystify an item. It will create new apparently blank item.

Mystified item can be fully edited and works just as a normal item in that system. However, GM can at any point peek at what the original item is (currently it's not possible to edit original data).

GM can also click on "Identify" button, which transforms entire Item into original, using embedded data.  
Data used during identification is decided upon at the time of mystification.

## Screenshots 

<img src="https://i.gyazo.com/1c440fd3a3d4867d3c96fcd3bd2cb585.png" alt="Mystify As - Transmogrify" width=400/><img src="https://i.gyazo.com/ee294dbe6fb2eeefe25c51ac9825b58f.png" alt="Advanced mystification" width=400/><br/><img src="https://i.gyazo.com/f862aa34e373c4c7f1e47adfb27e5bf6.png" alt="Mystified Acid Vial" width=400/><img src="https://i.gyazo.com/9a8e32db257136af9fa728c57e05201b.png" alt="Context Menu" width=200/><img src="https://i.gyazo.com/c8d75fc3c6f205655f3eb14e59f661bb.png" alt="Context Menu" width=200/>

## System Integration

|            	| dnd5e 	| pf2e 	| wfrp4e 	| swade 	|
|------------	|-------	|------	|--------	|--------	|
| Settings   	| ✓     	| ✓    	| ✓      	| ✓      	|
| Logic      	| ✗     	| ✗    	| ✗      	| ✗      	|

One of main principles of this module is being [**System Agnostic**](https://github.com/Forien/foundryvtt-forien-unidentified-items/wiki#1-completely-system-agnostic). There is however, way of integrating systems.

Basic settings initialization (like setting default persisting properties for dnd5e) I will allow to be built-in this module. These can, however, be defined from the System's side.

#### What about logic? Skill Checks for Identification?

According to this module's Primary Principle, there will never be any system-specific logic in module. Feel free to integrate logic into your System or your Module, using API and Hooks

### How to integrate?

If you are **System** or **Module** developer, please read the [Developers Wiki](https://github.com/Forien/foundryvtt-forien-unidentified-items/wiki/Developers) for API and Hooks references.

Also, do not hesitate to contact me with questions and for assistance. 

## Future plans

* _none currently_

You can **always** check current and up-to-date [planned and requested features here](https://github.com/Forien/foundryvtt-forien-unidentified-items/issues?q=is%3Aopen+is%3Aissue+label%3Aenhancement)

*If you have **any** suggestion or idea on new contents, hit me up on Discord!*

## Translations

If you are interested in translating my module, simply make a new Pull Request with your changes, or contact me on Discord.

## Contact

If you wish to contact me for any reason, reach me out on Discord using my tag: `Forien#2130`


## Acknowledgments

* Icons were created by transforming assets made by Lorc and Willdabeast from [game-icons.net](https://game-icons.net/)
* Thanks to unsoluble for the idea for this Module!
* Thanks to KLO for providing Korean translation
* Thanks to rinnocenti for providing Portuguese (Brazil) translation
* Thanks to freyrrabbit for help with defining default properties for PF2e system
* Thanks to SalieriC for help with defining default properties for Swade system

## Support

If you wish to support module development, please consider [becoming Patron](https://www.patreon.com/foundryworkshop) or donating [through Paypal](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=6P2RRX7HVEMV2&source=url). Thanks!

## License

Forien's Unidentified Items is a module for Foundry VTT by Forien and is licensed under a [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/).

This work is licensed under Foundry Virtual Tabletop [EULA - Limited License Agreement for module development from May 29, 2020](https://foundryvtt.com/article/license/).
