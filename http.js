// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

var storage = require('node-persist');

//you must first call storage.init or storage.initSync
storage.initSync();

var timeLastCalled = 0;
storage.setItem('timeLastCalled',timeLastCalled);

//Declare and scope variables
var timeLastCalled;
var timeNow;
var timeDifferenceSeconds;

// Load the http module to create an http server.
var http = require('http');

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {

	var requestType;
  var responseMessage = "500";

  //Determine requet type
  if (request.url == "/put") {
      requestType = 1;
    } else if (request.url == "/get") {
      requestType = 2;
    } else {
      requestType = 3;
  }


  //PUT Request
  if (requestType == 1) {
    timeLastCalled = String(Date.now());
    storage.setItem('timeLastCalled',timeLastCalled);

    responseMessage = "200"
  }

  //GET Request
  if (requestType == 2) {

    timeNow = Date.now();

  	timeDifferenceSeconds = ((timeNow - parseInt(storage.getItem('timeLastCalled'))) * 0.001);

  	//TODO: Change threshold to 5 mins or such
    	if (timeDifferenceSeconds < 30) {
      	//Outage = True
        responseMessage = "1";
      } else {
      	//Outage = False
        responseMessage = "0";
  	}
  }

  //DEBUG
	//console.log(request.url);

  	response.writeHead(200, {"Content-Type": "text/plain"});
  	//response.end(String(currentOutage));
    response.end(responseMessage);

});

// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(port);

// Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:8000/");