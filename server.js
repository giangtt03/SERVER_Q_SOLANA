const express = require('express');
const session = require('express-session');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const favicon = require('express-favicon');


const app = express();
const port = 3000;

dotenv.config();

app.use(session({
    secret: 'giangtt653',
    resave: false,
    saveUninitialized: true
}));

// app.use(favicon(__dirname + '/public/favicon.ico'));

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log('Db connected')
}).catch((err)=> console.log(err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//ghi log các yêu cầu HTTP
app.use(morgan('dev'));

// ghi log cookie
app.use(cookieParser());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const authRouter = require('./routes/auth');


app.use('/', authRouter);

app.listen(process.env.PORT || port, () => console.log(`Server listening on ${process.env.PORT}!`));
