var http = require('http');
var app = require('./app');
var config = require('./config/config');
var logger = require('./config/log4js');
var cronScheduler = require('./config/crons/cron_scheduler');

const port = process.env.PORT || config.port;

//Create server with exported express app
const server = http.createServer(app);
server.listen(port);

logger.log("Listening on Port: " + port);