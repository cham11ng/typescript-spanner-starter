import * as HTTPStatus from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';

import lang from '../config/lang';
import * as passwordService from '../services/password';
import ResetPasswordPayload from '../domain/requests/ResetPasswordPayload';
import ForgotPasswordPayload from '../domain/requests/ForgotPasswordPayload';

const { messages } = lang;

/**
 * Handle /forgot request.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export async function forgot(req: Request, res: Response, next: NextFunction) {
  try {
    const forgotPasswordPayload = req.body as ForgotPasswordPayload;

    await passwordService.forgot(forgotPasswordPayload);

    res.status(HTTPStatus.OK).json({
      code: HTTPStatus.OK,
      message: messages.auth.forgotSuccess
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Handle /reset request.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export async function reset(req: Request, res: Response, next: NextFunction) {
  try {
    const resetPasswordPayload = req.body as ResetPasswordPayload;

    await passwordService.reset(resetPasswordPayload);

    res.status(HTTPStatus.OK).json({
      code: HTTPStatus.OK,
      message: messages.auth.resetSuccess
    });
  } catch (error) {
    next(error);
  }
}
