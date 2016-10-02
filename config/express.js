var express = require('express');
var expressLoad = require('express-load');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

module.exports = function(){
    var app = express();
    app.set('port', 8124);

    var allowCrossDomain = function(req, res, next) {
        res.header('Access-Control-Allow-Origin', "*");
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        next();
    }

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json({limit: '5mb'}));
    app.use(methodOverride());
    app.use(allowCrossDomain);

    expressLoad('controllers', {cwd: 'app'})
    .then('routes')
    .into(app);

    return app;
}