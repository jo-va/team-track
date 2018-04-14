import { User, Group, Event } from '../models';

export const Query = {
    me: (root, args, { user }) => {
        return user;
    },
    user: (root, { id }) => {
        return User.findById(id);
    },
    users: () => {
        return User.findAll();
    },
    group: (root, { id }) => {
        return Group.findById(id);
    },
    groups: () => {
        return Group.findAll();
    },
    event: (root, { id }) => {
        return Event.findById(id);
    },
    events: () => {
        return Event.findAll();
    }
};
