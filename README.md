# FoundryVTT - Forien's Unidentified Items
![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/forien/foundryvtt-forien-unidentified-items?style=for-the-badge) 
![GitHub Releases](https://img.shields.io/github/downloads/Forien/foundryvtt-forien-unidentified-items/latest/total?style=for-the-badge) 
![GitHub All Releases](https://img.shields.io/github/downloads/Forien/foundryvtt-forien-unidentified-items/total?style=for-the-badge&label=Downloads+total)  
**[Compatibility]**: *FoundryVTT* 0.6.0+  
**[Systems]**: *any*  
**[Languages]**: *English, Koreak, Polish, Portuguese (Brazil)*  

This module aims to provides system agnostic solution to handle unidentified items and their identification for games via Foundry Virtual Tabletop.

## Installation

1. Install Forien's Unidentified Items using manifest URL: https://raw.githubusercontent.com/Forien/foundryvtt-forien-unidentified-items/master/module.json
2. While loaded in World, enable **_Forien's Unidentified Items_** module.

## Usage
Right click on items in sidebar, or use buttons on Item Sheet's header to Mystify an item. It will create new apparently blank item.

Mystified item can be fully edited and works just as a normal item in that system. However, GM can at any point peek at what the original item is (currently it's not possible to edit original data).

GM can also click on "Identify" button, which transforms entire Item into original, using embedded data.  
Data used during identification is decided upon at the time of mystification.  


## Future plans (current ideas)

Plans for future include:
* Transmogrification – mystified item should copy all data of some plain item while still having data for original
  * "Mystify as…" option for context menu.
* Editing original data of mystified item
* Some system specific integrations for setting data as weight (dnd5e) or encumberance (wfrp4e) etc.

You can **always** check current and up-to-date [planned and requested features here](https://github.com/Forien/foundryvtt-forien-unidentified-items/issues?q=is%3Aopen+is%3Aissue+label%3Aenhancement)

*If you have **any** suggestion or idea on new contents, hit me up on Discord!*

## Translations

If you are interested in translating my module, simply make a new Pull Request with your changes, or contact me on Discord.

## Contact

If you wish to contact me for any reason, reach me out on Discord using my tag: `Forien#2130`


## Acknowledgments

* Thanks to unsoluble for the idea for this Module!
* Thanks to KLO for providing Korean translation
* Thanks to rinnocenti for providing Portuguese (Brazil) translation

## Support

If you wish to support me, please consider [becoming my Patreon](https://www.patreon.com/forien) or donating [through Paypal](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=6P2RRX7HVEMV2&source=url). Thanks!

## License

Forien's Unidentified Items is a module for Foundry VTT by Forien and is licensed under a [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/).

This work is licensed under Foundry Virtual Tabletop [EULA - Limited License Agreement for module development from May 29, 2020](https://foundryvtt.com/article/license/).
