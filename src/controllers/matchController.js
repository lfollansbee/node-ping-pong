import { Player } from '../models/playerModel';
import { Match } from '../models/matchModel';
import { Game } from '../models/gameModel';

// CREATE
export async function newMatch(req, res) {
  let new_match = await new Match({
    player1_id: req.body.player1_id,
    player2_id: req.body.player2_id,
    best_of: req.body.best_of ? req.body.best_of : undefined,
    date: req.body.date ? req.body.date : undefined,
  }).save();
  // Add match to players' matches array
  await Player.updateMany(
    { $or: [{ _id: req.body.player1_id }, { _id: req.body.player2_id }] },
    { $push: { matches: new_match._id } });

  return Match.findById(new_match._id, function (err, match) {
    if (err)
      res.send(err);
    res.status(201).json({
      status: 'Success',
      message: 'Match created',
      match,
    });
  });
}

// READ
export function viewMatches(req, res) {
  Match.find(function (err, matches) {
    if (err) {
      res.json({
        status: 'error',
        message: err,
      });
    }

    res.json({
      status: 'Success',
      message: 'Matches retrieved successfully',
      total: matches && matches.length ? matches.length : 0,
      matches,
    });
  });
}

export function viewMatch(req, res) {
  Match.findById(req.params.match_id, function (err, match) {
    if (err)
      res.send(err);
    res.json({
      status: 'Success',
      match,
    });
  });
}

// UPDATE
export async function endMatch(req, res) {
  let match = await Match.findById(req.params.match_id);

  let winner_id = match.player1_games_won > match.player2_games_won ? match.player1_id : match.player2_id;
  let player = await Player.findByIdAndUpdate(winner_id, { $inc: { matches_won: 1 } }, { new: true });

  return Match.findById(req.params.match_id, function (err, newMatch) {
    if (err)
      res.send(err);
    res.json({
      status: 'Success',
      message: 'Match completed',
      winner: player,
      match: newMatch,
    });
  });
}

// DELETE
export async function deleteMatch(req, res) {
  let match = await Match.findById(req.params.match_id);

  // Remove match_id from players' matches array
  await Player.updateMany(
    { $or: [{ _id: match.player1_id }, { _id: match.player2_id }] },
    { $pull: { matches: req.params.match_id } });

  await Game.deleteMany({ match_id: req.params.match_id });

  return Match.deleteOne({
    _id: req.params.match_id,
  }, function (err) {
    if (err)
      res.send(err);
    res.json({
      status: 'Success',
      message: 'Match deleted',
    });
  });
}
