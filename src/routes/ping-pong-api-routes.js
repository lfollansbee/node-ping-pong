import * as playerController from '../controller/playerController';
import * as matchController from '../controller/matchController';
import * as gameController from '../controller/gameController';
import express from 'express';
let router = express.Router();

router.get('/', function (req, res) {
  res.json({
    status: 'API is Working',
    message: 'Welcome to Ping-Pong',
  });
});

router.route('/players')
  .get(playerController.viewPlayers)
  .post(playerController.newPlayer);

router.route('/player/:player_id')
  .get(playerController.viewPlayer)
  .delete(playerController.deletePlayer);

router.route('/matches')
  .get(matchController.viewMatches)
  .post(matchController.newMatch);

router.route('/match/:match_id')
  .get(matchController.viewMatch)
  .delete(matchController.deleteMatch);

export default router;



// Create new match, creates match with 2 player ids and adds match id to players' matches
// Submit match, adds final game to array, updates winner player "matches_won" property
// Delete match, deletes match, games in that match, and removes match_id from players' matches array


// Create new game, creates game with 2 player ids and adds match id to players' matches
// Submit game, adds game to matches array