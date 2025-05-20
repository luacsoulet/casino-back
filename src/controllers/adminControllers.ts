import pool from "../plugins/db";
import { Request, Response } from 'express';
import { validateRequiredFields, validateNumber } from '../utils/validators';

const handleError = (res: Response, error: any, message: string) => {
    res.status(500).json({ message, error: error.message });
};

const updateUserBalanceInDb = async (userId: string, amount: number) => {
    await pool.query(
        'UPDATE users SET virtual_balance = virtual_balance + $1 WHERE id = $2',
        [amount, userId]
    );
    return await pool.query(
        'SELECT id, username, virtual_balance FROM users WHERE id = $1',
        [userId]
    );
};

export const updateUserBalance = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { amount } = req.body;

    try {
        if (!validateNumber(res, amount, 'amount')) {
            return;
        }
        const updatedUser = await updateUserBalanceInDb(userId, amount);
        res.status(200).json(updatedUser.rows[0]);
    } catch (error: any) {
        handleError(res, error, 'Error updating user balance');
    }
};

const createGameInDb = async (name: string, description: string) => {
    return await pool.query(
        'INSERT INTO games (name, description) VALUES ($1, $2) RETURNING *',
        [name, description]
    );
};

export const createGame = async (req: Request, res: Response) => {
    const { name, description } = req.body;

    try {
        if (!validateRequiredFields(res, { name, description }, ['name', 'description'])) {
            return;
        }
        const newGame = await createGameInDb(name, description);
        res.status(201).json(newGame.rows[0]);
    } catch (error: any) {
        handleError(res, error, 'Error creating game');
    }
};

const deleteGameFromDb = async (gameId: string) => {
    return await pool.query('DELETE FROM games WHERE id = $1', [gameId]);
};

export const deleteGame = async (req: Request, res: Response) => {
    const { gameId } = req.params;

    try {
        await deleteGameFromDb(gameId);
        res.status(200).json({ message: 'Game deleted successfully' });
    } catch (error: any) {
        handleError(res, error, 'Error deleting game');
    }
};

const promoteUserInDb = async (userId: string) => {
    return await pool.query(
        'UPDATE users SET is_admin = TRUE WHERE id = $1 RETURNING id, username, is_admin',
        [userId]
    );
};

export const promoteToAdmin = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const updatedUser = await promoteUserInDb(userId);
        if (updatedUser.rows.length === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(updatedUser.rows[0]);
    } catch (error: any) {
        handleError(res, error, 'Error promoting user to admin');
    }
}; 