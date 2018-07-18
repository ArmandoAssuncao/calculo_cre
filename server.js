'use strict';

global.appRoot = __dirname;

var request = require('request');
var app = require('./config/express')();

app.listen(app.get('port'), function(){
	console.log('Express Server in ' + app.get('port'));
});
