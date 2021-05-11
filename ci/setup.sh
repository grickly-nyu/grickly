#!/bin/bash



set -xe
update_all() {
    pip3 install -r ./requirements.txt
    pip3 install python-coveralls
    cd static
    npm install
    npm build:production
}
export SERVER_ADDRESS="localhost:3000"
time python -m pytest --cov=application/ tests/
