import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Social Media API',
      version: '1.0.0',
      description: 'A comprehensive REST API for social media application with authentication, user management, and messaging',
      contact: {
        name: 'API Support',
        email: 'support@socialmedia.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development Server',
        variables: {
          port: {
            default: '5000'
          }
        }
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization token. Enter only the token, without the "Bearer" prefix.'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'User ID'
            },
            userName: {
              type: 'string',
              description: 'Username'
            },
            email: {
              type: 'string',
              description: 'User email address'
            },
            Phone: {
              type: 'string',
              description: 'User phone number'
            },
            profileImage: {
              type: 'string',
              description: 'Profile image URL'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Message: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Message ID'
            },
            content: {
              type: 'string',
              description: 'Message content'
            },
            userId: {
              type: 'string',
              description: 'ID of the user who sent the message'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            Error: {
              type: 'string',
              description: 'Error message'
            },
            status: {
              type: 'number',
              description: 'HTTP status code'
            }
          }
        }
      }
    }
  },
  apis: [
    path.join(__dirname, './routes/auth.route.js'),
    path.join(__dirname, './routes/user.route.js'),
    path.join(__dirname, './routes/message.route.js')
  ]
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
