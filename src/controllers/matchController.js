import { Player } from '../models/playerModel';
import { Match } from '../models/matchModel';
import { Game } from '../models/gameModel';
import { notFoundError } from '../utils/errorHandling';

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
      return notFoundError(res, err);
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
    if (err) {
      return notFoundError(res, err);
    }
    res.json({
      status: 'Success',
      match,
    });
  });
}

// UPDATE
export async function endMatch(req, res) {
  let match;
  try {
    match = await Match.findById(req.params.match_id);
  } catch (err) {
    return notFoundError(res, err);
  }

  if (!match.games.length) {
    return res.status(405).json({
      status: 'Method not allowed',
      message: 'This match has no games.  Cannot submit a match without a game score.',
    });
  }

  let winning_player, losing_player;
  if (match.player1_games_won > match.player2_games_won) {
    winning_player = 'player1';
    losing_player = 'player2';
  } else {
    winning_player = 'player2';
    losing_player = 'player1';
  }

  const date = match.date;
  const winner_id = match[`${winning_player}_id`];
  const loser_id = match[`${losing_player}_id`];

  let winner = await Player.findByIdAndUpdate(winner_id, { $inc: { matches_won: 1 }, $set: { last_played: date } }, { new: true });
  let loser = await Player.findByIdAndUpdate(loser_id, { $set: { last_played: date } }, { new: true });

  await Match.findByIdAndUpdate(req.params.match_id, {
    $set: {
      activity: `${winner.name} beat ${loser.name}: ${match[`${winning_player}_games_won`]}-${match[`${losing_player}_games_won`]}`,
    },
  }, { new: true });

  return Match.findById(req.params.match_id, function (err, newMatch) {
    if (err)
      res.send(err);
    res.json({
      status: 'Success',
      message: 'Match completed',
      winner,
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

  // Decrement matches_won from players who won the match
  const winner_id = match.player1_games_won > match.player2_games_won ? match.player1_id : match.player2_id;
  await Player.findByIdAndUpdate(winner_id, { $inc: { matches_won: -1 } }, { new: true });

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
