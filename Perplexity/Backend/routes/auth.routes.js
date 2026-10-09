import {Router} from 'express';
import { register, verifyEmail, login, getMe } from '../controller/auth.controller.js';
import { validateRegister, validateLogin } from '../validator/validate.js';
import { userAuth } from '../middleware/auth.middleware.js';
const authRouter = Router();


/** @route POST api/auth/register
 * @desc Register a new user
 * @access Public
 */
authRouter.post('/register', validateRegister,register);


/** @route POST api/auth/login
 * @desc Login a user
 * @access Public
 */
authRouter.post('/login', validateLogin ,login);


/** @route GET api/auth/verify-email
 * @desc Verify a user's email address
 * @access Public
 */
authRouter.get('/verify-email', verifyEmail);

/** @route GET api/auth/getMe
 * @desc Get the authenticated user's information
 * @access Private
 */
authRouter.get('/getMe', userAuth, getMe)



export default authRouter;