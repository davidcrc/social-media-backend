import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
const router = Router();
router.get('/health', UserController.health);
router.post('/register', UserController.register);
router.post('/login', UserController.login);
export default router;
