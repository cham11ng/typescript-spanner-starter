import * as HTTPStatus from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';

import lang from '../config/lang';
import JWTPayload from '../domain/misc/JWTPayload';
import * as authService from '../services/authService';

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
