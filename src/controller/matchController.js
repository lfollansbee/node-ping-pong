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
  await Player.updateMany({$or: [{_id: req.body.player1_id}, {_id: req.body.player2_id}]}, {$push: {matches: new_match._id}});

  return Match.findById(new_match._id, function (err, match) {
    if (err)
      res.send(err);
    res.json({
      data: match
    });
  });
}

// READ
export function viewMatches(req, res) {
  Match.find(function (err, matches) {
    if (err) {
      res.json({
        status: "error",
        message: err,
      });
    }

    res.json({
      status: "success",
      message: "Matches retrieved successfully",
      _total: matches.length,
      data: matches
    });
  });
}

export function viewMatch(req, res) {
  Match.findById(req.params.match_id, function (err, match) {
    if (err)
      res.send(err);
    res.json({
      data: match
    });
  });
}

// UPDATE
export async function updateMatch(match_id) {
  let match = await Match.findById(match_id);
  // Add match to players' matches array

  await Player.updateMany({$or: [{_id: req.body.player1_id}, {_id: req.body.player2_id}]}, {$push: {matches: new_match._id}});

  return Match.findById(new_match._id, function (err, match) {
    if (err)
      res.send(err);
    res.json({
      data: match
    });
  });
}

// DELETE
export const deleteMatch = (req, res) => {
  Match.deleteOne({
    _id: req.params.match_id
  }, function (err, match) {
    if (err)
      res.send(err);
    res.json({
      status: "success",
      message: 'Match deleted'
    });
  });
};
