import pool from "../plugins/db";
import { Request, Response } from 'express';
import { validateNumber } from '../utils/validators';

const handleError = (res: Response, error: any, message: string) => {
    res.status(500).json({ message, error: error.message });
};

const generateRandomResult = () => {
    return Math.random() > 0.5 ? 'win' : 'lose';
};

const calculateEarned = (bet: number, result: string) => {
    return result === 'win' ? bet * 2 : 0;
};

export const createPlay = async (req: Request, res: Response) => {
    const { gameId } = req.params;
    const { bet } = req.body;
    const userId = req.auth?.userId;

    try {
        if (!validateNumber(res, bet, 'bet') || bet <= 0) {
            return;
        }

        const user = await pool.query(
            'SELECT virtual_balance FROM users WHERE id = $1',
            [userId]
        );

        if (user.rows[0].virtual_balance < bet) {
            res.status(400).json({ message: 'Insufficient balance' });
            return;
        }

        const result = generateRandomResult();
        const earned = calculateEarned(bet, result);

        const play = await pool.query(
            'INSERT INTO plays (user_id, game_id, bet, result) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, gameId, bet, result]
        );

        await pool.query(
            'UPDATE users SET virtual_balance = virtual_balance + $1 WHERE id = $2',
            [earned - bet, userId]
        );

        res.status(201).json({
            result,
            earned,
            play: play.rows[0]
        });
    } catch (error: any) {
        handleError(res, error, 'Error creating play');
    }
}; 