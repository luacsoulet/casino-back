import { Request } from 'express';
import { throwBadRequest } from './errorHandler';

export interface PlayValidationRules {
    minBet: number;
    maxBet: number;
}

const DEFAULT_RULES: PlayValidationRules = {
    minBet: 1,
    maxBet: 1000000
};

export const validatePlay = (req: Request, rules: PlayValidationRules = DEFAULT_RULES): void => {
    const { bet, result } = req.body;
    if (typeof bet !== 'number') {
        throwBadRequest('The bet must be a number');
    }
    if (!Number.isInteger(bet)) {
        throwBadRequest('The bet must be an integer');
    }
    if (bet < rules.minBet) {
        throwBadRequest(`The minimum bet is ${rules.minBet}`);
    }
    if (bet > rules.maxBet) {
        throwBadRequest(`The maximum bet is ${rules.maxBet}`);
    }
    if (typeof result !== 'boolean') {
        throwBadRequest('The result must be a boolean (true/false)');
    }
};

export const validateGameId = (gameId: string): void => {
    if (!gameId) {
        throwBadRequest('Game ID is required');
    }
    const parsedId = parseInt(gameId);
    if (isNaN(parsedId) || parsedId <= 0) {
        throwBadRequest('Game ID must be a positive number');
    }
}; 