/*
 * Primary file for the server
 *
 */

// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');

// The server should respond to all requests with a string
const server = http.createServer((req, res) => {

    // Get the url and parse it
    const parsedUrl = url.parse(req.url, true);

    // Get the path
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get the query string as an object
    const queryStrinObject = parsedUrl.query

    // Get the HTTP method
    const method = req.method.toLowerCase();

    // Get the headers as an object
    const headers = req.headers

    // Get the payload, if any
    const decoder = new StringDecoder('utf-8');
    let buffer = '';

    req.on('data', (data) => {
        buffer += decoder.write(data);
    })

    req.on('end', () => {
        buffer += decoder.end();

        // Choose the handle the request should go to. If one is not found, use the notFound handler
        let chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // Construct the data object to send to the handler
        const data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStrinObject,
            'method': method,
            'headers': headers,
            'payload': buffer
        }

        // Route the request to the handler specified in the router
        chosenHandler(data, (statusCode, payload) => {
            // Use the status code called by the handler, or default to 200
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;

            // Use the payload called by the handler, or default to empty object
            payload = typeof (payload) == 'object' ? payload : {};

            // Convert the payload into a string
            const payloadString = JSON.stringify(payload);

            // Return the response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            // Log the request path
            console.log("Returning this response : ", statusCode, payloadString);

        });

    });

});

// Start the server
server.listen(config.port, () => {
    console.log("The server is now listening on port : " + config.port + " in " + config.envName);
})

// Define a route handler 
let handlers = {};

// Sample handler
handlers.sample = function (data, callback) {
    // Callback a http status code, and a payload object
    callback(406, { 'name': 'sample handler' });

};

// Not found handler
handlers.notFound = function (data, callback) {
    callback(404);
};


// Define a request router
const router = {
    'sample': handlers.sample
}
