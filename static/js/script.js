'use strict';

const HOST = ['calculocre.', 'apps.', 'blacktable.', 'online'];
const URL = 'http://' + HOST.join('') + '/calculo_cre';

var XMLHttpFactories = [
    function () {return new XMLHttpRequest()},
    function () {return new ActiveXObject('Msxml2.XMLHTTP')},
    function () {return new ActiveXObject('Msxml3.XMLHTTP')},
    function () {return new ActiveXObject('Microsoft.XMLHTTP')}
];


function showFields() {
    $('#box_valuecre').fadeOut("200", function(){
        $('#input_user').val('');
        $('#input_pass').val('');

        $('#text_valuecre').text('');
        $('#fields').show();
    });
}


function createXMLHTTPObject() {
    var xmlhttp = false;
    for (var i=0;i<XMLHttpFactories.length;i++) {
        try {
            xmlhttp = XMLHttpFactories[i]();
        }
        catch (e) {
            continue;
        }
        break;
    }
    return xmlhttp;
}

function sendRequest(url, callback,callbackError, postData) {
    var http = createXMLHTTPObject();
    if (!http){
        return;
    };

    var method = (postData) ? 'POST' : 'GET';
    http.open(method,url,true);

    if (postData)
        http.setRequestHeader('Content-type','application/x-www-form-urlencoded');

    http.onreadystatechange = function () {
        if (http.readyState != 4) return;
        if (http.status != 200 && http.status != 304) {
            callbackError(http);
            return;
        }
        callback(http);
    }

    if (http.readyState == 4) return;
    http.send(postData);

    setTimeout(ajaxTimeout, 10000);
    function ajaxTimeout(){
        http.abort();
    }
}

function calculate(){
    disable_elements(true);

    var user = $('#input_user').val();
    var pass = $('#input_pass').val();
    var institute = $('#type_institute').val();

    if(user.length == 0 || pass.length == 0){
        disable_elements(false);
        $('#text_message').text('Preencha os campos');
        return;
    }

    var data = "";
    data += "username=" + user;
    data += "&pass=" + pass;
    data += "&institute=" + institute;

    sendRequest(URL, cbCalc, cbCalcError, data);
}

function cbCalc(req){
    var obj = JSON.parse(req.response);

    disable_elements(false);

    if(obj.error != '0'){
        $('#text_message').text('Usuário não encontrado');
        return;
    }

    var cre = obj.value_cre;
    if(!isNaN(parseInt(cre))){
        cre = cre.toFixed(2);
    }

    $('#fields').fadeOut("200", function(){
        $('#text_valuecre').text(cre);
        $('#box_valuecre').show();
    });

    return cre;
}

function cbCalcError(req){
    disable_elements(false);
    $('#text_message').text('Erro ao obter dados, tente mais tarde.');
}

function disable_elements(condition){
    $('#input_user').prop('disabled', condition);
    $('#input_pass').prop('disabled', condition);
    $('#btn_submit').prop('disabled', condition);
    $('#type_institute').prop('disabled', condition);
    $('#text_message').text('');
}

//smooth scroll
$(document).on('click', '.roll_screen', function(event){
    event.preventDefault();

    $('html, body').animate({
        scrollTop: $( $.attr(this, 'href') ).offset().top
    }, 500);
});
