export const playsSwagger = {
    '/plays/{gameId}': {
        post: {
            summary: 'Record a new game play',
            description: 'Create a new play record for a specific game, including bet amount and result. Updates user\'s balance accordingly.',
            tags: ['Plays'],
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    in: 'path',
                    name: 'gameId',
                    required: true,
                    schema: {
                        type: 'integer'
                    },
                    description: 'ID of the game being played',
                    example: 1
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['bet', 'result'],
                            properties: {
                                bet: {
                                    type: 'integer',
                                    minimum: 1,
                                    maximum: 1000000,
                                    description: 'Amount wagered on the game',
                                    example: 100
                                },
                                result: {
                                    type: 'boolean',
                                    description: 'Game outcome (true for win, false for loss)',
                                    example: true
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: 'Play successfully recorded',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: {
                                        type: 'string',
                                        example: 'Game won!'
                                    },
                                    result: {
                                        type: 'boolean',
                                        description: 'Game outcome',
                                        example: true
                                    },
                                    earned: {
                                        type: 'integer',
                                        description: 'Amount earned from the game',
                                        example: 200
                                    },
                                    virtual_balance: {
                                        type: 'integer',
                                        description: 'Updated user balance',
                                        example: 1200
                                    },
                                    play: {
                                        $ref: '#/components/schemas/Play'
                                    }
                                }
                            }
                        }
                    }
                },
                400: {
                    $ref: '#/components/responses/BadRequest'
                },
                401: {
                    $ref: '#/components/responses/Unauthorized'
                },
                404: {
                    $ref: '#/components/responses/NotFound'
                },
                500: {
                    $ref: '#/components/responses/ServerError'
                }
            }
        }
    },
    '/plays/history': {
        get: {
            summary: 'Get user\'s play history',
            description: 'Retrieve the authenticated user\'s game play history, including all past games, bets, and results',
            tags: ['Plays'],
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'Play history successfully retrieved',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: {
                                    allOf: [
                                        { $ref: '#/components/schemas/Play' },
                                        {
                                            type: 'object',
                                            properties: {
                                                game_name: {
                                                    type: 'string',
                                                    description: 'Name of the game played'
                                                }
                                            }
                                        }
                                    ]
                                },
                                example: [
                                    {
                                        id: 1,
                                        user_id: 1,
                                        game_id: 1,
                                        bet: 100,
                                        result: true,
                                        created_at: '2024-03-20T15:30:00Z',
                                        game_name: 'Coin Flip'
                                    }
                                ]
                            }
                        }
                    }
                },
                401: {
                    $ref: '#/components/responses/Unauthorized'
                },
                500: {
                    $ref: '#/components/responses/ServerError'
                }
            }
        }
    }
}; 