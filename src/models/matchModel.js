import { Schema, model } from 'mongoose';

export const matchSchema = new Schema({
    player1_id: {
        type: Schema.Types.ObjectId,
        ref: 'Player'
    },
    player2_id: {
        type: Schema.Types.ObjectId,
        ref: 'Player'
    },
    player1_games_won: { type: Number, required: true, default: 0, min: 0 },
    player2_games_won: { type: Number, required: true, default: 0, min: 0 },
    best_of: {type: Number, default: 3},
    games: [{
        type: Schema.Types.ObjectId,
        ref: 'Game'
    }],
    date: {
        type: Date,
        default: Date.now
    },
});

export const Match = model('Match', matchSchema);

export function getMatches(callback, limit = null) {
    Match.find(callback).limit(limit);
}