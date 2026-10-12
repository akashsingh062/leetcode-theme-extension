/* =============================================================================
   sounds.js — Sound disabled. Clean no-op stubs.
============================================================================= */
(function (root) {
  'use strict';

  root.LCTSSounds = {
    play: () => Promise.resolve(false),
    stop: () => {},
    warm: () => {},
    wake: () => {},
    prime: () => {},
    mayStart: () => false,
    handOff: () => false,
    renderInto: () => {},
    kinds: []
  };
})(globalThis);
