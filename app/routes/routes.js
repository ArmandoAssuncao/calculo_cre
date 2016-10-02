var fs = require('fs');
var semaphore = require('semaphore')(1);

module.exports = function(app){
	var controller = app.controllers.calculoCRE;
	app.post('/calculo_cre', function(req, res, next){counter_access(); next();}, controller.calcCRE);
}


// count access
function counter_access(){
	var PATH = '/home/nodejs/logs/calculo_cre_counter_access.log';

	semaphore.take(function(){
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

		semaphore.leave();
	});
}