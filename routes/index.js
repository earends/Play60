var express = require('express');
var router = express.Router();
var Client = require('mariasql');




/* GET home page. */
router.get('/', function(req, res, next) {
	var c = new Client({
	  host: '127.0.0.1',
	  user: 'root',
	  password: '',
	  db: 'test'
	});

	var prep = c.prepare('SELECT name FROM User');

	c.query(prep(), function(err, rows) {
	  if (err)
	    throw err;
	  console.dir(rows);
	});

	c.end();
	


	res.render('index', { title: 'Express' });
});

module.exports = router;
