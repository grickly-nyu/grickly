#!/bin/bash



set -xe
update_all() {
    pip3 install -r ./requirements.txt
    pip3 install python-coveralls
    cd static
    npm install
    npm build:production
}

time python test.py --cov-report=term --cov=application/ tests/
