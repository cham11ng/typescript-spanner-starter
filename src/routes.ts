import { Router } from 'express';

import * as validate from './middlewares/validate';
import * as homeController from './controllers/home';
import * as userController from './controllers/user';
import * as authController from './controllers/auth';
import { loginSchema } from './validators/loginRequest';
import validateRefreshToken from './middlewares/validateRefreshToken';
import { userPOSTSchema } from './validators/userRequest';

const router: Router = Router();

router.get('/', homeController.index);

router.post('/login', validate.schema(loginSchema), authController.login);
router.post('/refresh', validateRefreshToken, authController.refresh);
router.post('/logout', validateRefreshToken, authController.logout);

router.get('/users', userController.index);
router.post('/users', validate.schema(userPOSTSchema), userController.store);

export default router;
