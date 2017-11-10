var express = require('express');
var router = express.Router();
var helpers = require('../controllers/homeController.js');


/* GET main page route to login page */
router.get('/', function(req, res, next) {
  res.redirect('/login');
});

//GET login page
router.get('/login',helpers.login);

//redirect to login page because no id
router.get('/home', function(req, res, next) {
  res.send('respond with a resource');
});

//signup page
router.get('/signup',helpers.signup);

//get personalized home page
router.get('/:id/home',helpers.home);

//get post page
router.get('/:id/createPost',helpers.createPost);

//get user profile page
router.get('/:id/profile',helpers.profile);

//get user profile edit page
router.get('/:id/profile_settings',helpers.profile_settings);

//post user profile settings save page
router.post('/:id/profile_settings',helpers.profile_settings_save);

//post login info
router.post('/login',helpers.login_post);

//post signup info
router.post('/signup',helpers.signup_post);

//create post POST
router.post('/:id/createPost',helpers.createPost_save);


module.exports = router;

