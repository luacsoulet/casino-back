import pool from "../plugins/db";
import { Request, Response } from 'express';
import { validateNumber } from '../utils/validators';

const handleError = (res: Response, error: any, message: string) => {
    res.status(500).json({ message, error: error.message });
};

export const getUserProfile = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        if (!validateNumber(res, parseInt(id), 'id')) {
            return;
        }
        const user = await pool.query(
            'SELECT id, username, virtual_balance FROM users WHERE id = $1',
            [id]
        );
        if (user.rows.length === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(user.rows[0]);
    } catch (error: any) {
        handleError(res, error, 'Error fetching user profile');
    }
};

export const getUserPlays = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const plays = await pool.query(
            'SELECT * FROM plays WHERE user_id = $1 ORDER BY created_at DESC',
            [id]
        );
        res.status(200).json(plays.rows);
    } catch (error: any) {
        handleError(res, error, 'Error fetching user plays');
    }
};
