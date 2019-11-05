import { Player } from '../models/playerModel';
import { Match } from '../models/matchModel';
import { Game } from '../models/gameModel';

// CREATE


// Handle submit game
// export const newGame = (req, res) => {
//   let game = new Game();
//   game.player1_id = req.body.player1_id;
//   game.player2_id = req.body.player2_id;
//   game.player1_score = req.body.player1_score;
//   game.player2_score = req.body.player2_score;

//   // save game
//   game.save((err) => {
//     if (err)
//       res.json(err);
//   });

//   Match.findById(req.params.match_id, function(err, game) {
//     if (err) res.send(err);

//     if (player1_score > player2_score) {
//       match.player1_games_won++
//     }
//     if (player2_score > player1_score) {
//       match.player2_games_won++
//     }

//     match.games.push(game._id);
//     match.save(done);

//     res.json({
//       message: 'Game Submitted!',
//       data: {game: game, match: match}
//     });
//   })
// };


// // Handle view contact info
// export function view(req, res) {
//   Contact.findById(req.params.contact_id, function (err, contact) {
//     if (err)
//       res.send(err);
//     res.json({
//       message: 'Contact details loading..',
//       data: contact
//     });
//   });
// }

// Handle update contact info
// export function update(req, res) {
//   Contact.findById(req.params.contact_id, function (err, contact) {
//     if (err)
//       res.send(err);
//     contact.name = req.body.name ? req.body.name : contact.name;
//     contact.gender = req.body.gender;
//     contact.email = req.body.email;
//     contact.phone = req.body.phone;
//     // save the contact and check for errors
//     contact.save(function (err) {
//       if (err)
//         res.json(err);
//       res.json({
//         message: 'Contact Info updated',
//         data: contact
//       });
//     });
//   });
// }

// // Handle delete contact
// const _delete = function (req, res) {
//   Contact.remove({
//     _id: req.params.contact_id
//   }, function (err, contact) {
//     if (err)
//       res.send(err);
//     res.json({
//       status: "success",
//       message: 'Contact deleted'
//     });
//   });
// };
// export { _delete as delete };