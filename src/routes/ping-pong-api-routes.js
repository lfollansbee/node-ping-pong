import * as playerController from '../controllers/playerController';
import * as matchController from '../controllers/matchController';
import * as gameController from '../controllers/gameController';
import * as activityController from '../controllers/activityController';
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
  .patch(playerController.deactivatePlayer)
  .delete(playerController.deletePlayer);

router.route('/matches')
  .get(matchController.viewMatches)
  .post(matchController.newMatch);

router.route('/match/:match_id')
  .get(matchController.viewMatch)
  .patch(matchController.endMatch)
  .delete(matchController.deleteMatch);

router.route('/games')
  .get(gameController.viewGames);

router.route('/game/:game_id')
  .get(gameController.viewGame)
  .patch(gameController.editGame)
  .delete(gameController.deleteGame);

router.route('/game/:match_id')
  .post(gameController.newGame);

router.route('/activity')
  .get(activityController.getActivity);

export default router;
