import express from 'express';
import { auth } from '../middleware/auth';
import { isAdmin } from '../middleware/isAdmin';
import { updateUserBalance, createGame, deleteGame, promoteToAdmin } from '../controllers/adminControllers';

const router = express.Router();
router.put('/users/:userId/balance', auth, isAdmin, updateUserBalance);
router.post('/games', auth, isAdmin, createGame);
router.delete('/games/:gameId', auth, isAdmin, deleteGame);
router.post('/users/:userId/promote', auth, isAdmin, promoteToAdmin);

export default router; 