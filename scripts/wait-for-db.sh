#!/bin/sh

host=$1
shift 1
cmd="$@"

db=`getent hosts $host | awk '{ print $1 }'`

echo "Waiting for DB setup to finish.."
until mongo --host ${db}:27017 --eval 'quit(db.runCommand({ ping: 1 }).ok ? (rs.status().ok ? 0 : 2) : 2)' &>/dev/null; do
  printf '.'
  sleep 1
done
echo "DB setup done - executing command.."

exec $cmd