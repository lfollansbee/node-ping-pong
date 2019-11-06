import { Schema, model } from 'mongoose';

export const gameSchema = new Schema({
  player1_id: {
    type: Schema.Types.ObjectId,
    ref: 'Player',
  },
  player2_id: {
    type: Schema.Types.ObjectId,
    ref: 'Player',
  },
  player1_score: Number,
  player2_score: Number,
  match_id: {
    type: Schema.Types.ObjectId,
    ref: 'Match',
  },
});

export const Game = model('Game', gameSchema);