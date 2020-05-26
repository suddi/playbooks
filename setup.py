# pylint: disable-msg=no-name-in-module,import-error
from distutils.cmd import Command
from os import getcwd
from subprocess import check_call
from setuptools import find_packages, setup

class PylintCommand(Command):
    description = 'run pylint on Python source files'
    user_options = []

    def initialize_options(self):
        pass

    def finalize_options(self):
        pass

    def run(self):
        command = ['pylint', getcwd()]
        return check_call(command)

def get_short_description():
    return 'Ansible infrastructure-as-code playbooks for publishing ' + \
        'packages to NPM, PyPy, setting up servers and deployment to ' + \
        'AWS, GCP and Heroku'

def get_long_description():
    readme_file = 'README.md'
    with open(readme_file, 'r', encoding='utf-8') as f:
        readme = f.read()
    return readme

setup(
    name='playbooks',
    packages=find_packages(),
    version='1.0.0',
    description=get_short_description(),
    long_description=get_long_description(),
    long_description_content_type='text/markdown',
    license='Apache-2.0',
    author='Sudharshan Ravindran',
    author_email='mail@suddi.io',
    url='https://github.com/suddi/playbooks',
    download_url='https://github.com/suddi/playbooks',
    keywords=[
        'playbooks',
        'ansible',
        'iac',
        'infrastructure-as-code',
        'cloudformation',
        'deployment-manager',
        'aws',
        'gcp',
        'heroku'
    ],
    classifiers=[
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.8'
    ],
    cmdclass={
        'lint': PylintCommand
    }
)
