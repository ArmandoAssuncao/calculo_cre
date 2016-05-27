var request = require('request');

module.exports = {
    get: function(url, login, callback){
        var form = {
            task: 'loginauth',
            userType: 'A',
            username: login.user,
            passwd: login.pass,
            instituicao: '1',
            Turing: ''
        };

        var headers = {
            //Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            //'Accept-Encoding': 'gzip, deflate, br',
            //'Accept-Language': 'pt-BR,pt;q=0.8,en-US;q=0.6,en;q=0.4',
            'Cache-Control': 'no-cache',
            //Connection: 'keep-alive',
            //'Content-Length': 100,
            'Content-Type': 'application/x-www-form-urlencoded',
            //Host: 'academico.barbacena.ifsudestemg.edu.br',
            //Origin: 'https://academico.barbacena.ifsudestemg.edu.br',
            //Pragma: 'no-cache',
            //Referer: 'https://academico.barbacena.ifsudestemg.edu.br/index.php?&aix_referer=aHR0cDovL2FjYWRlbWljby5iYXJiYWNlbmEuaWZzdWRlc3RlbWcuZWR1LmJyL2luZGV4LnBocD9vcHRpb249Y29tX2FpeGdlbg==',
            //'Upgrade-Insecure-Requests': 1,
            //'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.86 Safari/537.36',
            //Cookie: ''
        };

        //authenticates
        request.post(url, {
            headers: headers,
            form: form,
            strictSSL: false
        }, function(error, response) {
            if(error) return console.error(error);

            var url = 'https://academico.barbacena.ifsudestemg.edu.br/index.php?option=com_aixaluno&view=historicoresumido';

            var headers = {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/x-www-form-urlencoded',
                Cookie: response.headers['set-cookie'][0].split(';')[0], //get response cookie
            };

            //return body html to callback
            request.get(url, {
                headers: headers,
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