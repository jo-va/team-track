import rethinkdbdash from 'rethinkdbdash';

const config = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    db: process.env.DB_NAME
};

let driver = null;

export const getRethink = () => {
    if (!driver) {
        driver = rethinkdbdash(config);
    }
    return driver;
};

export default getRethink;
