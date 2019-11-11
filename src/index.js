import express from 'express';
import { urlencoded, json } from 'body-parser';
import cors from 'cors';
import compression from 'compression';
import pingPongApiRoutes from './routes/ping-pong-api-routes';

// Initialise the app
let app = express();

// Configure bodyparser to handle post requests
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cors());
app.use(compression());

// Use Api routes in the App
app.use('/ping-pong', pingPongApiRoutes);

export default app;