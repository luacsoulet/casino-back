import { Request } from 'express';

export interface CustomJwtPayload {
    userId: number;
    isAdmin: boolean;
    iat?: number;
    exp?: number;
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
            };
            auth?: CustomJwtPayload;
        }
    }
} 