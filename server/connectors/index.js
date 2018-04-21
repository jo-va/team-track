import mongoose from 'mongoose';
import mongodb from 'mongodb';
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
    increment: {
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

userSchema.plugin(uniqueValidator);

export const User = mongoose.model('User', userSchema);
export const Participant = mongoose.model('Participant', participantSchema);
export const Group = mongoose.model('Group', groupSchema);
export const Event = mongoose.model('Event', eventSchema);

console.log(`Connecting to ${process.env.DATABASE_URL}`)
export const MongooseConnection = mongoose.connect(process.env.DATABASE_URL)
    .then(client => {
        console.log('> Connected to database');
    })
    .catch((connectError) => {
        console.error('Could not connect to MongoDB', connectError);
    });

mongodb.MongoClient.connect(process.env.DATABASE_URL).then(client => {
    const db = client.db('tracker');

    const distance_threshold = 1;
    const pipeline = [{
        $match: { 'fullDocument.increment': { $gte: distance_threshold } }
    }];

    db.collection('groups').watch(pipeline, {
        fullDocument: 'updateLookup'
    }).on('change', data => {
        const increment = data.fullDocument.increment;
        console.log(`Incr. event distance by +${increment}`)

        Group.findByIdAndUpdate(data.fullDocument._id, { $set: { increment: 0 } }).exec();
        Event.findByIdAndUpdate(data.fullDocument.event, { $inc: { distance: increment } }).exec();

        // Send event notif
    });
});
