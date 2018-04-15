import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import crypto from 'crypto';

mongoose.Promise = global.Promise;

const generateSecret = () => crypto.randomBytes(4).toString('hex');

const UserSchema = new mongoose.Schema({
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
    isAdmin: {
        type: Boolean,
        default: false
    },
    version: {
        type: Number,
        default: 1
    }
});

const ParticipantSchema = new mongoose.Schema({
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

const GroupSchema = new mongoose.Schema({
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
    secret: {
        type: String,
        default: generateSecret,
        unique: true
    }
});

const EventSchema = new mongoose.Schema({
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

UserSchema.plugin(uniqueValidator);
GroupSchema.plugin(uniqueValidator);

export const User = mongoose.model('User', UserSchema);
export const Participant = mongoose.model('Participant', ParticipantSchema);
export const Group = mongoose.model('Group', GroupSchema);
export const Event = mongoose.model('Event', EventSchema);

export const MongooseConnection = mongoose.connect(process.env.DATABASE_URL)
    .catch((connectError) => {
        console.error('Could not connect to MongoDB', connectError);
    });
