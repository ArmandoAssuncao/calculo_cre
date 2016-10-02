var fs = require('fs');
var semaphore = require('semaphore')(1);

module.exports = function(app){
	var controller = app.controllers.calculoCRE;
	app.post('/calculo_cre', function(req, res, next){counter_access(); next();}, controller.calcCRE);
}


// count access
function counter_access(){
	semaphore.take(function(){
		fs.readFile('/home/nodejs/logs/calculo_cre_counter_access.log', function (err, data) {
			if (err) {
				return console.error(err);
			}
			var counter = data.toString();

			counter = parseInt(counter);
			if(isNaN(counter)){
				counter = 0;
			}

			fs.writeFile('/home/nodejs/logs/calculo_cre_counter_access.log', counter+1, function (err) {
				if (err) {
					return console.error(err);
				}
			});
		});

		semaphore.leave();
	});
}