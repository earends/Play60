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
		var groupBy = c.prepare('SELECT AVG(cnt) as avg FROM (SELECT COUNT(*) AS cnt FROM Posting GROUP BY (UID)) AS T');

		var get = c.prepare("SELECT * FROM User WHERE UID=" + "'" + req.params.id + "'");
		var getCount = c.prepare("SELECT count(PID) as pidcount FROM Posting JOIN User USING (UID) WHERE UID =" + req.params.id);
		var getCountBySport = c.prepare("SELECT game,count(PID) as pidcount FROM (SELECT * FROM Posting WHERE UID = " + req.params.id + ") as T GROUP BY (game)");

		//var getCountBySport = 
		c.query(get(), function(err, rows) {
			if (err)
				throw err
			c.query(getCount(), function(err, rows1) {
				if (err)
					throw err
				c.query(getCountBySport(), function(err, rows2) {
					if (err)
						throw err
						c.query(groupBy(), function(err, rows3) {
						if (err)
							throw err
						res.render('profile', {user:rows[0], uid: req.params.id,count_pid:rows1[0],p_sport_count:rows2,other:rows3[0]});
					});
				});
				
			});
			
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
		var timeInMs = Date.now();
		var insert = c.prepare("INSERT INTO Posting (title,game,description,UID,event_time,zipcode,timestamp) VALUES (" + "'" + req.body.title_input + "'" + "," + "'" + req.body.game_input + "'"+ "," + "'" + req.body.details_input + "'"+ "," + "'" + parseInt(req.params.id) + "'"+ "," + "'" + req.body.time_input + "'" + "," + "'" +req.body.zip_input + "'" + ","  + timeInMs +  ")" )
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

		
		if (req.body.going == null && req.body.maybe == null) {
			if (req.body.edit == null) {
				console.log('delete clicked');
				var d = c.prepare("DELETE FROM Posting WHERE PID = " + req.params.pid);
				c.query(d(), function(err, rows) {
					if (err)
						throw err
					res.redirect('/' + req.params.id + '/profile');
				});
				c.end();
			} else {
				console.log('edit clicked');
				res.redirect('/' + req.params.id +/home/ + req.params.pid + '/edit');
			}
			
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

	home_post(req,res) {
		
		var string = 'SELECT * FROM Posting ';
		first_flag = true;
		date_flag = false;
		popularity_flag = false;
		if (req.body.owned != null) {
			string = string + "WHERE UID = " + "'" + req.params.id + "'";
			first_flag = false
		}
		if (req.body.pop != null) {
			popularity_flag = true;
		}
		if (req.body.date != null) {
			date_flag = true;
		}
		if (req.body.football != null) {
			if (first_flag) {
				string = string + " WHERE game = 'football' ";
				first_flag = false;
			} else {
				string = string + " OR game = 'football' ";
			}

		}
		if (req.body.soccer != null) {
			if (first_flag) {
				string = string + " WHERE game = 'soccer' ";
				first_flag = false;
			} else {
				string = string + " OR game = 'soccer' ";
			}
		}
		if (req.body.basketball != null) {
			if (first_flag) {
				string = string + " WHERE game = 'basketball' ";
				first_flag = false;
			} else {
				string = string + " OR game = 'basketball' ";
			}
		}
		if (req.body.baseball != null) {
			if (first_flag) {
				string = string + " WHERE game = 'baseball' ";
				first_flag = false;
			} else {
				string = string + " OR game = 'baseball' ";
			}
		}
		
		if (req.body.zip_input != '') {
			if (first_flag) {
				string = string + " WHERE zipcode = '" + req.body.zip_input + "'";
				first_flag = false;
			} else {
				string = string + " OR zipcode = '" + req.body.zip_input + "'";
			}
		}
		var c = new Client({
		  host: '127.0.0.1',
		  user: 'root',
		  password: '',
		  db: 'play60'
		});

		if (popularity_flag) {
			var findMost = 'SELECT game, count(*)  FROM Posting GROUP BY game order by count(*) DESC LIMIT 1';
			var find = c.prepare(findMost);
			c.query(find(), function(err, rows) {
				if (err)
					throw err
				var game = rows[0].game;
				findGame = 'SELECT * FROM Posting WHERE game = ' + "'" + game + "'";
				if (date_flag) {
					findGame = findGame + " ORDER BY timestamp DESC"
				}
				var findGamePrep = c.prepare(findGame);
				c.query(findGamePrep(), function(err, rows1) {
					if (err)
						throw err
					res.render('home',{ uid:req.params.id, postings: rows1 })
				});
				
			});
		} else {
			if (date_flag) {
			string = string + " ORDER BY timestamp"
			var get = c.prepare(string)
			c.query(get(), function(err, rows) {
				if (err)
					throw err
				res.render('home',{ uid:req.params.id, postings: rows })
			});
			} else {
				var get = c.prepare(string)
				c.query(get(), function(err, rows) {
					if (err)
						throw err
					res.render('home',{ uid:req.params.id, postings: rows })
				});
			}
		}

		
		


		
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