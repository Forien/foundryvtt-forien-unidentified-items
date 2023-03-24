import CONSTANTS from "../constants";

// =============================
// Module Generic function
// =============================

export function isGMConnected(): boolean {
	return Array.from(<Users>game.users).find((user) => user.isGM && user.active) ? true : false;
}

export function wait(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// export let debugEnabled = 0;
// 0 = none, warnings = 1, debug = 2, all = 3

export function debug(msg, args = "") {
	if (game.settings.get(CONSTANTS.MODULE_NAME, "debug")) {
		console.log(`DEBUG | ${CONSTANTS.MODULE_NAME} | ${msg}`, args);
	}
	return msg;
}

export function log(message) {
	message = `${CONSTANTS.MODULE_NAME} | ${message}`;
	console.log(message.replace("<br>", "\n"));
	return message;
}

export function notify(message) {
	message = `${CONSTANTS.MODULE_NAME} | ${message}`;
	ui.notifications?.notify(message);
	console.log(message.replace("<br>", "\n"));
	return message;
}

export function info(info, notify = false) {
	info = `${CONSTANTS.MODULE_NAME} | ${info}`;
	if (notify) ui.notifications?.info(info);
	console.log(info.replace("<br>", "\n"));
	return info;
}

export function warn(warning, notify = false) {
	warning = `${CONSTANTS.MODULE_NAME} | ${warning}`;
	if (notify) ui.notifications?.warn(warning);
	console.warn(warning.replace("<br>", "\n"));
	return warning;
}

export function error(error, notify = true) {
	error = `${CONSTANTS.MODULE_NAME} | ${error}`;
	if (notify) ui.notifications?.error(error);
	return new Error(error.replace("<br>", "\n"));
}

export function timelog(message): void {
	warn(Date.now(), message);
}

export const i18n = (key: string): string => {
	return game.i18n.localize(key)?.trim();
};

export const i18nFormat = (key: string, data = {}): string => {
	return game.i18n.format(key, data)?.trim();
};

// export const setDebugLevel = (debugText: string): void => {
//   debugEnabled = { none: 0, warn: 1, debug: 2, all: 3 }[debugText] || 0;
//   // 0 = none, warnings = 1, debug = 2, all = 3
//   if (debugEnabled >= 3) CONFIG.debug.hooks = true;
// };

export function dialogWarning(message, icon = "fas fa-exclamation-triangle") {
	return `<p class="${CONSTANTS.MODULE_NAME}-dialog">
        <i style="font-size:3rem;" class="${icon}"></i><br><br>
        <strong style="font-size:1.2rem;">${CONSTANTS.MODULE_NAME}</strong>
        <br><br>${message}
    </p>`;
}

// =========================================================================================

/**
 *
 * @param obj Little helper for loop enum element on typescript
 * @href https://www.petermorlion.com/iterating-a-typescript-enum/
 * @returns
 */
export function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
	return Object.keys(obj).filter((k) => Number.isNaN(+k)) as K[];
}

/**
 * @href https://stackoverflow.com/questions/7146217/merge-2-arrays-of-objects
 * @param target
 * @param source
 * @param prop
 */
export function mergeByProperty(target: any[], source: any[], prop: any) {
	source.forEach((sourceElement) => {
		const targetElement = target.find((targetElement) => {
			return sourceElement[prop] === targetElement[prop];
		});
		targetElement ? Object.assign(targetElement, sourceElement) : target.push(sourceElement);
	});
	return target;
}

/**
 * Returns the first selected token
 */
export function getFirstPlayerTokenSelected(): Token | null {
	// Get first token ownted by the player
	const selectedTokens = <Token[]>canvas.tokens?.controlled;
	if (selectedTokens.length > 1) {
		//iteractionFailNotification(i18n("foundryvtt-arms-reach.warningNoSelectMoreThanOneToken"));
		return null;
	}
	if (!selectedTokens || selectedTokens.length === 0) {
		//if(game.user.character.token){
		//  //@ts-ignore
		//  return game.user.character.token;
		//}else{
		return null;
		//}
	}
	return <Token>selectedTokens[0];
}

/**
 * Returns a list of selected (or owned, if no token is selected)
 * note: ex getSelectedOrOwnedToken
 */
export function getFirstPlayerToken(): Token | null {
	// Get controlled token
	let token: Token;
	const controlled: Token[] = <Token[]>canvas.tokens?.controlled;
	// Do nothing if multiple tokens are selected
	if (controlled.length && controlled.length > 1) {
		//iteractionFailNotification(i18n("foundryvtt-arms-reach.warningNoSelectMoreThanOneToken"));
		return null;
	}
	// If exactly one token is selected, take that
	token = <Token>controlled[0];
	if (!token) {
		if (!controlled.length || controlled.length === 0) {
			// If no token is selected use the token of the users character
			token = <Token>canvas.tokens?.placeables.find((token) => token.actor?.id === game.user?.character?.id);
		}
		// If no token is selected use the first owned token of the users character you found
		if (!token) {
			token = <Token>canvas.tokens?.ownedTokens[0];
		}
	}
	return token;
}

function getElevationToken(token: Token): number {
	const base = token.document;
	return getElevationPlaceableObject(base);
}

function getElevationWall(wall: Wall): number {
	const base = wall.document;
	return getElevationPlaceableObject(base);
}

function getElevationPlaceableObject(placeableObject: any): number {
	let base = placeableObject;
	if (base.document) {
		base = base.document;
	}
	const base_elevation =
		//@ts-ignore
		typeof _levels !== "undefined" &&
		//@ts-ignore
		_levels?.advancedLOS &&
		(placeableObject instanceof Token || placeableObject instanceof TokenDocument)
			? //@ts-ignore
			  _levels.getTokenLOSheight(placeableObject)
			: base.elevation ??
			  base.flags["levels"]?.elevation ??
			  base.flags["levels"]?.rangeBottom ??
			  base.flags["wallHeight"]?.wallHeightBottom ??
			  0;
	return base_elevation;
}

// =============================
// Module specific function
// =============================
