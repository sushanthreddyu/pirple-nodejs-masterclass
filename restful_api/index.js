/*
 * Primary file for the server
 *
 */

// Dependencies
const http = require('http');
const url = require('url');

// The server should respond to all requests with a string
const server = http.createServer((req, res) => {

    // Get the url and parse it
    const parsedUrl = url.parse(req.url, true);

    // Get the path
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get the HTTP method
    const method = req.method.toLowerCase();

    // Send the response 
    res.end('Hello World!!\n');

    // Log the request path
    console.log("Request is received on this path: " + trimmedPath + " with HTTP method:" + method);
});

// Start the server, and have it listen on port 3000
server.listen(3000, () => {
    console.log("The server is now listening on port 3000");
})

