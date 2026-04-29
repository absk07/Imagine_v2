import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connectToDatabase from './config/db';
import routes from './routes/index';
import initLogger from './middlewares/logger';
import logger from './config/winston';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';

const app = express();

const PORT = process.env.PORT || 8080;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(initLogger(logger));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

app.get('/ping', (req: Request, res: Response) => {
    // console.log('route hit !');
    res.status(200).json({ 
        success: true,
        message: 'pong' 
    });
});

// swagger doc
const options = {
    swaggerDefinition: {
        openapi: '3.1.0',
        info: {
            title: 'Imagine API',
            version: '1.0.0',
        },
        servers: [{
            url: process.env.BASE_URL
        }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        }
    },
    apis: [path.resolve(__dirname, './docs/**/*.yaml')],
};

const swaggerSpecs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use('/api/v1', routes);

app.use((req: Request, res: Response, next: NextFunction) => {
    const error = new Error('404 Page Not Found!');
    res.status(404);
    next(error);
});

app.use((err: Error & { statusCode?: number }, req: Request, res: Response, next: NextFunction) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Internal Server Error!'
    console.log('==========================ERROR START==============================');
    console.log(err);
    console.log('==========================ERROR END==============================');
    res.status(statusCode).json({ error: true, message: err.message });
});

connectToDatabase().then(() => {
    console.log('Database connected');
    app.listen(PORT, () => {
        console.log(`Listening on port http://localhost:${PORT}`);
    });
}).catch(e => {
    console.error('Application failed to start:', e);
    process.exit(1);
})
