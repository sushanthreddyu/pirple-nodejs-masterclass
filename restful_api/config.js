/*
 * Create and export configuration variables
 *
 */

// Container for all the evironments
let environments = {};

// Staging Environment
environments.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName: "staging",
};

// Production Environment
environments.production = {
  httpPort: 6000,
  httpsPort: 6002,
  envName: "production",
};

// Determine which environment was passed an a command-line argument
let currEnvironment =
  typeof process.env.NODE_ENV == "string"
    ? process.env.NODE_ENV.toLowerCase()
    : "";

// Check that the current environment is one of the environments above, if not, default to staging
const environmentsToExport =
  typeof environments[currEnvironment] == "object"
    ? environments[currEnvironment]
    : environments.staging;

// Export the module
module.exports = environmentsToExport;
