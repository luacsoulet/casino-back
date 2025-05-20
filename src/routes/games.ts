import express from 'express';
import { getGames } from '../controllers/gamesControllers';

const router = express.Router();

router.get('/', getGames);

export default router;
