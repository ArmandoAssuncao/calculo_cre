var requestWeb = require('../resources/requestWeb');
var DisciplineClass = require('../models/discipline');
var constants = require('../resources/constants');
var cheerio = require('cheerio');

module.exports = function(app){
	controller = {};

	controller.calcCRE = function(req, res){
		var url = constants.url.LOGIN;
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
				resObj.value_cre = calculaCRE(response.body);
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

	var valueCRE = 0;
	var totalWorkload = 0;
	var arrayDisciplines = [];

	$(selectorHistoric).each(function(){
		var Discipline = new DisciplineClass();
		Discipline.year = $(this).children('td:nth-child(1)').text();
		Discipline.semester = $(this).children('td:nth-child(2)').text();
		Discipline.grade = $(this).children('td:nth-child(3)').text();
		Discipline.name = $(this).children('td:nth-child(4)').text();
		Discipline.workload = parseFloat($(this).children('td:nth-child(5)').text().formatToNumber()) || 0;
		Discipline.absence = $(this).children('td:nth-child(6)').text();
		Discipline.finalMedia = parseFloat($(this).children('td:nth-child(7)').text().formatToNumber()) || 0;
		Discipline.finalSituation = $(this).children('td:nth-child(8)').text().trim().toLowerCase();
		arrayDisciplines.push(Discipline);
	});

	//delete disciplines with status in progress
	for(i = 0; i < arrayDisciplines.length; i++){
		if(arrayDisciplines.finalSituation == constants.discipline.IN_PROGRESS){
			delete arrayDisciplines[i];
		}
	}

	arrayDisciplines.forEach(function(element, index, array) {
		totalWorkload += element.workload;
	});

	arrayDisciplines.forEach(function(element, index, array) {
		valueCRE = valueCRE + ((element.workload / totalWorkload) * element.finalMedia);
	});

	return valueCRE;
};