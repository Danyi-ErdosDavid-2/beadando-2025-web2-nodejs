const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
require('dotenv').config();

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const databaseRouter = require('./routes/database');
const contactRouter = require('./routes/contact');
const crudRouter = require('./routes/crud');
const { exposeUser } = require('./middleware/auth');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const sessionStore = new MySQLStore({
  host: process.env.DB_HOST || '143.47.98.96',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME || process.env.DB_USER,
  clearExpired: true,
  expiration: 1000 * 60 * 60 * 24,
  createDatabaseTable: true,
});

app.use(
  session({
    key: 'session_cookie_name',
    secret: process.env.SESSION_SECRET || 'session_cookie_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/app117', express.static(path.join(__dirname, 'public')));
app.use(exposeUser);

app.use('/app117', indexRouter);
app.use('/app117/auth', authRouter);
app.use('/app117/adatbazis', databaseRouter);
app.use('/app117/kapcsolat', contactRouter);
app.use('/app117/crud', crudRouter);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
