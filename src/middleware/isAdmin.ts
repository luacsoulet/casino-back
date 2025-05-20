import { Request, Response, NextFunction } from 'express';
import pool from '../plugins/db';

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.auth?.userId;
    const isAdminFromToken = req.auth?.isAdmin;
    if (!isAdminFromToken) {
        res.status(403).json({ message: 'Forbidden: Admin access required' });
        return;
    }
    try {
        const user = await pool.query(
            'SELECT is_admin FROM users WHERE id = $1',
            [userId]
        );
        if (!user.rows[0]?.is_admin) {
            res.status(403).json({ message: 'Forbidden: Admin access required' });
            return;
        }
        next();
    } catch (error) {
        res.status(500).json({ message: 'Error checking admin status' });
        return;
    }
}; 