import { Router } from 'express';

import acl from './middlewares/acl';
import * as validate from './middlewares/validate';
import * as homeController from './controllers/home';
import * as userController from './controllers/user';
import * as authController from './controllers/auth';
import authenticate from './middlewares/authenticate';
import { userPOSTSchema } from './validators/userRequest';
import { loginSchema, forgotSchema } from './validators/authRequest';
import validateRefreshToken from './middlewares/validateRefreshToken';

const router: Router = Router();

router.get('/', homeController.index);

router.post('/login', validate.schema(loginSchema), authController.login);
router.post('/refresh', validateRefreshToken, authController.refresh);
router.post('/logout', validateRefreshToken, authController.logout);
router.post('/forgot', validate.schema(forgotSchema), authController.forgot);
// router.post('/reset', validate.schema(resetSchema), authController.reset);

router.get('/users', authenticate, acl, userController.index);
router.post('/users', authenticate, acl, validate.schema(userPOSTSchema), userController.store);

export default router;
