// src/utils.js
export function nowUnix() {
  return Math.floor(Date.now() / 1000);
}

export function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}
