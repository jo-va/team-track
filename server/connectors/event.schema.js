import mongoose from './mongoose';

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    latitude: {
        type: Number,
        default: 0
    },
    longitude: {
        type: Number,
        default: 0
    },
    radius: {
        type: Number,
        default: 500,
        min: 0
    },
    distance: {
        type: Number,
        default: 0,
        min: 0
    },
    state: {
        type: String,
        default: 'inactive',
        enum: ['active', 'inactive']
    }
});

export default eventSchema;
