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
		res.render('login');
	},
	signup(req, res) {
		res.render('signup',{error: 'none'});
	},
	createPost(req, res) {
		res.render('create_post', { uid: req.params.id });
	},
	profile(req, res) {
		var c = new Client({
		  host: '127.0.0.1',
		  user: 'root',
		  password: '',
		  db: 'play60'
		});
		var get = c.prepare("SELECT * FROM User WHERE UID=" + "'" + req.params.id + "'");
		c.query(get(), function(err, rows) {
			if (err)
				throw err
			res.render('profile', {data:rows[0], uid: req.params.id });
		});	
		
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
		  
		  if (rows.info.numRows == 1) {
		  	res.redirect('/' + rows[0].UID + '/home');
		  } else {
		  	res.render('login',{error: 'wrong'})
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
		if (req.body.password_input != req.body.password_c_input) {
			res.render('signup',{error:'password-match'})
			return;
		}
		var check = c.prepare('SELECT email FROM User WHERE email =' + "'" + req.body.email_input + "'");
		var insert = c.prepare("INSERT INTO User (name,age,email,password) VALUES (" + "'" + req.body.name_input + "'" + "," + "'" + req.body.age_input + "'" + "," + "'" + req.body.email_input + "'"+ "," + "'" + req.body.password_input + "'" + ")");
		//checks to see if email is already in their if so re route to signup
		c.query(check(), function(err, rows) {
		  if (err)
		    res.res.render('signup',{error: 'in-use'})
		  if (rows.info.numRows != 0) {
		  	res.render('signup',{error:'in-use'});
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

		var insert = c.prepare("INSERT INTO Posting (title,game,description,UID,event_time,zipcode) VALUES (" + "'" + req.body.title_input + "'" + "," + "'" + req.body.game_input + "'"+ "," + "'" + req.body.details_input + "'"+ "," + "'" + parseInt(req.params.id) + "'"+ "," + "'" + req.body.time_input + "'" + "," + "'" +req.body.zip_input + "'" + ")" )
		c.query(insert(), function(err, rows) {
			if (err)
				throw err
		  	res.redirect('/' + req.params.id + '/home');
		});

		c.end();
	},

	posting_get(req,res) {
		var c = new Client({
		  host: '127.0.0.1',
		  user: 'root',
		  password: '',
		  db: 'play60'
		});

		var get = c.prepare("SELECT * FROM Posting WHERE PID =" + "'" +req.params.pid + "'")
		
		c.query(get(), function(err, rows) {
			if (err)
				throw err
			
			if (req.params.id == rows[0].UID) {
				res.render('posting',{data:rows[0],uid:req.params.id,pid: req.params.pid,owner:true})
			} else {
				res.render('posting',{data:rows[0],uid:req.params.id,pid:req.params.pid,owner:false})
			}
		  	
		});

		c.end();
		
	},
	posting_post(req,res) {
		var c = new Client({
		  host: '127.0.0.1',
		  user: 'root',
		  password: '',
		  db: 'play60'
		});

		console.log('here')
		if (req.body.going == null && req.body.maybe == null) {
			console.log('edit clicked')
			res.redirect('/' + req.params.id +/home/ + req.params.pid + '/edit');
			

		} else if (req.body.maybe == null) {
			var maybe = c.prepare()
			console.log('going clicked')
			var count_going = c.prepare("SELECT going FROM Posting WHERE PID =" + "'" +req.params.pid + "'")
			
			c.query(count_going(), function(err, rows) {
				if (err)
					throw err
				var update = c.prepare("UPDATE Posting SET going =" + "'" + (parseInt(rows[0].going) + 1) + "'" + "WHERE PID =" + "'" + req.params.pid + "'")
				c.query(update(), function(err, rows) {

					if (err)
						throw err
					res.redirect('/' + req.params.id + '/home')
				});	
			});
			c.end();
		} else {
			console.log('maybe clicked')
			var count_maybe = c.prepare("SELECT maybe FROM Posting WHERE PID =" + "'" +req.params.pid + "'")
			
			c.query(count_maybe(), function(err, rows) {
				if (err)
					throw err
				var update = c.prepare("UPDATE Posting SET maybe =" + "'" + (parseInt(rows[0].maybe) + 1) + "'" + "WHERE PID =" + "'" + req.params.pid + "'")
				c.query(update(), function(err, rows) {

					if (err)
						throw err
					res.redirect('/' + req.params.id + '/home')
				});	
			});
			c.end();
		}

	},

	home_update(req,res) {
		res.send('home_update');
	},

	posting_update_get(req,res) {
		var c = new Client({
		  host: '127.0.0.1',
		  user: 'root',
		  password: '',
		  db: 'play60'
		});

		var get = c.prepare("SELECT title FROM Posting WHERE PID =" + "'" +req.params.pid + "'")
		c.query(get(), function(err, rows) {
			if (err)
				throw err
			res.render('posting_update',{uid:req.params.id,pid:req.params.pid,title:rows[0].title})
		});
		c.end();
		
	},

	posting_update_post(req,res) {
		console.log('going here');
		var c = new Client({
		  host: '127.0.0.1',
		  user: 'root',
		  password: '',
		  db: 'play60'
		});
		var update = c.prepare("UPDATE Posting SET title =" + "'" + req.body.title_input + "'" + "," + "game =" + "'" + req.body.game_input + "'"+ "," + "event_time =" + "'" + req.body.time_input + "'"+ "," + "zipcode =" + "'" + req.body.zip_input + "'"+ "," + "description =" + "'" + req.body.details_input + "'" + "WHERE PID =" + "'" + req.params.pid + "'")
		c.query(update(), function(err, rows) {
			if (err)
				throw err
			res.redirect('/' + req.params.id + '/home')
		});

		c.end();
	},
	profile_post(req,res) {
		var c = new Client({
		  host: '127.0.0.1',
		  user: 'root',
		  password: '',
		  db: 'play60'
		});
		var update = c.prepare("UPDATE User SET name =" + "'" + req.body.name_input + "'" + "," + "age =" + "'" + req.body.age_input + "'"+ "," + "email =" + "'" + req.body.email_input + "'"+ "," + "password =" + "'" + req.body.new_password_input + "'" + 'WHERE UID =' + "'" + req.params.id + "'")
		c.query(update(), function(err, rows) {
			if (err)
				throw err
			res.redirect('/login');
		});
		c.end();
	}
 

}