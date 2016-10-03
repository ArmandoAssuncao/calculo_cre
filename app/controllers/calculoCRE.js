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
				res.status(200).json(resObj);
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

	//deletes disciplines that do not enter the calculation
	for(i = 0; i < arrayDisciplines.length; i++){
		if(arrayDisciplines[i].finalSituation != constants.discipline.APPROVED.toLowerCase()
		&& arrayDisciplines[i].finalSituation != constants.discipline.DISSAPPROVED_BY_FREQUENCY.toLowerCase()
		&& arrayDisciplines[i].finalSituation != constants.discipline.DISSAPPROVED_BY_POINT.toLowerCase()
		){
			console.error(arrayDisciplines[i].finalSituation);
			delete arrayDisciplines[i];
		}
	}

	var valueCRE = calcMode2(arrayDisciplines);

	return valueCRE;
};

function calcMode1(arrayDisciplines){
	var cre = 0;
	var totalWorkload = 0;

	arrayDisciplines.forEach(function(element, index, array) {
		totalWorkload += element.workload;
	});
	arrayDisciplines.forEach(function(element, index, array) {
		cre = cre + ((element.workload / totalWorkload) * element.finalMedia);
	});

	return cre;
}

function calcMode2(arrayDisciplines){
	var cre = 0;
	var totalWorkload = 0;
	var somatory = 0;

	arrayDisciplines.forEach(function(element, index, array) {
		totalWorkload += element.workload;
	});
	arrayDisciplines.forEach(function(element, index, array) {
		somatory = somatory + (element.workload * element.finalMedia);
	});

	cre = somatory / totalWorkload;
	return cre;
}

