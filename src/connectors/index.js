import mongoose from 'mongoose';

mongoose.Promise = global.Promise;

const currentDate = () => Date.now();

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	avatar: String,
	groupId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Group'
	},
	distance: {
		type: Number,
		default: 0
	}
});

const GroupSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	eventId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Event',
		required: true
	},
	distance: {
		type: Number,
		default: 0
	},
	secretToken: {
		type: String,
		default: 'SECRET'
	}
});

const EventSchema = new mongoose.Schema({
	name: String,
	date: {
		type: Date,
		default: currentDate
	},
	distance: {
		type: Number,
		default: 0
	}
});

const GeodataSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	groupId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Group',
		required: true
	},
	timestamp: {
		type: Number,
		default: currentDate
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

export const User = mongoose.model('User', UserSchema);
export const Group = mongoose.model('Group', GroupSchema);
export const Event = mongoose.model('Event', EventSchema);
export const Geodata = mongoose.model('Geodata', GeodataSchema);

export const MongooseConnection = mongoose.connect(process.env.MONGODB_URI)
	.catch((connectError) => {
		console.error('Could not connect to MongoDB on port 27017', connectError);
	});
