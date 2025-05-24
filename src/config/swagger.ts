import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerDocument } from '../docs/swagger';

const options: swaggerJsdoc.Options = {
    definition: swaggerDocument,
    apis: [],
};

export default swaggerJsdoc(options); 