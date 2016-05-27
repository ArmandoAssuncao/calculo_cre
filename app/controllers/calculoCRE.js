var requestWeb = require('../resources/requestWeb');
var cheerio = require('cheerio');

module.exports = function(app){
	controller = {};

	controller.calcCRE = function(req, res){
		var url = 'https://academico.barbacena.ifsudestemg.edu.br/index.php?option=com_aixgen';
		var login = {
			user: req.body.username,
			pass: req.body.pass
		}

		requestWeb.get(url, login, function(response){
			resObj = {};
			resObj.error = 0;

			if(response.error != 0){
				resObj.error = response.error;
				res.status(401).json(resObj);
			}
			else{
				resObj.valueCRE = calculaCRE(response.body);
				res.status(200).json(resObj);
			}
		});
	};

	return controller;
};


function calculaCRE(bodyHtml){
	var $ = cheerio.load(bodyHtml);
	String.prototype.formatToNumber = function() {
    	return this.replace(',','.').replace(/[^0-9,.]/g, '');
	};

	var selectorHistoric = '.moduleConteudo tr[class^="trzebra"]';
	var selectorWorkload = '.moduleConteudo tr[class^="trzebra"] > td:nth-child(5)';
	var selectorGradePoint = '.moduleConteudo tr[class^="trzebra"] > td:nth-child(7)';
	var selectorSituation = '.moduleConteudo tr[class^="trzebra"] > td:nth-child(8)';

	var valueCRE = 0;
	var totalWorkload = 0;
	var useDissaprovedByPoint = true;
	var useDissaprovedByFrequency = false;

	var arrayWorkload = $(selectorWorkload).map(function(i, item){
		return parseFloat($(item).text().formatToNumber());
	}).get();

	var arrayGradePoint = $(selectorGradePoint).map(function(i, item){
		return parseFloat($(item).text().formatToNumber());
	}).get();

	var arraySituation = $(selectorSituation).map(function(i, item){
		return $(item).text();
	}).get();

	//total workload
	for(i = 0; i < arrayWorkload.length; i++){
		if(
			(arraySituation[i] != "Reprovado por Falta" && !useDissaprovedByFrequency)
			|| (arraySituation[i] != "Reprovado por Nota" && !useDissaprovedByPoint)
			){
			totalWorkload = totalWorkload + arrayWorkload[i];
		}
	}

	//calculate cre
	for(i = 0; i < arrayWorkload.length; i++){
		if(
			(arraySituation[i] != "Reprovado por Falta" && !useDissaprovedByFrequency)
			|| (arraySituation[i] != "Reprovado por Nota" && !useDissaprovedByPoint)
			){
			valueCRE = valueCRE + (arrayWorkload[i] / totalWorkload) * arrayGradePoint[i];
		}
	}

	return valueCRE;
};