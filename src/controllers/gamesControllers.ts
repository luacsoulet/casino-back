import pool from "../plugins/db";
import { Request, Response } from 'express';
import { handleError, throwNotFound, throwBadRequest } from '../utils/errorHandler';
import crypto from 'crypto';

export const getGames = async (req: Request, res: Response) => {
    try {
        const games = await pool.query('SELECT id, name, description FROM games');
        const gamesData = JSON.stringify(games.rows);
        const etag = crypto.createHash('md5').update(gamesData).digest('hex');
        const clientEtag = req.headers['if-none-match'];
        res.setHeader('ETag', etag);
        res.setHeader('Cache-Control', 'public, max-age=604800');
        if (clientEtag === etag) {
            res.status(304).end();
            return;
        }

        res.status(200).json(games.rows);
    } catch (error) {
        handleError(res, error, 'Error while retrieving the games');
    }
};

export const getGameById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const gameId = parseInt(id);
        if (isNaN(gameId) || gameId <= 0) {
            throwBadRequest('The game ID must be a positive number');
            return;
        }
        const game = await pool.query('SELECT id, name, description FROM games WHERE id = $1', [gameId]);
        if (game.rows.length === 0) {
            throwNotFound('Game not found');
            return;
        }
        res.status(200).json(game.rows[0]);
    } catch (error) {
        handleError(res, error, 'Error while retrieving the game');
    }
}; 