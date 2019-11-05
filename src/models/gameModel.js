import { Schema, model } from 'mongoose';

export const gameSchema = new Schema({
  player1: {type: Object, ref: 'PlayerSchema'},
  player2: {type: Object, ref: 'PlayerSchema'},
  player1_score: Number,
  player2_score: Number,
});

export const Game = model('Game', gameSchema);

// export function getGames(callback, limit = null) {
//   Game.find(callback).limit(limit);
// }