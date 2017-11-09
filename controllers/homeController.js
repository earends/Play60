var Client = require('mariasql');

module.exports = {
	allUsers(req, res) {
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
		}

}