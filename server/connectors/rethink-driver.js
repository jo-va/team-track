import rethinkdbdash from 'rethinkdbdash';
import { parse } from 'url';

const { hostname, port, path } = parse(process.env.RETHINKDB_URL);

const config = {
    host: hostname,
    port,
    db: path.slice(1)
};

let driver = null;

export const getRethink = () => {
    if (!driver) {
        driver = rethinkdbdash(config);
    }
    return driver;
};

export default getRethink;
