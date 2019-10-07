/**
 * Check validation rule pattern from given string.
 *
 * @param {string} rule
 * @returns {boolean}
 */
export function checkRule(rule: string) {
  return new RegExp(/^[A-Za-z]+[:][A-Za-z]+(,[A-Za-z]+)?$/).test(rule);
}
