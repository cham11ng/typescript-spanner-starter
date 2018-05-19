import * as HttpStatus from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';

import config from '../config/config';
import * as userService from '../services/userService';

const { messages } = config;

/**
 * Controller to handle /users GET request.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export async function index(req: Request, res: Response, next: NextFunction) {
  try {
    const response = await userService.fetchAll();

    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data: response,
      message: messages.users.fetchAll
    });
  } catch (err) {
    next(err);
  }
}
