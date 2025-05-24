export const responsesSwagger = {
    BadRequest: {
        description: 'Bad Request - Invalid input parameters',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            example: 'Invalid input parameters'
                        }
                    }
                }
            }
        }
    },
    Unauthorized: {
        description: 'Unauthorized - Authentication required or invalid token',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            example: 'Authentication required'
                        }
                    }
                }
            }
        }
    },
    Forbidden: {
        description: 'Forbidden - User does not have required permissions',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            example: 'Access denied'
                        }
                    }
                }
            }
        }
    },
    NotFound: {
        description: 'Not Found - Requested resource does not exist',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            example: 'Resource not found'
                        }
                    }
                }
            }
        }
    },
    ServerError: {
        description: 'Internal Server Error',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        message: {
                            type: 'string',
                            example: 'An internal server error occurred'
                        }
                    }
                }
            }
        }
    }
}; 