import { Schema, model } from 'mongoose';

var contactSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    gender: String,
    phone: String,
    create_date: {
        type: Date,
        default: Date.now
    }
});

// Export Contact model
export const Contact = model('Contact', contactSchema);

export function getContacts(callback, limit = null) {
    Contact.find(callback).limit(limit);
}