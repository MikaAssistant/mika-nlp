'use strict';
const db = require(__dirname+"/../config/database");
const uuidv4 = require('uuid/v4');
let id = uuidv4();

//DIALOGFLOW
const Apiai = require('apiai');
const apiai = Apiai(db.get('settings.dialogflow.client_token').value());

let contexts = null;

const Request = {
    send: (mensagem) => {
        return new Promise(resolve => {
            let request = apiai.textRequest(mensagem, {
                sessionId: id,
                contexts: contexts
            });
    
            request.on('response', function(response) {
                contexts = response.result.contexts;
                let r = {
                    mensagem: response.result.fulfillment.speech,
                    intent: response.result.metadata.intentName,
                    action: response.result.action,
                    actionIncomplete: response.result.actionIncomplete,
                    parameters: response.result.parameters
                }
                resolve(r);
            });
            request.end();
        });
    }
}

module.exports = Request;