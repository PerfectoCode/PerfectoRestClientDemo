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
		client.startNewExecution()
    	.then((execution_Id)=>{
				logger.log('========== Before Test ==========')
				logger.log('Trying to Open device with id: ' + deviceId + ' And execution id: ' + execution_Id);
				return client.openDevice(deviceId);
    	})
			.then((ans)=>{
				logger.log('Open device status: ' + JSON.parse(ans)['description']);
				done();
			})
			.catch((err) =>{
				logger.log(err);
			});
  });

	// afterEach closing the device and ends the execution
  afterEach(function(done) {
		client.closeDevice()
			.then((ans) =>{
				logger.log('========== After Test ==========')
				logger.log('Closing device status: ' + JSON.parse(ans)['description']);
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
        logger.log('navigating to google');
        return client.browserGoTo('https://google.com');
    })
    .then((ans)=>{
        logger.log('find element with name: \'q\'');
        return client.browserFindElement('name', 'q');
    })
    .then((ans)=>{
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
        logger.log('press search button')
        return client.browserElementClick('name', 'btnG');
    })
		.then((ans)=>{
			done();
		});

  }); // end it

}); // end describe
