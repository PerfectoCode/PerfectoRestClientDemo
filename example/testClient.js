"use strict";

var logger   = console,
    Perfecto = require('../lib/Perfecto').Perfecto, // Perfecto Main module
    Conf     = require('./ClientConf.js'), // Test configuration
    client   = new Perfecto.PerfectoClient(Conf.protocol ,Conf.host, Conf.user, Conf.pass), // Creating a client
    deviceId = Conf.deviceId; // Import deviceId from the configuration file

function logAns(_ans) {
    let ans = JSON.parse(_ans);
    let description = ans['description'];
    if(description != "Success"){
        logger.error("Error: " + description);
    }
    else{
        logger.log('Command ended successfuly.');
    }
}

/**
 * A simple 'main' style test. 
 * Starting a new Execution, open device, navigate and search in google.
 */
client.startNewExecution()
    .then((execution_Id)=>{
        logger.log('Open device with id: ' + deviceId)
        return client.openDevice(deviceId);
    })
    .then((ans)=>{ // ans contains the previous block answer (JSON format).
        logAns(ans);
        logger.log('open browser');
        return client.browserOpen();
    })
    .then((ans)=>{
        logAns(ans);
        logger.log('navigate google');
        return client.browserGoTo('https://google.com');
    })
    .then((ans)=>{
        logAns(ans);
        logger.log('find element with name: \'q\'');
        return client.browserFindElement('name', 'q');
    })
    .then((ans)=>{
        logAns(ans);
        logger.log('insert text: \'Perfecto\'');
        /**
         * 'returnValue' contains the XPath of the returned element
         * (if there's more then one returns an array of values)
         */
        let elem = JSON.parse(ans).returnValue; 
        elem = elem.substring(1, elem.length - 1); // remove the '[' & ']' from the string
        return client.browserSetElementValue('xpath', elem, 'Perfecto');
    })
    .then((ans)=>{
        logAns(ans);
        logger.log('press search button')
        return client.browserElementClick('name', 'btnG');
    })
    .then((ans)=>{ 
        logAns(ans);
        logger.log('closing browser');
        return client.browserClose();
    })
    .then((ans)=>{
        logAns(ans);
        logger.log('closing device')
        return client.closeDevice();
    })
    .then((ans)=>{
        logAns(ans);
        logger.log('ending execution');
        return client.endExecution();
    })
    .catch((err)=>{
        console.log(err); // Logs if error occurred
    });
