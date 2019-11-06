import { connection, connect, disconnect } from 'mongoose';
// Load models since we will not be instantiating our express server.
import '../models/gameModel';
import '../models/matchModel';
import '../models/playerModel';

beforeEach(function(done) {
  /*
    Define clearDB function that will loop through all 
    the collections in our mongoose connection and drop them.
  */
  function clearDB() {
    for (var i in connection.collections) {
      connection.collections[i].remove(function() {});
    }
    return done();
  }

  /*
    If the mongoose connection is closed, 
    start it up using the test url and database name
    provided by the node runtime ENV
  */
  if (connection.readyState === 0) {
    connect(
      `mongodb://localhost:27017/${process.env.TEST_SUITE}`, // <------- IMPORTANT
      function(err) {
        if (err) {
          throw err;
        }
        return clearDB();
      },
    );
  } else {
    return clearDB();
  }
});

afterEach(function(done) {
  disconnect();
  return done();
});

afterAll(done => {
  return done();
});