'use strict';

const expect = require('chai').expect;
const nock = require('nock');
const sinon = require('sinon');

const knightwatcher = require('../../utils/knightwatcher');

describe('Unit tests for utils/knightwatcher', function () {
    context('Testing getMessage', function () {
        before(function () {
            this.clock = sinon.useFakeTimers();
        });

        after(function () {
            this.clock.restore();
        });

        it('CASE 1: Should handle "npm-publish" messageType', function () {
            const options = {
                messageType: 'npm-publish',
                repoName: 'package',
                username: 'user42',
                link: 'https://www.user42.com'
            };
            const timestamp = `${new Date().toISOString().split('.')[0]}Z`;
            const expectedResult = `Published package on NPM\n
                username: \`${options.username}\`
                repository: \`${options.repoName}\`
                link: ${options.link}
                timestamp: \`${timestamp}\``.replace(/ +/g, ' ');

            const result = knightwatcher.getMessage(options);

            expect(result).to.be.eql(expectedResult);
        });

        it('CASE 2: Should handle "deploy" messageType', function () {
            const options = {
                messageType: 'deploy',
                repoName: 'package',
                username: 'user42',
                link: 'https://www.user42.com'
            };
            const timestamp = `${new Date().toISOString().split('.')[0]}Z`;
            const expectedResult = `Deployed service\n
                username: \`${options.username}\`
                repository: \`${options.repoName}\`
                link: ${options.link}
                timestamp: \`${timestamp}\``.replace(/ +/g, ' ');

            const result = knightwatcher.getMessage(options);

            expect(result).to.be.eql(expectedResult);
        });

        it('CASE 3: Should handle unknown messageType', function () {
            const options = {};
            const timestamp = `${new Date().toISOString().split('.')[0]}Z`;
            const expectedResult = `Managed service\n
                username: \`${options.username}\`
                repository: \`${options.repoName}\`
                link: ${options.link}
                timestamp: \`${timestamp}\``.replace(/ +/g, ' ');

            const result = knightwatcher.getMessage(options);

            expect(result).to.be.eql(expectedResult);
        });
    });

    context('Testing sendMessage', function () {
        function applyNock(message, statusCode, responseBody) {
            const url = 'https://bot.suddi.io';
            const body = JSON.stringify({
                username: 'suddi_r',
                text: message
            });

            return nock(url)
                .post('/message', body)
                .once()
                .reply(statusCode, responseBody);
        }

        before(function () {
            this.clock = sinon.useFakeTimers();
        });

        after(function () {
            this.clock.restore();
        });

        it('CASE 1: Should be able to send message', function () {
            const options = {
                messageType: 'deploy',
                repoName: 'package',
                username: 'user42',
                link: 'https://www.user42.com'
            };
            const timestamp = `${new Date().toISOString().split('.')[0]}Z`;
            const message = `Deployed service\n
                username: \`${options.username}\`
                repository: \`${options.repoName}\`
                link: ${options.link}
                timestamp: \`${timestamp}\``.replace(/ +/g, ' ');
            const expectedStatusCode = 200;
            const expectedResponseBody = {
                meta: {
                    code: 200,
                    message: 'OK',
                    retryable: true
                },
                data: {}
            };

            applyNock(message, expectedStatusCode, expectedResponseBody);
            knightwatcher.sendMessage(options)
                .then(function (response) {
                    expect(response.status).to.be.eql(expectedStatusCode);
                    expect(response.data).to.deep.eql(expectedResponseBody);
                });
        });
    });

    context('Testing runCmd', function () {
        it('CASE 1: Should be able to parse arguments correctly', function () {
            const sendMessageFn = sinon.spy();
            const messageType = 'npm-publish';
            const repoName = 'package';
            const link = 'https://www.user42.com';
            const username = 'user42';
            process.argv = [
                'node',
                'utils/knightwatcher.js',
                '--message-type',
                messageType,
                '--repo-name',
                repoName,
                '--link',
                link,
                '--username',
                username
            ];

            const result = knightwatcher.runCmd(sendMessageFn);

            expect(result).to.be.eql(undefined);
            expect(sendMessageFn.calledOnce).to.be.eql(true);
            const options = sendMessageFn.args[0][0];
            expect(options.messageType).to.be.eql(messageType);
            expect(options.repoName).to.be.eql(repoName);
            expect(options.link).to.be.eql(link);
            expect(options.username).to.be.eql(username);
        });

        it('CASE 2: Should be able to parse arguments correctly when it is passed as single character arguments', function () {
            const sendMessageFn = sinon.spy();
            const messageType = 'npm-publish';
            const repoName = 'package';
            const link = 'https://www.user42.com';
            const username = 'user42';
            process.argv = [
                'node',
                'utils/knightwatcher.js',
                '-m',
                messageType,
                '-r',
                repoName,
                '-l',
                link,
                '-u',
                username
            ];

            const result = knightwatcher.runCmd(sendMessageFn);

            expect(result).to.be.eql(undefined);
            expect(sendMessageFn.calledOnce).to.be.eql(true);
            const options = sendMessageFn.args[0][0];
            expect(options.messageType).to.be.eql(messageType);
            expect(options.repoName).to.be.eql(repoName);
            expect(options.link).to.be.eql(link);
            expect(options.username).to.be.eql(username);
        });

        it('CASE 3: Should default to "npm-publish" if invalid messageType is passed', function () {
            const sendMessageFn = sinon.spy();
            const messageType = 'npm-publish';
            const repoName = 'package';
            const link = 'https://www.user42.com';
            const username = 'user42';
            process.argv = [
                'node',
                'utils/knightwatcher.js',
                '-m',
                'invalid',
                '-r',
                repoName,
                '-l',
                link,
                '-u',
                username
            ];

            const result = knightwatcher.runCmd(sendMessageFn);

            expect(result).to.be.eql(undefined);
            expect(sendMessageFn.calledOnce).to.be.eql(true);
            const options = sendMessageFn.args[0][0];
            expect(options.messageType).to.be.eql(messageType);
            expect(options.repoName).to.be.eql(repoName);
            expect(options.link).to.be.eql(link);
            expect(options.username).to.be.eql(username);
        });
    });
});
