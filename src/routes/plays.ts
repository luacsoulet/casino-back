import express from 'express';
import { createPlay } from '../controllers/playsControllers';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/:gameId', auth, createPlay);

export default router; 