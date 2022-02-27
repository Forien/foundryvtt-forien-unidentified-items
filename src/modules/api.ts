import CONSTANTS from './constants';
import { canvas, game } from './settings';
import DefaultIcons from './apps/DefaultIcons';

const API = {
  // effectInterface: EffectInterface,

  get DEFAULT_PROPERTIES(): any {
    return game.settings.get(CONSTANTS.MODULE_NAME, 'itemProperties');
  },

  /**
   * The attributes used to track dynamic attributes in this system
   *
   * @returns {array}
   */
  get DEFAULT_ICONS(): DefaultIcons {
    return <DefaultIcons>game.settings.get(CONSTANTS.MODULE_NAME, 'defaultIcons');
  },
};

export default API;
