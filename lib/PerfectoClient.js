"use strict";

var Logger = require('./logger.js').Logger,
    request = require('request'); 

var PerfectoClient = exports.PerfectoClient = function(protocol, host, user, password){
    this.host = host;
    this.user = user;
    this.password = password;   
    this.protocol = protocol;
    this.logger = new Logger();

    this.Cloudurl = this.protocol + '://' + this.host
    this.base_url = this.Cloudurl + '/services/executions'; //for commands execution

    /**
     * Sends a request handeled with Promise
     * 
     * ### args ### 
     * options - options for request api (Look request's documentation)
     * 
     * ### return ### 
     * Promise 
     * resolve - answer's body
     * reject - request's api error 
     */
    this.requestWithPromise = (options) =>{
        return new Promise((resolve, reject) =>{
            request(options, (error, response, body)=>{
                if(!error && response.statusCode == 200){
                    resolve(body);
                }
                else{
                    reject(error);
                }
            });
        });
    }

    /**
     * Start a new executions
     * Assign a value to this.executionId
     * 
     * ### return ### 
     * Promise:
     * resolve - executionId
     * reject - error
     */
    this.startNewExecution = ()=>{

        let options = {
            url: this.base_url + '?operation=start&user=' + this.user + '&password=' + this.password
        };

        return new Promise((resolve, reject) => {
            request(options, (error, response, body) => {
                if(!error && response.statusCode == 200){
                    this.executionId = JSON.parse(body)['executionId'];
                    this.logger.log('Started a new execution with execution id: ' + this.executionId);
                    resolve(this.executionId);
                }
                else{
                    this.logger.err('Failure while starting a new execution.');
                    reject(error);
                }
            });
        });
    }

    /**
     * Ending executions
     * Ends the execution this.executionId
     * 
     * ### return ###
     * Promise:
     * resolve - status
     * reject - error
     */
    this.endExecution = () => { 
        let req_url = this.base_url + '/' + this.executionId 
        + '?operation=end&user='+ this.user +'&password=' + this.password;

        let options = {
            url: req_url
        };
        
        return new Promise((resolve, reject) => {
            request(options, (error, response, body) => {
                if(!error && response.statusCode == 200){
                    let status = JSON.parse(body)['status'];
                    this.logger.log('End execution status: ' + status);
                    resolve(status);
                }
                else{
                    this.logger.err('Failed to finish the execution.');
                    reject(error);
                }
            });
        });
    }

    /**
     * Execute http get command
     * 
     * ### args ###
     * command = command name
     * subcommand = subcommand name
     * params = array with the following form ['param=ParamValue','param1=ParamValue' ....]
     * 
     * ### return ###
     * Promise
     */
    this.executeCommand = (command, subcommand, params)=>{
        let req_url = this.base_url + '/' + this.executionId + '?' + 'operation=command' +
         '&user='+ this.user +'&password=' + this.password + '&command=' + 
         command + '&subcommand=' + subcommand;

        if(params){
            params.forEach((param)=>{
                req_url = req_url + '&param.' + param;
            })
        }
        
        let options = {
            url: req_url
        }
        this.logger.log('Executing command: ' + command + ' ' + subcommand);
        return this.requestWithPromise(options);
    }

    /*******************
     * Device Commands *
     *******************/

    /**
     * Open device command
     * 
     * ### args ###
     * deviceId - device id of the desired device
     * 
     * ### return ###
     * Promise
     */
    this.openDevice = (deviceId)=>{
        let params = ['deviceId=' + deviceId];

        // return this.executeCommand('device', 'open', params);
        // In order to set the device ID to the current instance of client.
        return new Promise((resolve, reject)=>{
            this.executeCommand('device', 'open', params)
                .then((ans)=>{
                    if(JSON.parse(ans)['description'] == 'Success'){
                        this.deviceId = deviceId;
                        resolve(ans);
                    }
                })
                .catch((err)=>{
                    reject(err);
                });
        });
    }

    /**
     * Close device command
     * 
     * ### args ###
     * deviceId - device id of the desired device
     * 
     * ### return ###
     * Promise
     */
    this.closeDevice = ()=>{
        let params = ['deviceId=' + this.deviceId];
        return this.executeCommand('device', 'close', params);
    }

    /****************************************
     * Browser and Webpage Objects Commands *
     ****************************************/

    /**
     * Open browser. 
     */
    this.browserOpen = ()=>{
        let params = ['deviceId=' + this.deviceId];
        return this.executeCommand('browser', 'open', params);
    }

    /**
     * Close browser
     */
    this.browserClose = ()=>{
        let params = ['deviceId=' + this.deviceId];
        return this.executeCommand('browser', 'close', params);
    }

    /**
     * Navigate to Url
     * 
     * ### args ###
     * Url - string represent url to navigate. 
     */
    this.browserGoTo = (Url)=>{
        let params = [
            'deviceId=' + this.deviceId,
            'url=' + Url
            ];
        return this.executeCommand('browser', 'goto', params);
    }

    /**
     * Browser find element
     * Finding a web element by given identifier
     * 
     * ### args ###
     * by - identifier kind: xpath, id, name .... 
     * identifier - identifier's value
     */
    this.browserFindElement = (by, identifier)=>{
        let params = [
            'deviceId=' + this.deviceId,
            'by=' + by,
            'value=' + encodeURIComponent(identifier)
        ];
        return this.executeCommand('webpage.element', 'find', params);
    }

    /**
     * Set's element value
     * 
     * ### args ###
     * by - identifier kind: xpath, id, name .... 
     * identifier - identifier's value
     * text - a text to set.
     */
    this.browserSetElementValue = (by, identifier, text)=>{
        let params = [
            'deviceId=' + this.deviceId,
            'text=' + text,
            'by=' + by,
            'value=' + encodeURIComponent(identifier)
        ];
        return this.executeCommand('webpage.element', 'set', params);
    }

    /**
     * Element click
     * Click an element by it's identifier
     * 
     * ### args ###
     * by - identifier kind: xpath, id, name .... 
     * identifier - identifier's value
     */
    this.browserElementClick = (by, identifier)=>{
        let params = [
            'deviceId=' + this.deviceId,
            'by=' + by,
            'value=' + encodeURIComponent(identifier)
        ];
        return this.executeCommand('webpage.element', 'click', params);
    }

    /***************************
     * Devices And Cradle Info *
     ***************************/

    this.Devices = {
        // get device info
        getDeviceInfo: (deviceId)=>{
            let options = {
                url : this.Cloudurl + '/services/handsets/' + deviceId + 
                '?operation=info&user=' + this.user + '&password=' + this.password
            }
            return this.requestWithPromise(options);
        },
        //get device list
        getDevicesList: ()=>{
            let options = {
                url : this.Cloudurl + '/services/handsets' + '?operation=list&user=' 
                + this.user + '&password=' + this.password
            }
            return this.requestWithPromise(options);
        },
        //get cradle info
        getCradleInfo: (cradleId)=>{
            let options = {
                url : this.Cloudurl + '/services/cradles/' + cradleId + 
                '?operation=list&user=' + this.user + '&password=' + this.password
            }
            return this.requestWithPromise(options);
        },
        //get cradle list
        getCradleList: ()=>{
            let options = {
                url : this.Cloudurl + '/services/cradles' + '?operation=list&user=' 
                + this.user + '&password=' + this.password
            }
            return this.requestWithPromise(options);
        }

    }

} // End PerfectoClient