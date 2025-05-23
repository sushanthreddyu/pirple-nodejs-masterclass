/*
 * Primary file for the server
 *
 */

// Dependencies
const http = require("http");
const https = require("https");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const fs = require("fs");
const config = require("./config");
const _data = require("./lib/data");

// TESTING
// @TODO delete this
_data.delete("test", "newFile", function(err) {
  console.log("ERROR: ", err)
});

// Instantiate the HTTP server
const httpServer = http.createServer((req, res) => {
  unifiedServers(req, res);
});

// Start the http server
httpServer.listen(config.httpPort, () => {
  console.log("The http server is now listening on port : " + config.httpPort);
});

// Instantiate the HTTPS server
const httpsServerOptions = {
  key: fs.readFileSync("./https/key.pem"),
  cert: fs.readFileSync("./https/cert.pem"),
};
const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  unifiedServers(req, res);
});

// Start the https server
httpsServer.listen(config.httpsPort, () => {
  console.log(
    "The https server is now listening on port : " + config.httpsPort,
  );
});

// All the server logic for both HTTP and HTTPS servers
const unifiedServers = (req, res) => {
  // Get the url and parse it
  const parsedUrl = url.parse(req.url, true);

  // Get the path
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");

  // Get the query string as an object
  const queryStrinObject = parsedUrl.query;

  // Get the HTTP method
  const method = req.method.toLowerCase();

  // Get the headers as an object
  const headers = req.headers;

  // Get the payload, if any
  const decoder = new StringDecoder("utf-8");
  let buffer = "";

  req.on("data", (data) => {
    buffer += decoder.write(data);
  });

  req.on("end", () => {
    buffer += decoder.end();

    // Choose the handle the request should go to. If one is not found, use the notFound handler
    let chosenHandler =
      typeof router[trimmedPath] !== "undefined"
        ? router[trimmedPath]
        : handlers.notFound;

    // Construct the data object to send to the handler
    const data = {
      trimmedPath: trimmedPath,
      queryStringObject: queryStrinObject,
      method: method,
      headers: headers,
      payload: buffer,
    };

    // Route the request to the handler specified in the router
    chosenHandler(data, (statusCode, payload) => {
      // Use the status code called by the handler, or default to 200
      statusCode = typeof statusCode == "number" ? statusCode : 200;

      // Use the payload called by the handler, or default to empty object
      payload = typeof payload == "object" ? payload : {};

      // Convert the payload into a string
      const payloadString = JSON.stringify(payload);

      // Return the response
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);

      // Log the request path
      console.log("Returning this response : ", statusCode, payloadString);
    });
  });
};

// Define a route handler
let handlers = {};

// Ping handler
handlers.ping = function(data, callback) {
  callback(200);
};

// Not found handler
handlers.notFound = function(data, callback) {
  callback(404);
};

// Define a request router
const router = {
  ping: handlers.ping,
};
