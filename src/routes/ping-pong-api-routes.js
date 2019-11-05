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

router.route('/games')
  .get(gameController.viewGames);

router.route('/game/:game_id')
  .get(gameController.viewGame)
  .put(gameController.editGame);

router.route('/game/:match_id')
  .post(gameController.newGame);

export default router;
