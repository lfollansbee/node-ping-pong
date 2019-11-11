import { Player } from '../models/playerModel';

// CREATE
export const newPlayer = (req, res) => {
  let player = new Player({name: req.body.name});
  // save the player and check for errors
  player.save((err) => {
    if (err)
      res.json(err);

    res.status(201).json({
      status: 'Success',
      message: 'New player created!',
      data: player,
    });
  });
};

// READ
export const viewPlayers = (req, res) => {
  Player.find(function (err, players) {
    if (err) {
      res.json({
        status: 'error',
        message: err,
      });
    }

    res.json({
      status: 'Success',
      message: 'Players retrieved successfully',
      total: players && players.length ? players.length : 0,
      data: players,
    });
  });
};

export const viewPlayer = (req, res) => {
  Player.findById(req.params.player_id, function (err, player) {
    if (err)
      res.send(err);
    res.json({
      status: 'Success',
      data: player,
    });
  });
};

// DELETE
export const deletePlayer = (req, res) => {
  Player.deleteOne({
    _id: req.params.player_id,
  }, function (err) {
    if (err)
      res.send(err);
    res.status(202).json({
      status: 'Success',
      message: 'Player deleted',
    });
  });
};