import Identification from "./Identification";

export default function registerItemClassMethod() {
  CONFIG.Item.entityClass.prototype.isMystified = function isMystified() {
    return Identification.isMystified(this);
  };

  Object.defineProperty(CONFIG.Item.entityClass.prototype, "origData", {
    get: function origData() {
      return Identification.getOrigData(this)
    }
  });
}
