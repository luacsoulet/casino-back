import express from 'express';
import { getUserProfile, getUserPlays, getUsers, deleteUser, modifyUserBalance } from '../controllers/usersControllers';
import { auth } from '../middleware/auth';
import { isAdmin } from '../middleware/isAdmin';

const router = express.Router();

router.get('/', auth, isAdmin, getUsers);
router.get('/:id', getUserProfile);
router.get('/:id/plays', getUserPlays);
router.put('/:id/balance', auth, isAdmin, modifyUserBalance);
router.delete('/:id', auth, isAdmin, deleteUser);

export default router;
