require('dotenv').config();

const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// require database configuration
require('./configs/db.config');

// session configuration
const session = require('express-session');
// session store using mongo
const MongoStore = require('connect-mongo')(session)

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        cookie: { maxAge: 1000 * 60 * 60 * 24 },
        saveUninitialized: false,
        //Forces the session to be saved back to the session store, 
        // even if the session was never modified during the request.
        resave: true,
        store: new MongoStore({
            mongooseConnection: mongoose.connection
        })
    })
)
// end of session configuration


// Middleware Setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title local
const projectName = "express-basic-auth";
const capitalized = (string) => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with IronGenerator`;

const index = require('./routes/index.routes');
app.use('/', index);

const signup = require('./routes/signup.routes');
app.use('/', signup);

const login = require('./routes/login.routes');
app.use('/', login);

module.exports = app;
