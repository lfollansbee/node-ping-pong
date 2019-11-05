import { Player } from '../models/playerModel';
import { Match } from '../models/matchModel';
import { Game } from '../models/gameModel';
import updateMatch from './matchController';

// CREATE
export async function newGame(req, res) {
  let game = await new Game({
    player1_id: req.body.player1_id,
    player2_id: req.body.player2_id,
    player1_score: req.body.player1_score,
    player2_score: req.body.player2_score,
    match_id: req.params.match_id,
  }).save();

  const winner = req.body.player1_score > req.body.player2_score ? { player1_games_won: 1 } : { player2_games_won: 1 }

  await Match.findOneAndUpdate({ _id: req.params.match_id },
    { $push: { games: game._id }, $inc: winner }
  );

  return Match.findById(req.params.match_id, function (err, match) {
    if (err)
      res.send(err);
    res.json({
      status: "Success",
      message: "Game submitted successfully",
      data: {
        game: game,
        best_of: match.best_of,
        player1_games_won: match.player1_games_won,
        player2_games_won: match.player2_games_won,
      }
    });
  });

};

// READ
export function viewGames(req, res) {
  Game.find(function (err, games) {
    if (err) {
      res.json({
        status: "Error",
        message: err,
      });
    }

    res.json({
      status: "Success",
      message: "Games retrieved successfully",
      total: games.length,
      data: games
    });
  });
}

export function viewGame(req, res) {
  Game.findById(req.params.game_id, function (err, game) {
    if (err)
      res.send(err);
    res.json({
      data: game
    });
  });
}