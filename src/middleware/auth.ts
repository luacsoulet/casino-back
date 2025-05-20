import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { CustomJwtPayload } from '../types/express';

const extractToken = (authHeader: string | undefined): string | null => {
    return authHeader?.split(' ')[1] || null;
};

const verifyToken = (token: string): CustomJwtPayload => {
    return jwt.verify(token, process.env.JWT_SECRET!) as CustomJwtPayload;
};

export const auth = (req: Request, res: Response, next: NextFunction) => {
    const token = extractToken(req.headers.authorization);
    if (!token) {
        res.status(401).send({ message: 'Unauthorized' });
        return;
    }
    try {
        const decoded = verifyToken(token);
        req.auth = decoded;
        next();
    } catch (error) {
        res.status(401).send({ message: 'Unauthorized' });
        return;
    }
}; 