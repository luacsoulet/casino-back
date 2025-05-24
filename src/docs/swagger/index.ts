import { authSwagger } from './auth.swagger';
import { playsSwagger } from './plays.swagger';
import { gamesSwagger } from './games.swagger';
import { adminSwagger } from './admin.swagger';
import { usersSwagger } from './users.swagger';
import { schemasSwagger } from './schemas.swagger';
import { responsesSwagger } from './responses.swagger';

export const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'Casino Game API',
        version: '1.0.0',
        description: 'API pour le jeu de casino avec gestion des utilisateurs, des parties et des statistiques',
    },
    servers: [
        {
            url: 'http://localhost:4000/api',
            description: 'Serveur de développement',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
        schemas: schemasSwagger,
        responses: responsesSwagger
    },
    paths: {
        ...authSwagger,
        ...playsSwagger,
        ...gamesSwagger,
        ...adminSwagger,
        ...usersSwagger,
    },
    tags: [
        {
            name: 'Admin',
            description: 'Administration endpoints'
        },
        {
            name: 'Users',
            description: 'Users endpoints'
        },
        {
            name: 'Auth',
            description: 'Authentication endpoints'
        },
        {
            name: 'Games',
            description: 'Games endpoints'
        },
        {
            name: 'Plays',
            description: 'Plays endpoints'
        }
    ]
}; 