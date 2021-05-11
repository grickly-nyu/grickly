#!/bin/sh


git fetch origin

UPSTREAM=${1:-'@{u}'}
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse "$UPSTREAM")
BASE=$(git merge-base @ "$UPSTREAM")

if [ $LOCAL = $REMOTE ]; then
    echo "Up-to-date"
elif [ $LOCAL = $BASE ]; then
    echo "Updating..."
    screen -XS backend quit
    screen -XS frontend quit
    export PORT=80
    git pull origin
    screen -dmS backend ./backend.sh
    screen -dmS frontend ./frontend.sh
    echo "Updated"
elif [ $REMOTE = $BASE ]; then
    echo "Need to push"
else
    echo "Diverged"
fi
