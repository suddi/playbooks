#!/usr/bin/env node

'use strict';

const axios = require('axios');
const program = require('commander');

const packageJson = require('../package');

function getMessage(options) {
    function getFirstLine(messageType) {
        switch (messageType) {
            case 'npm-publish':
                return 'Published package on NPM';
            case 'deploy':
                return 'Deployed service';
            default:
                return 'Managed service';
        }
    }

    return `${getFirstLine(options.messageType)}\n
        **username**: \`${options.username}\`
        **repository**: \`${options.repoName}\`
        **link**: ${options.link}
        **timestamp**: \`${new Date().toISOString()}\``.replace(/ +/g, ' ');
}

function sendMessage(options) {
    const message = getMessage(options);
    return axios
        .post('https://bot.suddi.io/message', {
            username: 'suddi_r',
            text: message
        });
}

function runCmd(sendMessageFn) {
    program
        .version(packageJson.version)
        .option('-m --message-type <messageType>', 'Specify message type to knightwatcher', /^(npm-publish|deploy)$/i)
        .option('-r --repo-name <repoName>', 'Specify name of repo published/deployed')
        .option('-l --link <link>', 'Specify link to published/deployed service')
        .option('-u --username <username>', 'Specify user who performed action')
        .parse(process.argv);

    return sendMessageFn(program);
}

if (module.parent) {
    module.exports = {
        getMessage,
        sendMessage,
        runCmd
    };
} else {
    runCmd(sendMessage);
}
