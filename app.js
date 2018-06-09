'use strict';
const env = require('dotenv').config().parsed;
const socket = require('socket.io-client')('http://'+env.HTTP_HOST+':'+env.HTTP_PORT);
const dialogflow = require('./src/dialogflow');

let Response = {
    message: null,
    action: null
};

async function main () {
    socket.on('nlp',async function(mensagem){
        let nlp = await dialogflow.send(mensagem);

        Response.message = nlp.mensagem;
        Response.action = nlp.action;

        if(nlp.actionIncomplete === true){
            socket.emit('client',Response);
        }
        if(nlp.actionIncomplete === false){
            socket.emit('kernel',nlp);
            if(nlp.mensagem !== null){
                socket.emit('client',Response);
            }
        }
    })
}
main();

console.log('Mika NLP Running');