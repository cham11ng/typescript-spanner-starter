import { v4 } from 'uuid';

/**
 * Generate random alphanumeric string.
 *
 * @returns {string}
 */
export function generate(): string {
  return v4();
}

/**
 * Generate random alphanumeric string without '-' symbol.
 *
 * @returns {string}
 */
export function generateToken(): string {
  const token = `${v4()}${v4()}`;

  return token.replace(/-/g, '');
}
