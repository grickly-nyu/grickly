#!/bin/bash



set -xe
export DATABASE_URL="mysql://doadmin:rtrjvssd4s8bpp14@grickly-nyu-do-user-8731753-0.b.db.ondigitalocean.com:25060/grickly"
update_all() {
    pip3 install -r ./requirements.txt
    cd static
    npm install
    npm build:production
}

time python test.py --cov-report=term --cov-report=html --cov=application/ tests/
