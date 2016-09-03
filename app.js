'use strict';

//Setup env
require('dotenv').config({ silent: true });

//Set Modules & variables
let express = require('express')
    , session = require('express-session')
	, KnexSessionStore = require('connect-session-knex')(session)
    , app = express()
    , bodyParser = require('body-parser')
    , cookieParser = require('cookie-parser')
    , layoutEngine = require('express-ejs-layouts')
    , passport = require('./auth/passport')
    , flash = require('connect-flash')
	, loadUser = require('./middlewares/load-user')
    , loadFlashMessages = require('./middlewares/load-flash-messages')
    , loadPageURL = require('./middlewares/load-page-url')
    , loadSecretKeys = require('./middlewares/load-secret-keys');

var db = require('./database/database');

//App configuration
let port = process.env.PORT;
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(layoutEngine);
//app.use(function (req, res, next) {
//    res.setHeader('charset', 'utf-8');
//    next();
//});
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'pickedin-session-secret', 
	resave: false, 
	saveUninitialized: false,
	store: new KnexSessionStore({
		knex: db.knex,
		tablename: 'sessions' // optional. Defaults to 'sessions'
	})
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());
app.use(loadPageURL);
app.use(loadUser);
app.use(loadUser);
app.use(loadFlashMessages);
app.use(loadSecretKeys);
app.use(require('./controllers'));

//Listen to port
app.listen(port, function () {
    console.log('Listening on port ' + port);
});