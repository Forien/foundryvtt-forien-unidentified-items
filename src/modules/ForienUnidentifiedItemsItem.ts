import { MystifiedFlags } from "./ForienUnidentifiedItemsModels";
import Identification from "./ForienUnidentifiedItemsIdentification";

export default function registerItemClassMethod() {
	//@ts-ignore
	CONFIG.Item.documentClass.prototype.isMystified = function isMystified() {
		return Identification.isMystified(this);
	};

	Object.defineProperty(CONFIG.Item.documentClass.prototype, MystifiedFlags.ORIG_DATA, {
		get: function origData() {
			return Identification.getOrigData(this);
		}
	});
}
