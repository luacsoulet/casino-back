import pool from "../plugins/db";
import { Request, Response } from 'express';

const handleError = (res: Response, error: any, message: string) => {
    res.status(500).json({ message, error: error.message });
};

export const getGames = async (req: Request, res: Response) => {
    try {
        const games = await pool.query(
            'SELECT id, name, description FROM games'
        );
        res.status(200).json(games.rows);
    } catch (error: any) {
        handleError(res, error, 'Error fetching games');
    }
}; 