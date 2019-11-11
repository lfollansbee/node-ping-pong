import app from './index.js';
import { connect, connection } from 'mongoose';

var port = process.env.PORT || 8080;

app.listen(port, function () {
  console.log('Running Node-CRUD on port ' + port);
});

var db = connection;

if (!db)
    console.log('Error connecting db');
else
    console.log('Db connected successfully');

// Connect to Mongoose and set connection variable
connect('mongodb://localhost/ping-pong', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });