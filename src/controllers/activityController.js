import { Match } from '../models/matchModel';

// READ
export async function getActivity(req, res) {
  if (req.query.player_id) {
    return getActivityByPlayer(req, res);
  }
  return getAllActivity(req, res);
}

export const getAllActivity = (req, res) => {
  Match.find(function (err, matches) {
    if (err) {
      res.json({
        status: 'error',
        message: err,
      });
    }
    res.json({
      status: 'Success',
      message: 'Activity retrieved successfully',
      activity: getActivityFromMatches(matches),
    });
  }).sort({ date: -1 });
};

export async function getActivityByPlayer(req, res) {
  const matches = await Match.find({
    $or: [
      { player1_id: req.query.player_id },
      { player2_id: req.query.player_id },
    ]
  }).sort({ date: -1 });

  return res.json({
    status: 'Success',
    message: 'Player activity retrieved successfully',
    activity: getActivityFromMatches(matches),
  });
}

const getActivityFromMatches = (matchesList) => {
  return matchesList
    .filter(match => match.activity !== undefined)
    .map(matchWithActivity => {
      return {
        result: matchWithActivity.activity,
        date: matchWithActivity.date,
      };
    });
};