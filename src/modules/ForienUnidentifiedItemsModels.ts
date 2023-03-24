// import type { ItemDataConstructorData } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData";

export class MystifiedData {
	// implements ItemDataConstructorData {
	isAbstract?: boolean;
	_id?: string | null | undefined;
	name: string;
	type: string;
	img?: string | null | undefined;
	system?: any | null | undefined;
	effects?: any | null | undefined;
	folder?: any | null | undefined;
	sort?: number | null | undefined;
	permission?: any | null | undefined;
	flags?: any;
}

export enum MystifiedFlags {
	ORIG_DATA = "origData"
}
