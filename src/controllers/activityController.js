import { Match } from '../models/matchModel';
import { Player } from '../models/playerModel';

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
  });
};

export async function getActivityByPlayer(req, res) {
  const player = await Player.findById(req.query.player_id);

  let matches = [];
  for (let match_id of player.matches) {
    let match = await Match.findById(match_id);
    matches.push(match);
  }

  return res.json({
    status: 'Success',
    message: 'Player activity retrieved successfully',
    activity: getActivityFromMatches(matches),
  });
}

const getActivityFromMatches = (matchesList) => {
  return matchesList.filter(match => match.activity !== undefined).map(matchWithAct => matchWithAct.activity);
};