import * as HttpStatus from 'http-status-codes';

import Error from './Error';

/**
 * @class ConflictError
 * @extends {Error}
 */
class ConflictError extends Error {
  /**
   * Error message to be thrown.
   *
   * @type {string}
   * @memberof UnauthorizedError
   */
  message: string;

  /**
   * Creates an instance of ConflictError.
   *
   * @param {string} message
   * @memberof ForbiddenError
   */
  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);

    this.message = message;
  }
}

export default ConflictError;
