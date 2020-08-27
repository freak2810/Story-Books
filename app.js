const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const mongoose =require('mongoose');
const connectDB = require('./config/db');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);



//Load Configuration
dotenv.config({path: './config/config.env'})

//Passport Config
require('./config/passport')(passport)

connectDB()

const app = express()

//Body Parser
app.use(express.urlencoded({extended:false}))
app.use(express.json())

//Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//Initialise a static folder for assets
app.use(express.static(path.join(__dirname,'public')));

//Handle-bars
app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', '.hbs')

//Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store:new MongoStore({mongooseConnection:mongoose.connection})
}))

//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 3000

app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
