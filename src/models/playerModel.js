import { Schema, model } from 'mongoose';

export const playerSchema = new Schema({
    name: {
        type: String,
        require: 'Please enter a name',
        uppercase: true,
    },
    matches_won: { 
        type: Number, 
        require: true, 
        default: 0, 
        min: 0,
    },
    matches: [{
        type: Schema.Types.ObjectId,
        ref: 'Match',
    }],
    last_played: {
        type: Date,
    },
    active: {
        type: Boolean,
        default: true,
    },
});

export const Player = model('Player', playerSchema);