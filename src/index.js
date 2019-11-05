import express from 'express';
import { urlencoded, json } from 'body-parser';
import { connect, connection } from 'mongoose';
import pingPongApiRoutes from "./routes/ping-pong-api-routes";

// Initialise the app
let app = express();

// Configure bodyparser to handle post requests
app.use(urlencoded({
    extended: true
}));
app.use(json());

// Connect to Mongoose and set connection variable
connect('mongodb://localhost/node-crud', { useNewUrlParser: true,  useUnifiedTopology: true});

var db = connection;

if(!db)
    console.log("Error connecting db")
else
    console.log("Db connected successfully")

var port = process.env.PORT || 8080;
app.get('/', (req, res) => res.send('Hello World with Express'));

// Use Api routes in the App
app.use('/ping-pong', pingPongApiRoutes);

app.listen(port, function () {
    console.log("Running Node-CRUD on port " + port);
});