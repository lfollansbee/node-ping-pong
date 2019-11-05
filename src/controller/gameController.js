import { Player } from '../models/playerModel';
import { Match } from '../models/matchModel';
import { Game } from '../models/gameModel';

// CREATE
export async function newGame(req, res) {
  let game = await new Game({
    player1_id: req.body.player1_id,
    player2_id: req.body.player2_id,
    player1_score: req.body.player1_score,
    player2_score: req.body.player2_score,
    match_id: req.params.match_id,
  }).save();

  const winner = req.body.player1_score > req.body.player2_score ? { player1_games_won: 1 } : { player2_games_won: 1 };

  await Match.findOneAndUpdate({ _id: req.params.match_id },
    { $push: { games: game._id }, $inc: winner }
  );

  // let p1_record = req.body.player1_score > req.body.player2_score ? { games_won: 1 } : { games_lost: 1 };
  // let p2_record = req.body.player2_score > req.body.player1_score ? { games_won: 1 } : { games_lost: 1 };

  // await Player.findOneAndUpdate({ _id: req.body.player1_id }, { $inc: p1_record });
  // await Player.findOneAndUpdate({ _id: req.body.player2_id }, { $inc: p2_record });

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

// UPDATE
export async function editGame(req, res) {
  let game = await Game.findById(req.params.game_id);
  let match_id = game.match_id;

  if (game.player1_score !== req.body.player1_score || game.player2_score !== req.body.player2_score) {
    let original_winner = game.player1_score > game.player2_score ? 1 : 2;
    let current_winner = req.body.player1_score > req.body.player2_score ? 1 : 2;

    // Update the score
    let game_update = { $set: { player1_score: req.body.player1_score, player2_score: req.body.player2_score, } }
    await Game.findByIdAndUpdate(req.params.game_id, game_update)

    // If the winner has changed
    if (original_winner !== current_winner) {
      // Update the match score
      // If p1 is current winner, increment their games won and decrement p2's games won & vice versa
      const updateMatch = current_winner === 1 ?
        { player1_games_won: 1, player2_games_won: -1 } : { player2_games_won: 1, player1_games_won: -1 }
      await Match.findOneAndUpdate({ _id: match_id }, { $inc: updateMatch });
    }
  }

  return Match.findById(match_id, function (err, match) {
    if (err)
      res.send(err);
    res.json({
      status: "Success",
      message: "Game updated successfully",
      data: {
        game: game,
        player1_games_won: match.player1_games_won,
        player2_games_won: match.player2_games_won,
      }
    });
  });
};