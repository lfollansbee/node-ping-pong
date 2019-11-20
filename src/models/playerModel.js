import { Schema, model } from 'mongoose';

export const playerSchema = new Schema({
    name: {
        type: String,
        require: 'Please enter a name',
        uppercase: true,
    },
    matches_won: { type: Number, require: true, default: 0, min: 0 },
    // matches_lost: Number,
    // consecutive_wins: Number,
    // consecutive_losses: Number,
    // games_won: Number,
    // games_lost: Number,
    matches: [{
        type: Schema.Types.ObjectId,
        ref: 'Match',
    }],
    last_played: {
        type: Date,
    },
});

export const Player = model('Player', playerSchema);