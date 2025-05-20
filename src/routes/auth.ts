import express from 'express';
import { createUser, loginUser } from '../controllers/authControllers';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', createUser);

export default router;