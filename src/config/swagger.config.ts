import { Options } from 'swagger-jsdoc';

const swaggerDefinition: Options['swaggerDefinition'] = {
  openapi: '3.0.0',
  info: {
    title: 'MS-Mail Service API',
    version: '1.0.0',
    description: 'Microservicio para envío de correos con Node.js + Express + TypeScript',
  },
  servers: [
    {
      url: 'http://localhost:'+process.env.PORT || '3000', 
      description: 'Servidor local',
    },
  ],
  components: {
    securitySchemes: {
    },
    schemas: {
    },
  },
};
const swaggerOptions: Options = {
  swaggerDefinition,
  apis: [
    './src/controllers/*.ts',
    './src/dto/*.ts',
  ],
};

export default swaggerOptions;
