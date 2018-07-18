var fs = require('fs');
var semaphore = require('semaphore')(1);

module.exports = function(app){
	var controller = app.controllers.calculoCRE;
	app.post('/calculo_cre', function(req, res, next){counter_access(); next();}, controller.calcCRE);
}


// count access
function counter_access(){
    var logDir = appRoot + '/logs';
    if (!fs.existsSync(logDir)){
        fs.mkdirSync(logDir);
    }
	var PATH = logDir + '/counter_access.log';

	semaphore.take(function(){
        fs.access(PATH, fs.constants.F_OK, function (err) {
            if (err) {
                return fs.writeFile(PATH, 1, function (err) {
                    if (err) {
                        return console.error(err);
                    }
                });
            }

            fs.readFile(PATH, function (err, data) {
                if (err) {
                    return console.error(err);
                }
                var counter = data.toString();

                counter = parseInt(counter);
                if(isNaN(counter)){
                    counter = 0;
                }

                fs.writeFile(PATH, counter+1, function (err) {
                    if (err) {
                        return console.error(err);
                    }
                });
            });
        });

		semaphore.leave();
	});
}
