const config = require("./config");

const options = {
  swaggerDefinition: {
    info: {
      description: 'Papyro openAPI specification',
      title: 'Papyro',
      version: '1.0.0',
    },
    host: config.host,
    basePath: '',
    produces: [
      "application/json",
    ],
    schemes: ['http', 'https'],
    securityDefinitions: {
      JWT: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
        description: "",
      }
    }
  },
  basedir: __dirname, //app absolute path
  files: ['./routes/api/*.js'] //Path to the API handle folder
};

module.exports = options;