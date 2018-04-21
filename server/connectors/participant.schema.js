import mongoose from './mongoose';

const participantSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        default: null
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        default: null
    },
    distance: {
        type: Number,
        default: 0,
        min: 0
    },
    latitude: {
        type: Number,
        default: null
    },
    longitude: {
        type: Number,
        default: null
    },
    state: {
        type: String,
        default: 'inactive',
        enum: ['active', 'inactive']
    },
    version: {
        type: Number,
        default: 1
    }
});

export default participantSchema;
