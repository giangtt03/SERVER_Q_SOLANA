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
const methodOverride = require('method-override');
const cron = require('node-cron');

const app = express();
const port = 3000;

app.use(cors());


dotenv.config();

app.use(session({
    secret: 'giangtt653',
    resave: false,
    saveUninitialized: true
}));

app.use(favicon(__dirname + '/public/faviacon.ico'));

app.use(express.static(path.join(__dirname, 'public')));


mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log('Db connected')
}).catch((err)=> console.log(err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method'));

//ghi log các yêu cầu HTTP
app.use(morgan('dev'));

// ghi log cookie
app.use(cookieParser());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// console.log("Views directory:", app.get('views'));

const authRouter = require('./routes/auth');
const categoryRouter = require('./routes/category');
const questionRouter = require('./routes/question');
const testRouter = require('./routes/test');

//api o fday
const apiAuthRouter = require('./routes/api/api.auth');
const apiTestRouter = require('./routes/api/api.testt');
const apiScoreRouter = require('./routes/api/api.score');
const apiRankRouter = require('./routes/api/api.rank');

app.use('/', authRouter);
app.use('/category', categoryRouter);
app.use('/question', questionRouter);
app.use('/test', testRouter);

//api o fday
app.use('/api', apiAuthRouter);
app.use('/api/quizz', apiTestRouter);
app.use('/api/score', apiScoreRouter);
app.use('/api/rank', apiRankRouter);

app.listen(process.env.PORT || port, () => console.log(`Server listening on ${process.env.PORT}!`));
