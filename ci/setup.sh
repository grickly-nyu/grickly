#!/bin/bash



set -xe
update_all() {
    pip3 install -r ./requirements.txt
    cd static
    npm install
    npm build:production
}

time python test.py --cov-report=term --cov-report=html --cov=application/ tests/
