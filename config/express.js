var express = require('express');
var expressLoad = require('express-load');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

module.exports = function(){
    var app = express();
    app.set('port', 3001);

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json({limit: '5mb'}));
    app.use(methodOverride());

    expressLoad('controllers', {cwd: 'app'})
    .then('routes')
    .into(app);

    return app;
}