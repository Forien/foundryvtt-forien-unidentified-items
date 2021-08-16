import Identification from "./Identification.js";
export default function registerItemClassMethod() {
    //@ts-ignore
    CONFIG.Item.documentClass.prototype.isMystified = function isMystified() {
        return Identification.isMystified(this);
    };
    Object.defineProperty(CONFIG.Item.documentClass.prototype, "origData", {
        get: function origData() {
            return Identification.getOrigData(this);
        }
    });
}
