import type { ItemDataConstructorData } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData";

export class MystifiedData implements ItemDataConstructorData {
  img: string;
  name: string;
  type: string;
  data?: Object;
  isAbstract?: boolean;
}

export enum MystifiedFlags {
  ORIG_DATA = 'origData',
}
