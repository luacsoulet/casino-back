import pool from "../plugins/db";
import { Request, Response } from 'express';
import { validateRequiredFields, validateNumber } from '../utils/validators';
import { handleError, throwNotFound, throwBadRequest } from '../utils/errorHandler';

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

const createGameInDb = async (name: string, description: string) => {
    return await pool.query(
        'INSERT INTO games (name, description) VALUES ($1, $2) RETURNING *',
        [name, description]
    );
};

const deleteGameFromDb = async (gameId: string) => {
    const game = await pool.query('SELECT id FROM games WHERE id = $1', [gameId]);
    if (game.rows.length === 0) {
        throwNotFound('Game not found');
    }
    return await pool.query('DELETE FROM games WHERE id = $1', [gameId]);
};

const promoteUserInDb = async (userId: string) => {
    const user = await pool.query('SELECT id FROM users WHERE id = $1', [userId]);
    if (user.rows.length === 0) {
        throwNotFound('User not found');
    }
    return await pool.query(
        'UPDATE users SET is_admin = TRUE WHERE id = $1 RETURNING id, username, is_admin',
        [userId]
    );
};

export const updateUserBalance = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { amount } = req.body;

    try {
        if (!validateNumber(res, amount, 'amount')) {
            throwBadRequest('The amount must be a valid number');
        }
        const updatedUser = await updateUserBalanceInDb(userId, amount);
        if (updatedUser.rows.length === 0) {
            throwNotFound('User not found');
        }
        res.status(200).json(updatedUser.rows[0]);
    } catch (error) {
        handleError(res, error, 'Error while updating the user balance');
    }
};

export const createGame = async (req: Request, res: Response) => {
    const { name, description } = req.body;

    try {
        if (!validateRequiredFields(res, { name, description }, ['name', 'description'])) {
            throwBadRequest('Name and description are required');
        }
        const newGame = await createGameInDb(name, description);
        res.status(201).json(newGame.rows[0]);
    } catch (error) {
        handleError(res, error, 'Error while creating the game');
    }
};

export const deleteGame = async (req: Request, res: Response) => {
    const { gameId } = req.params;

    try {
        await deleteGameFromDb(gameId);
        res.status(200).json({ message: 'Game deleted successfully' });
    } catch (error) {
        handleError(res, error, 'Error while deleting the game');
    }
};

export const promoteToAdmin = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
        const updatedUser = await promoteUserInDb(userId);
        res.status(200).json(updatedUser.rows[0]);
    } catch (error) {
        handleError(res, error, 'Error while promoting the user');
    }
};