// ====================================================
// ROUTING
// ====================================================

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var passport = require('passport');

// #Controllers.
var getCtrl = require('./controllers/index_get');
var postCtrl = require('./controllers/index_post');

var cfg = require('_/config');
var router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(methodOverride());


// # Get
router.get("/", getCtrl.index);
router.get('/login', getCtrl.login);
router.get('/registrations', getCtrl.adminRegistrations);
router.get('/invite/confirm/:token_value', getCtrl.confirmInvitation);
router.get('/confirmed', getCtrl.confirmedAuth);

// #Posts
router.post('/invitation/signup',postCtrl.signUpAction);


module.exports = router;
