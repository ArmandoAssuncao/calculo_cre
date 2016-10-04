var request = require('request');
var constants = require('../resources/constants');

module.exports = {
    get: function(url, login, callback){
        var form = {
            task: 'loginauth',
            userType: 'A',
            username: login.user,
            passwd: login.pass,
            instituicao: login.institute,
            Turing: ''
        };

        var loginHeaders = {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/x-www-form-urlencoded',
        };

        //authenticates
        request.post(url, {
            headers: loginHeaders,
            form: form,
            strictSSL: false
        }, function(error, response) {
            if(error) return console.error(error);

            var url = constants.url.HISTORICO_RESUMIDO;

            var historicHeaders = {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/x-www-form-urlencoded',
                Cookie: response.headers['set-cookie'][0].split(';')[0], //get response cookie
            };

            //return body html to callback
            request.get(url, {
                headers: historicHeaders,
                strictSSL: false
            }, function(error, response, body) {
                obj = {};
                obj.error = 1;

                if(error){
                    console.error(error);
                }
                //check authentication
                else if(body.indexOf('formLogin') > -1 && body.indexOf('LOGIN') > -1){
                    console.error('authentication error');
                }
                else{
                    obj.error = 0;
                    obj.body = body;
                }
                
                callback(obj);
            });
        });
    }
};