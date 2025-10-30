// re-export the crypto utilities as a named export `crypto`
// and also provide a default export for convenience.

import * as cryptoModule from './crypto.js';

// If you have other modules, import & export them here too:
// import * as other from './other.js';

export const crypto = cryptoModule;

// optional: group exports on default export too
export default {
  crypto,
  // other,
};
