import { Response, Request, NextFunction } from 'express';

export class AppError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public details?: any
    ) {
        super(message);
        this.name = 'AppError';
    }
}

export const handleError = (res: Response, error: unknown, defaultMessage: string = 'Une erreur est survenue') => {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            message: error.message,
            details: error.details
        });
    }

    if (error instanceof Error) {
        return res.status(500).json({
            message: defaultMessage,
            error: error.message
        });
    }

    return res.status(500).json({
        message: defaultMessage,
        error: 'Erreur inconnue'
    });
};

export const methodNotAllowed = (allowedMethods: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!allowedMethods.includes(req.method)) {
            throw new AppError(405, 'Méthode non autorisée', {
                allowed: allowedMethods
            });
        }
        next();
    };
};

export const throwNotFound = (message: string = 'Ressource non trouvée') => {
    throw new AppError(404, message);
};

export const throwUnauthorized = (message: string = 'Non autorisé') => {
    throw new AppError(401, message);
};

export const throwForbidden = (message: string = 'Accès interdit') => {
    throw new AppError(403, message);
};

export const throwBadRequest = (message: string, details?: any) => {
    throw new AppError(400, message, details);
};

export const throwMethodNotAllowed = (allowedMethods: string[]) => {
    throw new AppError(405, 'Méthode non autorisée', {
        allowed: allowedMethods
    });
}; 