# playbooks

[![CircleCI](https://circleci.com/gh/suddi/playbooks.svg?style=svg)](https://circleci.com/gh/suddi/playbooks)
[![codecov](https://codecov.io/gh/suddi/playbooks/branch/master/graph/badge.svg)](https://codecov.io/gh/suddi/playbooks)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/2266d25d464344c6a3a6eefdbc2934b5)](https://www.codacy.com/app/Suddi/playbooks)
[![David](https://img.shields.io/david/suddi/playbooks.svg)](https://david-dm.org/suddi/playbooks)
[![David](https://img.shields.io/david/dev/suddi/playbooks.svg)](https://david-dm.org/suddi/playbooks?type=dev)
[![license](https://img.shields.io/github/license/suddi/playbooks.svg)](https://github.com/suddi/playbooks/blob/master/LICENSE)

[![codecov](https://codecov.io/gh/suddi/playbooks/branch/master/graphs/commits.svg)](https://codecov.io/gh/suddi/playbooks)

Ansible infrastructure-as-code playbooks for publishing packages to NPM, PyPy, setting up servers and deployment to AWS, GCP and Heroku

## Installation

### Prerequisities

- python
- pip
- nvm
- npm
- node

````
pip install --requirement requirements.txt --requirement test_requirements.txt

npm install
````

### Usage

````
ansible-playbook <PLAYBOOK_NAME>
````

#### Sensitive files handling

`ansible-vault` and the true `inventory.ini` files are maintained in S3

To download sensitive-files:

````
ansible-playbook plays/sensitive_files/download.yml
````

To upload sensitive-files:

````
ansible-playbook plays/sensitive_files/upload.yml
````

#### Protecting `inventory.ini`

In order to ensure that changes to `inventory.ini` does not get accidently committed:

````
git update-index --assume-unchanged inventory.ini
````

If you need to revert this action:

````
git update-index --no-assume-unchanged inventory.ini
````


