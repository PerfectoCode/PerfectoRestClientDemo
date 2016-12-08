# PerfectoRestClientDemo
NodeJS Demo Client for Perfecto REST API. <br/>

Get started with Perfecto RESTful API, read more at our [Community](https://community.perfectomobile.com/posts/938046-getting-started-with-rest-api).

## **Useage:**

- Run `npm install` within the project's directory.
- Require PerfectoClient library:
``` JavaScript
var Perfecto = require('../lib/Perfecto').Perfecto;
``` 
- Create a new client:
```JavaScript
var client = new Perfecto.PerfectoClient('https' , 'MyHost.perfectomobile.com', MyUser, MyPassword);
``` 
- Use the [ClientConf.js](test/ClientConf.js) file for easier test configuration.
```JavaScript
var client = new Perfecto.PerfectoClient(Conf.protocol ,Conf.host, Conf.user, Conf.pass);
``` 
- Starting a new execution, open device and browser navigation:
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
- .then(ans) .... , ans contains the previous block command's response in JSON format. 
```JavaScript
 .then((ans)=>{
     console.log(ans); // Will print the respone's body.
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

## **Adding a new command:** 
Consider the following function at the file [PerfectoClient.js](lib/PerfectoClient.js): <br/>
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
   // JS Code ...
}
```

Use it in order to add a new command and extend the Perfecto REST API client, for example:<br/>
Make sure you add the command within the PerfectoClient object scope. <br/>
```JavaScript
this.myNewCommand = (Param)=>{
    let params = ['ParamName=' + Param];
    return this.executeCommand('MyNewCommandName', 'MyNewCommandSubCommand', params);
}
```
## **Updates:**
- 24.11 Init repo , implemented executions start/end, functions use promises.
- 29.11 Fixed Promises and code styling.<br/>
    implemented: device open/close commands.<br/>
    Browser open/close/goto. <br/>
- 1.12 Added browser.element functions: find, click , set.
    Now Cradle and Devices operations are available.
    Test styling.