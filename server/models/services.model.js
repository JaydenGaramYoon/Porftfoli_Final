import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: 'Service title is required'
    },
    category: {
        type: String,
        trim: true,
        required: 'Service category is required'
    },
    services: [{
        type: String,
        trim: true,
        required: 'Service item is required'
    }],
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    }
}, {
    collection: 'services'
});

export default mongoose.model('Service', ServiceSchema);
