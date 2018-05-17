'use strict';
const env = require('dotenv').config().parsed;
const socket = require('socket.io-client')('http://'+env.HTTP_HOST+':'+env.HTTP_PORT);
const dialogflow = require('./src/dialogflow');

async function main () {
    socket.on('nlp',async function(mensagem){
        let nlp = await dialogflow.send(mensagem);
        if(nlp.actionIncomplete === true){
            console.log('client', nlp.mensagem)
            socket.emit('client',nlp.mensagem);
        }
        if(nlp.actionIncomplete === false){
            console.log('kernel', nlp)
            socket.emit('kernel',nlp);
        }
    })
}
main();

console.log('Mika NLP Running');