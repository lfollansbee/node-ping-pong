import { Match } from '../models/matchModel';
import { Game } from '../models/gameModel';
import { notFoundError } from '../utils/errorHandling';

// CREATE
export async function newGame(req, res) {
  let game = await new Game({
    player1_score: req.body.player1_score,
    player2_score: req.body.player2_score,
    match_id: req.params.match_id,
  }).save();

  const winner = req.body.player1_score > req.body.player2_score ? { player1_games_won: 1 } : { player2_games_won: 1 };
  await Match.findByIdAndUpdate(req.params.match_id, { $push: { games: game._id }, $inc: winner });

  return Match.findById(req.params.match_id, function (err, match) {
    if (err)
      res.send(err);
    res.status(201).json({
      status: 'Success',
      message: 'Game submitted successfully',
      data: {
        game: game,
        player1_games_won: match.player1_games_won,
        player2_games_won: match.player2_games_won,
      },
    });
  });
}

// READ
export function viewGames(req, res) {
  Game.find(function (err, games) {
    if (err) {
      res.json({
        status: 'Error',
        message: err,
      });
    }

    res.json({
      status: 'Success',
      message: 'Games retrieved successfully',
      total: games.length,
      games,
    });
  });
}
export function viewGamesByMatch(req, res) {
  Game.find({ match_id: req.params.match_id }, function (err, games) {
    if (err) {
      res.json({
        status: 'Error',
        message: err,
      });
    }

    res.json({
      status: 'Success',
      message: 'Games retrieved successfully',
      total: games.length,
      games,
    });
  });
}

export function viewGame(req, res) {
  Game.findById(req.params.game_id, function (err, game) {
    if (err)
      return notFoundError(res, err, 'Game not found');
    res.json({
      status: 'Success',
      game,
    });
  });
}

// UPDATE
export async function editGame(req, res) {
  let game;
  try {
    game = await Game.findById(req.params.game_id);
  } catch (err) {
    return notFoundError(res, err, `No Game found with game_id: ${req.params.game_id}`);
  }

  let match_id = game.match_id;
  let updated_game;

  if (game.player1_score !== req.body.player1_score || game.player2_score !== req.body.player2_score) {
    let original_winner = game.player1_score > game.player2_score ? 1 : 2;
    let current_winner = req.body.player1_score > req.body.player2_score ? 1 : 2;

    // Update the score
    let game_update = { $set: { player1_score: req.body.player1_score, player2_score: req.body.player2_score } };
    updated_game = await Game.findByIdAndUpdate(req.params.game_id, game_update, { new: true });

    // If the winner has changed
    if (original_winner !== current_winner) {
      // Update the match score
      // If p1 is current winner, increment their games won and decrement p2's games won & vice versa
      const match_update = current_winner === 1 ?
        { player1_games_won: 1, player2_games_won: -1 } : { player2_games_won: 1, player1_games_won: -1 };

      await Match.findOneAndUpdate({ _id: match_id }, { $inc: match_update }, { new: true });
    }
  }

  return Match.findById(match_id, function (err, match) {
    if (err)
      res.send(err);
    res.json({
      status: 'Success',
      message: 'Game updated successfully',
      game: updated_game || game,
      player1_games_won: match.player1_games_won,
      player2_games_won: match.player2_games_won,
    });
  });
}

// DELETE
export async function deleteGame(req, res) {
  const game_id = req.params.game_id;
  let game = await Game.findById(game_id);

  const match_score_update = game.player1_score > game.player2_score ? { player1_games_won: -1 } : { player2_games_won: -1 };

  // Remove game_id from match's games array
  await Match.findByIdAndUpdate(game.match_id,
    { $pull: { games: game_id }, $inc: match_score_update });

  return Game.deleteOne({
    _id: game_id,
  }, function (err) {
    if (err)
      res.send(err);
    res.json({
      status: 'Success',
      message: 'Game deleted',
    });
  });
}
