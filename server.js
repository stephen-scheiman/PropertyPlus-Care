require('express-async-errors');
const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./routes');
const helpers = require('./utils/helpers');
const morgan = require('morgan');
const sequelize = require('./config/connection');
const errorHandler = require('./utils/error-handler');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

const hbs = exphbs.create({ extname: 'hbs', helpers });

const sess = {
  secret: process.env.SESS_SECRET,
  cookie: {
    maxAge: 60 * 60 * 24 * 1000,
    httpOnly: true,
    secure: false,
    sameSite: 'strict',
  },
  resave: false,
  rolling: true,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));

// Inform Express.js on which template engine to use
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);
app.use(errorHandler)

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});