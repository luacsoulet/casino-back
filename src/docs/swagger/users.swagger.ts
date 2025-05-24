export const usersSwagger = {
    '/users/{id}': {
        get: {
            summary: 'Get user profile',
            description: 'Retrieve the profile information of the user with the given ID',
            tags: ['Users'],
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'User profile successfully retrieved',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/User'
                            }
                        }
                    }
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
    '/users/{id}/stats': {
        get: {
            summary: 'Get user statistics',
            description: 'Retrieve gaming statistics for the user with the given ID',
            tags: ['Users'],
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'User statistics successfully retrieved',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    total_games: {
                                        type: 'integer',
                                        description: 'Total number of games played',
                                        example: 50
                                    },
                                    total_wins: {
                                        type: 'integer',
                                        description: 'Total number of games won',
                                        example: 25
                                    },
                                    total_losses: {
                                        type: 'integer',
                                        description: 'Total number of games lost',
                                        example: 25
                                    },
                                    total_profit: {
                                        type: 'integer',
                                        description: 'Total profit (can be negative)',
                                        example: 1000
                                    },
                                    win_rate: {
                                        type: 'number',
                                        format: 'float',
                                        description: 'Win rate percentage',
                                        example: 50.0
                                    },
                                    biggest_win: {
                                        type: 'integer',
                                        description: 'Largest amount won in a single game',
                                        example: 500
                                    },
                                    biggest_loss: {
                                        type: 'integer',
                                        description: 'Largest amount lost in a single game',
                                        example: 200
                                    },
                                    favorite_game: {
                                        type: 'object',
                                        properties: {
                                            id: {
                                                type: 'integer',
                                                example: 1
                                            },
                                            name: {
                                                type: 'string',
                                                example: 'Coin Flip'
                                            },
                                            plays_count: {
                                                type: 'integer',
                                                example: 30
                                            }
                                        }
                                    }
                                }
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
    },
    '/users/{id}/password': {
        put: {
            summary: 'Update password',
            description: 'Update the password for the user with the given ID',
            tags: ['Users'],
            security: [{ bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['currentPassword', 'newPassword'],
                            properties: {
                                currentPassword: {
                                    type: 'string',
                                    description: 'Current password',
                                    format: 'password',
                                    example: 'currentPass123'
                                },
                                newPassword: {
                                    type: 'string',
                                    description: 'New password',
                                    format: 'password',
                                    example: 'newPass123',
                                    minLength: 6
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Password successfully updated',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: {
                                        type: 'string',
                                        example: 'Password updated successfully'
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
                500: {
                    $ref: '#/components/responses/ServerError'
                }
            }
        }
    }
}; 