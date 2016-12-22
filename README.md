# PerfectoRestClientDemo
NodeJS Demo Client for Perfecto REST API. <br/>

Get started with Perfecto RESTful API, read more at our [Community](https://community.perfectomobile.com/posts/938046-getting-started-with-rest-api).

## **Install & dependencies:**
- Run `npm install` command within the project's directory.

## ***Running tests:*
- The tests example [here](example/PerfectoSpec.js) uses Jasmine testing framework.
- Configure your Perfecto lab User, password and host at [ClientConf.js](example/ClientConf.js).
- Run the tests using `npm test` command.  

## **Useage:**
- Require Perfecto library:
``` JavaScript
var Perfecto = require('../lib/Perfecto').Perfecto;
``` 
- Creating a new client:
```JavaScript
var client = new Perfecto.PerfectoClient('https' , 'MyHost.perfectomobile.com', MyUser, MyPassword);
``` 
- Use the [ClientConf.js](test/ClientConf.js) file to setup the test configuration.
```JavaScript
var client = new Perfecto.PerfectoClient(Conf.protocol ,Conf.host, Conf.user, Conf.pass);
``` 
- Starting a new execution, open device and browser navigation example:
```JavaScript
client.startNewExecution()
    .then((execution_Id)=>{
        return client.openDevice(deviceId);
    })
    .then((ans)=>{
        // ans = REST API response, JSON format
        return client.browserOpen();
    })
    .then((ans)=>{
        return client.browserGoTo('https://google.com');
    })
    .then((ans)=>{
        return client.browserClose();
    })
    .then((ans)=>{
        return client.closeDevice();
    })
    .then((ans)=>{
        return client.endExecution();
    })
    .catch((err)=>{
        logger.log(err);
    });

``` 
- .then(ans) .... , the *ans* object contains the previous block response (JSON format). 
```JavaScript
 .then((ans)=>{
     console.log(ans); // print the respone's body.
     //... do something
 }
```

## **More Functionalities:**
- Devices and Cradle Commands: 
  The following devices and cradles commands are supported: <br/>
  Device info, device list, cradle info and cradle list. <br/>
  For example - getting devices list: <br/>
  **After starting a new execution:** 
```JavaScript
.then((ans)=>{
    return client.getDevicesList();
})
.then((ans)=>{
    console.log(ans); // Print list of the device in your cloud.
});
```

## **Implementing a new command:** 
Consider the following function in the file [PerfectoClient.js](lib/PerfectoClient.js): <br/>
```JavaScript
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
   .
   .
   .
   // JavaScript code ...
}
```

Use the *executeCommand* method to add your new command, for example:<br/>
```JavaScript
this.myNewCommand = (Param)=>{
    let params = ['ParamName=' + Param];
    return this.executeCommand('MyNewCommandName', 'MyNewCommandSubCommand', params);
}
```
Make sure you add the command within the PerfectoClient object scope. <br/>