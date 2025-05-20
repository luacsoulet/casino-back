import pool from "../plugins/db";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

const handleError = (res: Response, error: any, message: string) => {
    res.status(500).json({ message, error: error.message });
};

const findUserByUsername = async (username: string) => {
    return await pool.query('SELECT * FROM users WHERE username = $1', [username]);
};

export const createUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            res.status(400).json({ message: 'Username and password are required' });
            return;
        }
        const existingUser = await findUserByUsername(username);
        if (existingUser.rows.length > 0) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            'INSERT INTO users (username, password_hash, virtual_balance) VALUES ($1, $2, $3)',
            [username, hashedPassword, 0]
        );
        res.status(201).json({ message: 'User created successfully' });
    } catch (error: any) {
        handleError(res, error, 'Error creating user');
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            res.status(400).json({ message: 'Username and password are required' });
            return;
        }
        const user = await findUserByUsername(username);
        if (user.rows.length === 0) {
            res.status(401).json({ message: 'Invalid username or password' });
            return;
        }
        const isPasswordValid = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid username or password' });
            return;
        }
        const token = jwt.sign({ userId: user.rows[0].id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error: any) {
        handleError(res, error, 'Error during login');
    }
};