var logger   = console,
  Perfecto = require('../lib/Perfecto').Perfecto, // Perfecto Main module
  Conf     = require('./ClientConf.js'), // Test configuration
  client   = new Perfecto.PerfectoClient(Conf.protocol ,Conf.host, Conf.user, Conf.pass), // Creating a client
  deviceId = Conf.deviceId; // Import deviceId from the configuration file

describe("Test perfecto NodeJS RESTful API client", function() {
   // Set Jasmine defualt timeout interval 
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 40000;

  // beforeEach creates new execution and open device
  beforeEach(function(done) {
    logger.log('========== Before Test ==========');
    client.startNewExecution()
      .then((execution_Id)=>{
        return client.openDevice(deviceId);
      })
      .then((ans)=>{
        done();
      });
  });

  // afterEach closing the device and ends the execution
  afterEach(function(done) {
    logger.log('========== After Test ==========')
    client.closeDevice()
      .then((ans) =>{
        // logger.log('Closing device status: ' + JSON.parse(ans)['description']);
        return client.endExecution();
      })
      .then((ans) =>{
        done();
      });
  });

  // Test 
  it("Should search in google", function(done) {
    logger.log('========== Test ==========');

    client.browserOpen()
      .then((ans)=>{
        return client.browserGoTo('https://google.com');
      })
      .then((ans)=>{
          return client.browserFindElement('name', 'q');
      })
      .then((ans)=>{
        /**
         * 'returnValue' contains the XPath of the returned element
         * (if there's more then one returns an array of values)
         */
        let elem = JSON.parse(ans).returnValue; 
        elem = elem.substring(1, elem.length - 1); // remove the '[' & ']' from the string
        return client.browserSetElementValue('xpath', elem, 'Perfecto');
      })
      .then((ans)=>{
        return client.browserElementClick('name', 'btnG');
      })
      .then((ans)=>{
        done();
      });

  }); // end it

}); // end describe