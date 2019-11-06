import { Schema, model } from 'mongoose';

export const gameSchema = new Schema({
  player1_score: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  player2_score: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  match_id: {
    type: Schema.Types.ObjectId,
    ref: 'Match',
  },
});

export const Game = model('Game', gameSchema);