import { Player } from '../models/playerModel';

// CREATE
export const newPlayer = (req, res) => {
  let player = new Player({name: req.body.name});
  // save the player and check for errors
  player.save((err) => {
    if (err)
      res.json(err);

    res.json({
      message: 'New player created!',
      data: player
    });
  });
};

// READ
export const viewPlayers = (req, res) => {
  Player.find(function (err, players) {
    if (err) {
      res.json({
        status: "error",
        message: err,
      });
    }

    res.json({
      status: "success",
      message: "Players retrieved successfully",
      data: players
    });
  });
}

export const viewPlayer = (req, res) => {
  Player.findById(req.params.player_id, function (err, player) {
    if (err)
      res.send(err);
    res.json({
      data: player
    });
  });
}

// UPDATE

// DELETE
export const deletePlayer = (req, res) => {
  Match.remove({
    _id: req.params.player_id
  }, function (err, player) {
    if (err)
      res.send(err);
    res.json({
      status: 'Success',
      message: 'Player deleted'
    });
  });
};