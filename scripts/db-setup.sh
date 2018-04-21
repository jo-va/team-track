#!/bin/bash 

mongodb1=`getent hosts ${MONGO1} | awk '{ print $1 }'`
mongodb2=`getent hosts ${MONGO2} | awk '{ print $1 }'`
mongodb3=`getent hosts ${MONGO3} | awk '{ print $1 }'`

echo "Waiting for startup.."
until mongo --host ${mongodb1}:27017 --eval 'quit(db.runCommand({ ping: 1 }).ok ? 0 : 2)' &>/dev/null; do
  printf '.'
  sleep 1
done
echo "Started.."

echo setup.sh time now: `date +"%T" `
mongo --host ${mongodb1}:27017 <<EOF
   var cfg = {
        "_id": "${RS}",
        "version": 1,
        "members": [
            {
                "_id": 0,
                "host": "${mongodb1}:27017",
                "priority": 2
            },
            {
                "_id": 1,
                "host": "${mongodb2}:27017",
                "priority": 0
            },
            {
                "_id": 2,
                "host": "${mongodb3}:27017",
                "priority": 0
            }
        ]
    };
    rs.initiate(cfg, { force: true });
    rs.reconfig(cfg, { force: true });
    rs.slaveOk();
    db.getMongo().setReadPref('nearest');
    db.getMongo().setSlaveOk(); 
EOF

tail -f /dev/null
