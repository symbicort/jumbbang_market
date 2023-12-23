const swaggerUi = require('swagger-ui-express');
const swaggereJsdoc = require('swagger-jsdoc')

const options = {
    swaggerDefinition: {
    openapi: "3.0.0",
    info: {
        title: "Test API",
        version: "1.0.0",
        description: "Test API with express",
    },
    basePath: "/",
    },
    apis: ["./routes/*.js"],
};
const specs = swaggereJsdoc(options);

module.exports =  { swaggerUi, specs };