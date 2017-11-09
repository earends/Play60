var express = require('express');
var router = express.Router();
var helpers = require('../controllers/homeController.js');


module.exports = function (app) {
	app.route('/')
		.get(helpers.allUsers)
		//.post(helpers.createUser);

};


