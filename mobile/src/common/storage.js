import Realm from 'realm';

// This is a key/value wrapper around Realm because AsyncStorage
// had serious issues while debugging
// see https://github.com/facebook/react-native/issues/12830

// Downgraded Ream from 2.3.3 to 2.2.8 to solve 'Subscription is not defined' issue
// see https://github.com/realm/realm-js/issues/1711

// Using the single instance pattern
// see https://k94n.com/es6-modules-single-instance-pattern

const KeyValueItem = {
    name: 'KeyValueItem',
    primaryKey: 'key',
    schemaVersion: 1,
    properties: {
        key: { type: 'string' },
        value: { type: 'string' }
    }
};

class Storage {
    constructor() {
        this.realm = new Realm({
            schema: [KeyValueItem],
            schemaVersion: 1
        });
    }

    get(key) {
        return new Promise((resolve, reject) => {
            const result = this.realm.objects('KeyValueItem').filtered(`key = "${key}"`);
            resolve(result && result[0] ? result[0].value : null);
        });
    }
    
    set(key, value) {
        return new Promise((resolve, reject) => {
            try {
                this.realm.write(() => {
                    this.realm.create('KeyValueItem', { key, value }, true);
                });
                resolve();
            } catch (err) {
                reject(err);
            }
        })
    }
    
    remove(key) {
        return new Promise((resolve, reject) => {
            try {
                this.realm.write(() => {
                    const object = this.realm.objects('KeyValueItem').filtered(`key = "${key}"`);
                    this.realm.delete(object);
                });
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }
}

export let storage = new Storage();
