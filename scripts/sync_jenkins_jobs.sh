#!/bin/sh

function run() {
    cd ~/jobs
    git pull origin master
    git add --all
    git commit -m "JENKINS: Updating jobs"
    git push origin master
}

run
