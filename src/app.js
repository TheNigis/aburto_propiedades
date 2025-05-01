const path    = require('path');
const express = require('express');
const flash   = require('express-flash');
const app     = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(flash());

if (process.env.MONGO_USER != 0){
    global.link = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}`; //:${process.env.MONGO_PORT}
    global.link_collection = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}`; //:${process.env.MONGO_PORT}
    global.query = `?retryWrites=true&w=majority&appName=ImpulsaCiencia`
} 

if  (process.env.MONGO_USER == 0){
    global.link =  `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`
    global.link_collection =  `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`
    global.query = `?authSource=admin`
}

const cors = require('cors');
app.use(cors());

const morgan = require('morgan');
let morganConfig;

switch (process.env.MODE) {
    case 'TESTING':
        morganConfig = 'common';
        break;

    case 'DEVELOPMENT':
        morganConfig = 'dev';
        break;

    case 'PRODUCTION':
        morganConfig = 'combined';
        break;

    default:
        morganConfig = 'common'
        break;
}


app.use(morgan(morganConfig));

const session               = require('express-session');
const MongoDbStore          = require('connect-mongodb-session')(session);

let mongoStore = new MongoDbStore({
    uri: global.link,
    collection: 'sessions'
});

//${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@

//?retryWrites=true&w=majority

const passport = require('passport');

app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
	store: mongoStore,
	saveUninitialized: false,
	ignoreConcurrency: true,
	cookie: { maxAge: 60 * 60 * 24 * 365 } // 365 dias { maxAge: 31536000000 }
}));

require('./auth/passport');

app.use(passport.initialize());
app.use(passport.session());

switch (process.env.HANDLER_MODE) {
    case 'LOCALHOST':
        app.locals.port = process.env.PORT;
        break;
    
    case 'DEVELOPMENT':
        app.locals.port = process.env.PORT;
        break;
    
    case 'PRODUCTION':
        app.locals.port = process.env.PORT;
        break;
    
    default:
        break;
}

app.locals.link = process.env.HOST;
app.locals.port = process.env.PORT;

// template engine
app.set('views', path.join(__dirname, '/templates/views'));
app.set('view engine', 'ejs');

const expressLayout = require('express-ejs-layouts');
app.use(expressLayout);

app.set('layout', path.join(__dirname, '/templates/layouts/default'));
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);

const indexRoutes = require('./routes/index');
const adminRoutes = require('./routes/admin');

const notFoundHandler = require('./middlewares/not-found');
const checkSession = require('./middlewares/check-session');
const { setCustomSessionInfo } = require('./middlewares/session-info');

app.use( setCustomSessionInfo );

app.use('/', indexRoutes); 
app.use('/admin', adminRoutes); 

app.use("/static", express.static(path.join(__dirname + '/../public')));
app.use("*", notFoundHandler);

app.locals.link = process.env.HOST;

module.exports = app;