import API from "./api.mjs";
import { MystifiedFlags } from "./ForienUnidentifiedItemsModels.mjs";

export default function registerItemClassMethod() {
  //@ts-ignore
  CONFIG.Item.documentClass.prototype.isMystified = function isMystified() {
    return API.isMystified(this);
  };

  Object.defineProperty(CONFIG.Item.documentClass.prototype, MystifiedFlags.ORIG_DATA, {
    get: function origData() {
      return API.getOrigData(this);
    }
  });
}
