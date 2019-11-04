'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _mongoose = require('mongoose');

var _apiRoutes = require('./src/routes/api-routes');

var _apiRoutes2 = _interopRequireDefault(_apiRoutes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Initialise the app
var app = (0, _express2.default)();

// Configure bodyparser to handle post requests
app.use((0, _bodyParser.urlencoded)({
    extended: true
}));
app.use((0, _bodyParser.json)());

// Connect to Mongoose and set connection variable
(0, _mongoose.connect)('mongodb://localhost/node-crud', { useNewUrlParser: true, useUnifiedTopology: true });

var db = _mongoose.connection;

if (!db) console.log("Error connecting db");else console.log("Db connected successfully");

var port = process.env.PORT || 8080;
app.get('/', function (req, res) {
    return res.send('Hello World with Express');
});

// Use Api routes in the App
app.use('/api', _apiRoutes2.default);

app.listen(port, function () {
    console.log("Running Node-CRUD on port " + port);
});