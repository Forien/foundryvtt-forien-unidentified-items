import CONSTANTS from './constants';

const prefix =
  (str) =>
  (strs, ...exprs) =>
    `${str}-${strs.reduce((a, c, i) => a + exprs[i - 1] + c)}`;
const module = prefix(CONSTANTS.MODULE_NAME);

const HOOKS = {
  READY: module`ready`,
  ON_RENDER_TOKEN_CONFIG: module`onRenderTokenConfig`,
};

export default HOOKS;
