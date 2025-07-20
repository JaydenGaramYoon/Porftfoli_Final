import mongoose from 'mongoose'

const ContactSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    first_name: {
        type: String,
        trim: true,
        required: 'First name is required'
    },
    last_name: {
        type: String,
        trim: true,
        required: 'Last name is required'
    },
    email_address: {
        type: String,
        trim: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        required: 'Email is required'
    },
    contact_number: {
        type: String,
        trim: true,
        required: 'Contact number is required'
    },
    message: {
        type: String,
        trim: true,
        required: 'Message is required'
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Contact', ContactSchema);


