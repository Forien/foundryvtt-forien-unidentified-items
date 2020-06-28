import VersionCheck from "./versioning/version-check.mjs";
import renderWelcomeScreen from "./versioning/welcome-screen.mjs";
import constants from "./constants.mjs";
import Identification from "./Identification.js";

Hooks.once('init', () => {
  game.settings.register(constants.moduleName, "playersWelcomeScreen", {
    name: "ForienUnidentifiedItems.Settings.playersWelcomeScreen.Enable",
    hint: "ForienUnidentifiedItems.Settings.playersWelcomeScreen.EnableHint",
    scope: "world",
    config: true,
    default: true,
    type: Boolean
  });

  Hooks.callAll("ForienUnidentifiedItems.afterInit");
});

Hooks.once('setup', () => {

  Hooks.callAll("ForienUnidentifiedItems.afterSetup");
});

Hooks.once("ready", () => {
  if (VersionCheck.check(constants.moduleName)) {
    if (game.user.isGM || game.settings.get(constants.moduleName, 'playersWelcomeScreen')) {
      renderWelcomeScreen();
    }
  }

  for (let k in CONFIG.Item.sheetClasses) {
    for (let l in CONFIG.Item.sheetClasses[k]) {
      const ParentClass = CONFIG.Item.sheetClasses[k][l].cls;

      const newClass = class extends ParentClass {
        /** @override */
        _getHeaderButtons() {
          const buttons = super._getHeaderButtons();
          const canIdentify = game.user.isGM;
          if (!canIdentify) return buttons;
          if (this.item.data.isAbstract) return buttons;

          let origData = this.item.getFlag(constants.moduleName, "origData");

          if (origData) {
            buttons.unshift({
              label: "ForienUnidentifiedItems.Identify",
              class: "identify-item",
              icon: "fas fa-search",
              onclick: ev => {
                Identification.identify(this.item);
              }
            });

            buttons.unshift({
              label: "ForienUnidentifiedItems.Peek",
              class: "peek-original-item",
              icon: "far fa-eye",
              onclick: ev => {
                origData.isAbstract = true;
                const entity = new CONFIG.Item.entityClass(origData, {editable: false});
                const sheet = entity.sheet;
                sheet.render(true);
              }
            });
          } else {
            buttons.unshift({
              label: "ForienUnidentifiedItems.Mystify",
              class: "mystify-item",
              icon: "far fa-eye-slash",
              onclick: ev => {
                Identification.mystify(this.item.uuid);
              }
            });
          }
          return buttons;
        }

        async _updateObject(...args) {
          if (this.item.data.isAbstract) return this;
          return super._updateObject(...args);
        }
      };

      let sheetName = l.split('.');
      sheetName = sheetName[1];

      // Because FireFox is stupid
      Object.defineProperty(newClass, 'name', {value: sheetName});
      CONFIG.Item.sheetClasses[k][l].cls = newClass;
    }
  }

  Hooks.callAll("ForienUnidentifiedItems.afterReady");
});


Hooks.on('getItemDirectoryEntryContext', (html, entryOptions) => {
  entryOptions.unshift({
    name: "ForienUnidentifiedItems.Mystify",
    icon: '<i class="far fa-eye-slash"></i>',
    condition: li => {
      if (!game.user.isGM) return false;

      const id = li[0].dataset.entityId;
      const item = game.items.get(id);
      const origData = item.getFlag(constants.moduleName, "origData");
      if (origData) return false;

      return true;
    },
    callback: li => {
      const id = li[0].dataset.entityId;
      Identification.mystify(`Item.${id}`);
    }
  });

  entryOptions.unshift({
    name: "ForienUnidentifiedItems.Identify",
    icon: '<i class="fas fa-search"></i>',
    condition: li => {
      if (!game.user.isGM) return false;

      const id = li[0].dataset.entityId;
      const item = game.items.get(id);
      const origData = item.getFlag(constants.moduleName, "origData");
      if (origData) return true;

      return false;
    },
    callback: li => {
      const id = li[0].dataset.entityId;
      const item = game.items.get(id);
      Identification.identify(item);
    }
  });

  entryOptions.unshift({
    name: "ForienUnidentifiedItems.Peek",
    icon: '<i class="far fa-eye"></i>',
    condition: li => {
      if (!game.user.isGM) return false;

      const id = li[0].dataset.entityId;
      const item = game.items.get(id);
      const origData = item.getFlag(constants.moduleName, "origData");
      if (origData) return true;

      return false;
    },
    callback: li => {
      const id = li[0].dataset.entityId;
      const item = game.items.get(id);
      const origData = item.getFlag(constants.moduleName, "origData");
      origData.isAbstract = true;
      const entity = new CONFIG.Item.entityClass(origData, {editable: false});
      const sheet = entity.sheet;
      sheet.render(true);
    }
  });
});