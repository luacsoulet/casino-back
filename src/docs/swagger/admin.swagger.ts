export const adminSwagger = {
    '/admin/users': {
        get: {
            summary: 'Get all users',
            description: 'Retrieve a list of all registered users (admin only)',
            tags: ['Admin'],
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'List of users successfully retrieved',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: {
                                    $ref: '#/components/schemas/User'
                                }
                            }
                        }
                    }
                },
                401: {
                    $ref: '#/components/responses/Unauthorized'
                },
                403: {
                    $ref: '#/components/responses/Forbidden'
                },
                500: {
                    $ref: '#/components/responses/ServerError'
                }
            }
        }
    },
    '/admin/users/{userId}': {
        put: {
            summary: 'Update user balance',
            description: 'Update a user\'s virtual balance (admin only)',
            tags: ['Admin'],
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    in: 'path',
                    name: 'userId',
                    required: true,
                    schema: {
                        type: 'integer'
                    },
                    description: 'ID of the user to update',
                    example: 1
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['virtual_balance'],
                            properties: {
                                virtual_balance: {
                                    type: 'integer',
                                    description: 'New virtual balance amount',
                                    example: 1000
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'User balance successfully updated',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: {
                                        type: 'string',
                                        example: 'User balance updated successfully'
                                    },
                                    user: {
                                        $ref: '#/components/schemas/User'
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
                403: {
                    $ref: '#/components/responses/Forbidden'
                },
                404: {
                    $ref: '#/components/responses/NotFound'
                },
                500: {
                    $ref: '#/components/responses/ServerError'
                }
            }
        },
        delete: {
            summary: 'Delete user',
            description: 'Delete a user account (admin only)',
            tags: ['Admin'],
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    in: 'path',
                    name: 'userId',
                    required: true,
                    schema: {
                        type: 'integer'
                    },
                    description: 'ID of the user to delete',
                    example: 1
                }
            ],
            responses: {
                200: {
                    description: 'User successfully deleted',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: {
                                        type: 'string',
                                        example: 'User deleted successfully'
                                    }
                                }
                            }
                        }
                    }
                },
                401: {
                    $ref: '#/components/responses/Unauthorized'
                },
                403: {
                    $ref: '#/components/responses/Forbidden'
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
    '/admin/stats': {
        get: {
            summary: 'Get global statistics',
            description: 'Retrieve global casino statistics (admin only)',
            tags: ['Admin'],
            security: [{ bearerAuth: [] }],
            responses: {
                200: {
                    description: 'Statistics successfully retrieved',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    total_users: {
                                        type: 'integer',
                                        description: 'Total number of registered users',
                                        example: 100
                                    },
                                    total_plays: {
                                        type: 'integer',
                                        description: 'Total number of plays',
                                        example: 1000
                                    },
                                    total_bets: {
                                        type: 'integer',
                                        description: 'Total amount of bets placed',
                                        example: 50000
                                    },
                                    house_profit: {
                                        type: 'integer',
                                        description: 'Total house profit',
                                        example: 5000
                                    },
                                    most_played_game: {
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
                                                example: 500
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
                403: {
                    $ref: '#/components/responses/Forbidden'
                },
                500: {
                    $ref: '#/components/responses/ServerError'
                }
            }
        }
    }
}; 