import pool from "../plugins/db";
import { Request, Response } from 'express';
import { validateNumber } from '../utils/validators';
import { handleError, throwNotFound } from '../utils/errorHandler';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await pool.query('SELECT id, username, virtual_balance, is_admin FROM users ORDER BY virtual_balance DESC');
        res.status(200).json(users.rows);
    } catch (error) {
        handleError(res, error, 'Error while retrieving the users');
    }
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
            throwNotFound('User not found');
        }
        res.status(200).json(user.rows[0]);
    } catch (error) {
        handleError(res, error, 'Error while retrieving the user profile');
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
    } catch (error) {
        handleError(res, error, 'Error while retrieving the user plays');
    }
};

export const modifyUserBalance = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { amount } = req.body;
    try {
        const userExists = await pool.query('SELECT id FROM users WHERE id = $1', [id]);
        if (userExists.rows.length === 0) {
            throwNotFound('User not found');
        }
        await pool.query('UPDATE users SET virtual_balance = $1 WHERE id = $2', [amount, id]);
        res.status(200).json({ message: 'User balance modified successfully' });
    } catch (error) {
        handleError(res, error, 'Error while modifying the user balance');
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const userExists = await pool.query('SELECT id FROM users WHERE id = $1', [id]);
        if (userExists.rows.length === 0) {
            throwNotFound('User not found');
        }
        await pool.query('DELETE FROM users WHERE id = $1', [id]);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        handleError(res, error, 'Error while deleting the user');
    }
};