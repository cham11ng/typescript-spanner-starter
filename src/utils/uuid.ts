import { v4 } from 'uuid';

/**
 * Generate random alphanumeric string.
 *
 * @returns {string}
 */
export function generate(): string {
  return v4();
}
