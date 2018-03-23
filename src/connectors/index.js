import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import crypto from 'crypto';

mongoose.Promise = global.Promise;

const generateSecret = () => crypto.randomBytes(4).toString('hex');

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		trim: true
	},
	avatar: {
		type: String,
	},
	roles: {
		type: [String]
	}
});

const ParticipantSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	groupId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Group'
	},
	distance: {
		type: Number,
		default: 0,
		min: 0
	},
	timestamp: {
		type: Number,
		default: Date.now
	},
	longitude: {
		type: Number,
		required: true
	},
	latitude: {
		type: Number,
		required: true
	}
});

const GroupSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		trim: true
	},
	eventId: {
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
		unique: [true, 'Name must be unique'],
		trim: true
	},
	date: {
		type: Date,
		default: Date.now
	},
	distance: {
		type: Number,
		default: 0,
		min: 0
	},
	active: {
		type: String,
		enum: ['active', 'inactive']
	}
});

UserSchema.plugin(uniqueValidator);
ParticipantSchema.plugin(uniqueValidator);
GroupSchema.plugin(uniqueValidator);
EventSchema.plugin(uniqueValidator);

export const User = mongoose.model('User', UserSchema);
export const Participant = mongoose.model('Geodata', ParticipantSchema);
export const Group = mongoose.model('Group', GroupSchema);
export const Event = mongoose.model('Event', EventSchema);

export const MongooseConnection = mongoose.connect(process.env.MONGODB_URI)
	.catch((connectError) => {
		console.error('Could not connect to MongoDB', connectError);
	});
