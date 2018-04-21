import uniqueValidator from 'mongoose-unique-validator';
import mongoose from './mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        default: null
    },
    version: {
        type: Number,
        default: 1
    },
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        default: null
    }]
});

userSchema.plugin(uniqueValidator);

export default userSchema;
