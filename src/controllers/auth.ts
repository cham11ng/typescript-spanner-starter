import * as HTTPStatus from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';

import lang from '../config/lang';
import logger from '../utils/logger';
import JWTPayload from '../domain/misc/JWTPayload';
import * as authService from '../services/authService';
import ResetPasswordPayload from '../domain/requests/ResetPasswordPayload';
import ForgotPasswordPayload from '../domain/requests/ForgotPasswordPayload';

const { messages } = lang;

/**
 * Handle /login request.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await authService.login(req.body);

    res.status(HTTPStatus.OK).json({
      data,
      code: HTTPStatus.OK,
      message: messages.auth.loginSuccess
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Handle /refresh request.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const token = String(res.locals.refreshToken);
    const jwtPayload = res.locals.jwtPayload as JWTPayload;

    const data = await authService.refresh(token, jwtPayload);

    res.status(HTTPStatus.OK).json({
      data,
      code: HTTPStatus.OK,
      message: messages.auth.accessTokenRefreshed
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Handle /logout request.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const token = String(res.locals.refreshToken);
    const { userId } = res.locals.jwtPayload as JWTPayload;

    await authService.logout({ token, userId });

    res.status(HTTPStatus.OK).json({
      code: HTTPStatus.OK,
      message: messages.auth.logoutSuccess
    });
  } catch (error) {
    next(error);
  }
}

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

    logger.debug('Forgot Password: Payload -', JSON.stringify(forgotPasswordPayload, null, 2));

    await authService.forgot(forgotPasswordPayload);

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

    logger.debug('Reset Password: Payload -', JSON.stringify(resetPasswordPayload, null, 2));

    await authService.reset(resetPasswordPayload);

    res.status(HTTPStatus.OK).json({
      code: HTTPStatus.OK,
      message: messages.auth.resetSuccess
    });
  } catch (error) {
    next(error);
  }
}
