#!/bin/sh

function print_python_runtime_versions() {
    PYTHON_VERSION_RESULT=``

    echo "python runtime environment -----------"
    echo 'running "python --version"'
    python --version
    echo 'running "which python"'
    which python

    echo 'running "pip --version"'
    pip --version
    echo 'running "which pip"'
    which pip
}

function print_node_runtime_versions() {
    echo "node runtime environment -------------"
    echo 'running "node --version"'
    node --version
    echo 'running "which node"'
    which node

    echo 'running "npm --version"'
    npm --version
    echo 'running "which npm"'
    which npm

    echo 'running "nvm --version"'
    nvm --version
}

function print_runtime_versions() {
    print_python_runtime_versions
    echo
    print_node_runtime_versions
    echo
}

function run() {
    # Will initialize pyenv and virtualenvwrapper
    . ~/.pyenvrc
    # Will initialize nvm
    . ~/.nvmrc

    # Pull the latest code
    cd ~/playbooks
    git pull origin master

    # Switch to "playbooks" virtualenv
    workon playbooks

    print_runtime_versions
}

run
