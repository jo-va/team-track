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
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        default: null
    },
    avatar: {
        type: String,
        default: null
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

const ParticipantSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
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
    }
});

const GroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
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
    secretToken: {
        type: String,
        default: generateSecret,
        unique: true
    }
});

const EventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    latitude: {
        type: Number
    },
    longitude: {
        type: Number
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
ParticipantSchema.plugin(uniqueValidator);
GroupSchema.plugin(uniqueValidator);
EventSchema.plugin(uniqueValidator);

export const User = mongoose.model('User', UserSchema);
export const Participant = mongoose.model('Participant', ParticipantSchema);
export const Group = mongoose.model('Group', GroupSchema);
export const Event = mongoose.model('Event', EventSchema);

export const MongooseConnection = mongoose.connect(process.env.DATABASE_URL)
    .catch((connectError) => {
        console.error('Could not connect to MongoDB', connectError);
    });
