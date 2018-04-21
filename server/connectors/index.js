import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import crypto from 'crypto';

mongoose.Promise = global.Promise;

const generateSecret = () => crypto.randomBytes(4).toString('hex');

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
    secret: {
        type: String,
        default: generateSecret,
        unique: true
    },
    increments: [{
        type: Number,
        default: 0,
        min: 0
    }]
});

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
    },
    increments: [{
        type: Number,
        default: 0,
        min: 0
    }]
});

userSchema.plugin(uniqueValidator);

export const User = mongoose.model('User', userSchema);
export const Participant = mongoose.model('Participant', participantSchema);
export const Group = mongoose.model('Group', groupSchema);
export const Event = mongoose.model('Event', eventSchema);

console.log(`Connecting to ${process.env.DATABASE_URL}`)
export const MongooseConnection = mongoose.connect(process.env.DATABASE_URL, {
        socketTimeoutMS: 0,
        keepAlive: true,
        reconnectTries: 30
    })
    .then(client => {
        console.log('> Connected to database');
    })
    .catch((connectError) => {
        console.error('Could not connect to MongoDB', connectError);
    });
