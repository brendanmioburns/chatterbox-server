/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var messages = [];

const querystring = require('querystring');

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var get = function(statusCode, headers, response) {
  statusCode = 200;
  headers['Content-Type'] = 'application/JSON';
  response.writeHead(statusCode, headers);
  var responseData = JSON.stringify({results: messages});
  response.end(responseData);
};

var post = function(statusCode, headers, request, response) {
  statusCode = 201;
  headers['Content-Type'] = 'application/JSON';
  response.writeHead(statusCode, headers);
  var body = '';
  request.on('data', function(chunk) {
    body = body.concat(chunk.toString());
  }).on('end', function() {
    var newMessage = querystring.parse(body);
    newMessage.ObjectId = messages.length;
    messages.push(newMessage);
  });
};

var requestHandler = function(request, response) {

  var statusCode = undefined;

  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  var headers = defaultCorsHeaders;
  
  if (request.method === 'GET' && request.url === '/classes/messages') {
    get(statusCode, headers, response);
  } else if (request.method === 'POST') {  
    post(statusCode, headers, request, response);
  } else if (request.method === 'OPTIONS') {
    var statusCode = 200;
    response.writeHead(statusCode, headers);
  } else {
    var statusCode = 404;
    response.writeHead(statusCode, headers);
  }

  
  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  response.end();
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.

module.exports = requestHandler;
