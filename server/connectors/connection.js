import r from 'rethinkdb';

let connection = null;

const tables = ['users', 'participants', 'groups', 'events'];

export const getRethink = () => {
    if (connection) {
        return Promise.resolve(connection);
    } else {
        return new Promise((resolve, reject) => {
            r.connect({ host: process.env.DB_HOST, port: process.env.DB_PORT }, function(err, conn) {
                if (err) {
                    reject(err);
                }
                connection = conn;

                // Create the DB if needed
                r.dbList().contains(process.env.DB_NAME).do((db_exists) => {
                    return r.branch(db_exists, { db_created: 0 }, r.dbCreate(process.env.DB_NAME));
                }).run(conn);

                // Create the tables
                r(tables)
                    .difference(r.db(process.env.DB_NAME).tableList())
                    .forEach(table => r.db(process.env.DB_NAME).tableCreate(table))
                    .run(conn);

                console.log('> Connected to DB');

                resolve(conn);
            });
        });
    }
};

export default getDB;
