import express from 'express';
import { createPlay, getPlayHistory } from '../controllers/playsControllers';
import { auth } from '../middleware/auth';

const router = express.Router();

router.post('/:gameId', auth, createPlay);
router.get('/history', auth, getPlayHistory);

export default router; 