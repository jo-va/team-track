import mongodb from 'mongodb';
import mongoose from './mongoose';
import userSchema from './user.schema';
import participantSchema from './participant.schema';
import groupSchema from './group.schema';
import eventSchema from './event.schema';

export const User = mongoose.model('User', userSchema);
export const Participant = mongoose.model('Participant', participantSchema);
export const Group = mongoose.model('Group', groupSchema);
export const Event = mongoose.model('Event', eventSchema);

export const MongooseConnection = mongoose.connect(process.env.DATABASE_URL)
    .then(client => {
        console.log('> Connected to database');
    })
    .catch((connectError) => {
        console.error('Could not connect to MongoDB', connectError);
    });

export const MongoDBConnection = mongodb.MongoClient.connect(process.env.DATABASE_URL).then(client => {
    return client.db(process.env.DB_NAME);
});
