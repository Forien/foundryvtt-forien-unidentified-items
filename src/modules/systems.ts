// ↓ IMPORT SYSTEMS HERE ↓
import dnd5e from "./systems/dnd5e";
import pf2e from "./systems/pf2e";
import swade from "./systems/swade";
import sw5e from "./systems/sw5e";
import wfrp4e from "./systems/wfrp4e";
import generic from "./systems/generic";

// ↑ IMPORT SYSTEMS HERE ↑

/**
 * NOTE: YOUR PULL REQUEST WILL NOT BE ACCEPTED IF YOU DO NOT
 * FOLLOW THE CONVENTION IN THE D&D 5E SYSTEM FILE
 */
export const SYSTEMS = {
	get DATA() {
		return {
			// ↓ ADD SYSTEMS HERE ↓
			dnd5e,
			pf2e,
			swade,
			sw5e,
			wfrp4e,
			generic
			// ↑ ADD SYSTEMS HERE ↑
		}?.[game.system.id];
	}
};
