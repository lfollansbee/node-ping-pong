import { Schema, model } from 'mongoose';

export const playerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    matches_won: Number,
    // matches_lost: Number,
    // consecutive_wins: Number,
    // consecutive_losses: Number,
    games_won: Number,
    games_lost: Number,
    matches: [{
        type: Schema.Types.ObjectId,
        ref: 'Match'
    }],
});

export const Player = model('Player', playerSchema);