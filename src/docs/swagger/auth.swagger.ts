export const authSwagger = {
    '/auth/register': {
        post: {
            summary: 'Register a new user',
            description: 'Create a new user account with username and password. The password will be hashed before storage.',
            tags: ['Auth'],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['username', 'password'],
                            properties: {
                                username: {
                                    type: 'string',
                                    description: 'Unique username for the account',
                                    example: 'john_doe',
                                    minLength: 3
                                },
                                password: {
                                    type: 'string',
                                    description: 'Account password (will be hashed)',
                                    format: 'password',
                                    example: 'strongPassword123',
                                    minLength: 6
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: 'User successfully created',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: {
                                        type: 'string',
                                        example: 'User successfully created'
                                    }
                                }
                            }
                        }
                    }
                },
                400: {
                    $ref: '#/components/responses/BadRequest'
                },
                500: {
                    $ref: '#/components/responses/ServerError'
                }
            }
        }
    },
    '/auth/login': {
        post: {
            summary: 'Authenticate a user',
            description: 'Authenticate user credentials and return a JWT token for subsequent API calls',
            tags: ['Auth'],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['username', 'password'],
                            properties: {
                                username: {
                                    type: 'string',
                                    description: 'User\'s username',
                                    example: 'john_doe'
                                },
                                password: {
                                    type: 'string',
                                    description: 'User\'s password',
                                    format: 'password',
                                    example: 'strongPassword123'
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Successfully authenticated',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    token: {
                                        type: 'string',
                                        description: 'JWT token for API authentication',
                                        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                                    },
                                    user: {
                                        $ref: '#/components/schemas/User'
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
    }
}; 