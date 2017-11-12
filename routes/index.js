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


//GET individual posting
router.get('/:id/home/:pid',helpers.posting_get);

//GET edit indiviudal posting
router.get('/:id/home/:pid/edit',helpers.posting_update_get);


//post login info
router.post('/login',helpers.login_post);

//post signup info
router.post('/signup',helpers.signup_post);

//create post POST
router.post('/:id/createPost',helpers.createPost_save);

//update posting for going and maybe
//when you click either edit, going, or maybe
router.post('/:id/home/:pid',helpers.posting_post);

//update filters
router.post('/:id/home/',helpers.home_post);

//update posting details
router.post('/:id/home/:pid/edit',helpers.posting_update_post);

router.post('/:id/profile',helpers.profile_post);

module.exports = router;

