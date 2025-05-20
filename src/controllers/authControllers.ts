import pool from "../plugins/db";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { validateRequiredFields } from '../utils/validators';

const handleError = (res: Response, error: any, message: string) => {
    res.status(500).json({ message, error: error.message });
};

const findUserByUsername = async (username: string) => {
    return await pool.query(
        'SELECT id, username, password_hash, is_admin FROM users WHERE username = $1',
        [username]
    );
};

const createUserInDb = async (username: string, hashedPassword: string) => {
    return await pool.query(
        'INSERT INTO users (username, password_hash, virtual_balance) VALUES ($1, $2, $3)',
        [username, hashedPassword, 0]
    );
};

const generateToken = (userId: number, isAdmin: boolean) => {
    return jwt.sign(
        { userId, isAdmin },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' }
    );
};

export const createUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        if (!validateRequiredFields(res, { username, password }, ['username', 'password'])) {
            return;
        }
        const existingUser = await findUserByUsername(username);
        if (existingUser.rows.length > 0) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await createUserInDb(username, hashedPassword);
        res.status(201).json({ message: 'User created successfully' });
    } catch (error: any) {
        handleError(res, error, 'Error creating user');
    }
};

export const loginUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        if (!validateRequiredFields(res, { username, password }, ['username', 'password'])) {
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
        const token = generateToken(user.rows[0].id, user.rows[0].is_admin);
        res.status(200).json({
            token,
            user: {
                id: user.rows[0].id,
                username: user.rows[0].username,
                isAdmin: user.rows[0].is_admin
            }
        });
    } catch (error: any) {
        handleError(res, error, 'Error during login');
    }
};