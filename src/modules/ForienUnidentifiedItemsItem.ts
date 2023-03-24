import API from "./api";
import { MystifiedFlags } from "./ForienUnidentifiedItemsModels";

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
