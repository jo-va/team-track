import crypto from 'crypto';
import mongoose from './mongoose';

const generateSecret = () => crypto.randomBytes(4).toString('hex');

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    distance: {
        type: Number,
        default: 0,
        min: 0
    },
    eventDistanceIncrement: {
        type: Number,
        default: 0,
        min: 0
    },    
    secret: {
        type: String,
        default: generateSecret,
        unique: true
    }
});

export default groupSchema;
