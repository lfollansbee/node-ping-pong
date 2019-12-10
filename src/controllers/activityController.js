import { Match } from '../models/matchModel';
import { Game } from '../models/gameModel';

// READ
export async function getActivity(req, res) {
  if (req.query.player_id) {
    return getActivityByPlayer(req, res);
  }
  return getAllActivity(req, res);
}

export async function getAllActivity(req, res) {
  try {
    const matches = await Match.find().sort({ date: -1 });
    const activity = await getActivityFromMatches(matches);

    res.json({
      status: 'Success',
      message: 'Activity retrieved successfully',
      activity,
    });

  } catch (err) {
    res.json({
      status: 'error',
      message: err,
    });
  }
}

export async function getActivityByPlayer(req, res) {
  try {
    const matches = await Match.find({
      $or: [
        { player1_id: req.query.player_id },
        { player2_id: req.query.player_id },
      ],
    }).sort({ date: -1 });

    const activity = await getActivityFromMatches(matches);

    return res.json({
      status: 'Success',
      message: 'Player activity retrieved successfully',
      activity,
    });
  } catch (err) {
    res.json({
      status: 'error',
      message: err,
    });
  }
}

async function getActivityFromMatches(matchesList) {
  return await Promise.all(matchesList
    .filter(match => match.activity !== undefined)
    .map(async (matchWithActivity) => {
      const games = await getGameScores(matchWithActivity);

      return {
        match_id: matchWithActivity._id,
        result: matchWithActivity.activity,
        date: matchWithActivity.date,
        winner_id: getWinnerId(matchWithActivity),
        game_scores: games,
      };
    }));
}

const getWinnerId = (match) => {
  if (match.player1_games_won === match.player2_games_won) {
    return null;
  }
  return match.player1_games_won > match.player2_games_won ? match.player1_id : match.player2_id;
};

const getPlaces = (match) => {
  if (match.player1_games_won === match.player2_games_won) {
    return null;
  }
  return {
    winner: match.player1_games_won > match.player2_games_won ? 'player1' : 'player2',
    loser: match.player1_games_won > match.player2_games_won ? 'player2' : 'player1',
  };
};

async function getGameScores(match) {
  const matchPlaces = getPlaces(match);
  const games = await Game.find({ match_id: match._id }).sort({ date: 1 }); // sorted oldest to newest

  return games.map(game => {
    return {
      match_winner: game[`${matchPlaces.winner}_score`],
      match_loser: game[`${matchPlaces.loser}_score`],
    };
  });
}