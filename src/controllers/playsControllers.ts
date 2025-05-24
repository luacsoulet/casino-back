import { Request, Response } from 'express';
import pool from "../plugins/db";
import { handleError, throwUnauthorized, throwBadRequest, throwNotFound } from '../utils/errorHandler';
import { validatePlay, validateGameId } from '../utils/playValidators';

interface PlayRequest {
    bet: number;
    result: boolean;
}

export const createPlay = async (req: Request<{ gameId: string }, {}, PlayRequest>, res: Response): Promise<void> => {
    try {
        const { gameId } = req.params;
        const userId = req.auth?.userId;
        validateGameId(gameId);
        validatePlay(req);
        const { bet, result } = req.body;
        const gameExists = await pool.query('SELECT id FROM games WHERE id = $1', [gameId]);
        if (gameExists.rows.length === 0) {
            throwNotFound('Game not found');
        }
        const userQuery = await pool.query('SELECT virtual_balance FROM users WHERE id = $1', [userId]);
        if (!userQuery.rows[0]) {
            throwNotFound('User not found');
        }
        if (userQuery.rows[0].virtual_balance < bet) {
            throwBadRequest('Solde insuffisant', {
                balance: userQuery.rows[0].virtual_balance,
                requiredBet: bet
            });
        }
        const playQuery = await pool.query(
            `INSERT INTO plays (user_id, game_id, bet, result, created_at) 
             VALUES ($1, $2, $3, $4, NOW()) 
             RETURNING id, user_id, game_id, bet, result, created_at`,
            [userId, gameId, bet, result]
        );
        const earned = result ? bet * 2 : 0;
        await pool.query(
            'UPDATE users SET virtual_balance = virtual_balance + $1 WHERE id = $2',
            [earned - bet, userId]
        );
        res.status(201).json({
            message: result ? 'Game won !' : 'Game lost',
            result: result,
            earned,
            virtual_balance: userQuery.rows[0].virtual_balance + (earned - bet),
            play: playQuery.rows[0]
        });
    } catch (error) {
        handleError(res, error, 'Error while creating the play');
    }
};

export const getPlayHistory = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.auth?.userId;
        if (!userId) {
            throwUnauthorized('You must be logged in to see your history');
        }
        const historyQuery = await pool.query(
            `SELECT p.id, p.user_id, p.game_id, p.bet, p.result, p.created_at, g.name as game_name 
             FROM plays p 
             JOIN games g ON p.game_id = g.id 
             WHERE p.user_id = $1 
             ORDER BY p.created_at DESC 
             LIMIT 50`,
            [userId]
        );
        res.json(historyQuery.rows);
    } catch (error) {
        handleError(res, error, 'Error while retrieving the history');
    }
}; 