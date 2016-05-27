module.exports = function(app){

	var controller = app.controllers.calculoCRE;
	app.post('/calculo_cre', controller.calcCRE);
}