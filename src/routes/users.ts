import express from 'express';
import { getUserProfile, getUserPlays } from '../controllers/usersControllers';

const router = express.Router();

router.get('/:id', getUserProfile);
router.get('/:id/plays', getUserPlays);

export default router;
