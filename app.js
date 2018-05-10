'use strict';
const env = require('dotenv').config().parsed;
const socket = require('socket.io-client')('http://'+env.HTTP_HOST+':'+env.HTTP_PORT);
const apiai = require('apiai');
const dialogflow = apiai(env.DIALOGFLOW_CLIENT_ACCESS_TOKEN);

socket.on('nlp',function(msg){
    console.log('Enviando + '+ msg);

    let request = dialogflow.textRequest(msg, {
        sessionId: '2'
    });

    request.on('response', function(response) {
        let resp = {};
        resp.intent = response.result.metadata.intentName;
        resp.action = response.result.action;
        resp.parameters = response.result.parameters;
        console.log(resp);
        socket.emit('kernel',resp);
    });

    request.on('error', function(error) {
        console.log(error);
    });
    request.end();
});

console.log('Mika NLP Running');