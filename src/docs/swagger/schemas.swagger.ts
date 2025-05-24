export const schemasSwagger = {
    User: {
        type: 'object',
        properties: {
            id: {
                type: 'integer',
                description: 'Unique identifier for the user'
            },
            username: {
                type: 'string',
                description: 'User\'s unique username'
            },
            virtual_balance: {
                type: 'integer',
                description: 'User\'s current virtual balance'
            },
            is_admin: {
                type: 'boolean',
                description: 'Whether the user has admin privileges'
            },
            created_at: {
                type: 'string',
                format: 'date-time',
                description: 'When the user account was created'
            }
        }
    },
    Play: {
        type: 'object',
        properties: {
            id: {
                type: 'integer',
                description: 'Unique identifier for the play'
            },
            user_id: {
                type: 'integer',
                description: 'ID of the user who made the play'
            },
            game_id: {
                type: 'integer',
                description: 'ID of the game that was played'
            },
            bet: {
                type: 'integer',
                description: 'Amount wagered on the play'
            },
            result: {
                type: 'boolean',
                description: 'Whether the play was a win (true) or loss (false)'
            },
            created_at: {
                type: 'string',
                format: 'date-time',
                description: 'When the play was made'
            }
        }
    },
    Game: {
        type: 'object',
        properties: {
            id: {
                type: 'integer',
                description: 'Unique identifier for the game'
            },
            name: {
                type: 'string',
                description: 'Name of the game'
            },
            description: {
                type: 'string',
                description: 'Description of how to play the game'
            }
        }
    }
}; 