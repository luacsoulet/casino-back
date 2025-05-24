export const gamesSwagger = {
    '/games': {
        get: {
            summary: 'Get all available games',
            description: 'Retrieve a list of all games available in the casino',
            tags: ['Games'],
            responses: {
                200: {
                    description: 'List of games successfully retrieved',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: {
                                    $ref: '#/components/schemas/Game'
                                },
                                example: [
                                    {
                                        id: 1,
                                        name: 'Coin Flip',
                                        description: 'Flip a coin and bet on heads or tails'
                                    },
                                    {
                                        id: 2,
                                        name: 'Slots',
                                        description: 'Classic slot machine game'
                                    }
                                ]
                            }
                        }
                    }
                },
                500: {
                    $ref: '#/components/responses/ServerError'
                }
            }
        }
    },
    '/games/{id}': {
        get: {
            summary: 'Get game details',
            description: 'Retrieve detailed information about a specific game',
            tags: ['Games'],
            parameters: [
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    schema: {
                        type: 'integer'
                    },
                    description: 'ID of the game to retrieve',
                    example: 1
                }
            ],
            responses: {
                200: {
                    description: 'Game details successfully retrieved',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Game'
                            }
                        }
                    }
                },
                404: {
                    $ref: '#/components/responses/NotFound'
                },
                500: {
                    $ref: '#/components/responses/ServerError'
                }
            }
        }
    }
}; 