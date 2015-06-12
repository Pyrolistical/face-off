var express = require('express');
var mongoose = require('mongoose');
var application = express();
var environment = require('./application/environment');

var port = environment.server.port;

var databaseUser = environment.database.user;
var databasePasssword = environment.database.password;
var databaseUrl = 'mongodb://' + databaseUser + ':' + databasePasssword + '@ds031581.mongolab.com:31581/face-off'
mongoose.connect(databaseUrl);

application.use(express.static(__dirname + '/public'));
application.disable('etag')

require('./application/routes')(application);

application.listen(port);

console.log('Port: ' + port);

exports = module.exports = application;
