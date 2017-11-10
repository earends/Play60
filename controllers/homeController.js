var Client = require('mariasql');

module.exports = {

	home(req, res) {
		var c = new Client({
		  host: '127.0.0.1',
		  user: 'root',
		  password: '',
		  db: 'play60'
		});

		var find = c.prepare('SELECT * FROM Posting');

		c.query(find(), function(err, rows) {
		  if (err)
		    throw err;
		  res.render('home', { uid:req.params.id, postings: rows });
		  
		});

		c.end();

		
	},
	login(req, res) {
		res.render('login', { title: 'Express' });
	},
	signup(req, res) {
		res.render('signup', { title: 'Express' });
	},
	createPost(req, res) {

		res.render('create_post', { title: 'Express' });
	},
	profile(req, res) {
		res.render('profile', { title: 'Express' });
	},
	profile_settings(req, res) {
		res.render('profile_settings', { title: 'Express' });
	},
	profile_settings_save(req, res) {
		res.send('profile_settings_save');
	},
	login_post(req, res) {
		var c = new Client({
		  host: '127.0.0.1',
		  user: 'root',
		  password: '',
		  db: 'play60'
		});
		
		var check = c.prepare('SELECT UID FROM User WHERE email =' + "'" + req.body.email_input + "'" + 'AND password =' +"'" +req.body.password_input + "'");
		//select * from User where email ='earends@zagmail.gonzaga.edu' and password = 'password'
		c.query(check(), function(err, rows) {
		  if (err)
		    throw err;
		  console.log(rows);
		  if (rows.info.numRows == 1) {
		  	
		  	res.redirect('/' + rows[0].UID + '/home');
		  }
		});

		c.end();
	},


	signup_post(req, res) {
		var c = new Client({
		  host: '127.0.0.1',
		  user: 'root',
		  password: '',
		  db: 'play60'
		});
		
		var check = c.prepare('SELECT email FROM User WHERE email =' + "'" + req.body.email_input + "'");
		var insert = c.prepare("INSERT INTO User (name,age,email,password) VALUES (" + "'" + req.body.name_input + "'" + "," + "'" + req.body.age_input + "'" + "," + "'" + req.body.email_input + "'"+ "," + "'" + req.body.password_input + "'" + ")");
		//checks to see if email is already in their if so re route to signup
		c.query(check(), function(err, rows) {
		  if (err)
		    throw err;
		  if (rows.info.numRows != 0) {
		  	res.redirect('/signup');
		  } else { // else if your all good
			c.query(insert(), function(err, rows) {
				res.redirect('/login');
			});
		  }
		});
		// adds email if good route to login page if no good re reoute to signup page
		
		
		
		c.end();
		
	},
	createPost_save(req,res) {
		var c = new Client({
		  host: '127.0.0.1',
		  user: 'root',
		  password: '',
		  db: 'play60'
		});

		var insert = c.prepare("INSERT INTO Posting (title,game,description,UID,event_time) VALUES (" + "'" + req.body.title_input + "'" + "," + "'" + req.body.game_input + "'"+ "," + "'" + req.body.details_input + "'"+ "," + "'" + parseInt(req.params.id) + "'"+ "," + "'" + req.body.time_input + "'" + ")" )
		c.query(insert(), function(err, rows) {
			if (err)
				throw err
		  	res.redirect('/' + req.params.id + '/home');
		});

		c.end();
	},

	posting(req,res) {
		res.send(req.params.id);
	}


}