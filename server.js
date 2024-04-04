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

app.use(favicon(__dirname + '/public/favicon.ico'));

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

// app.get('/nft/mintNfts', (req, res) => {
//     res.render('blockchain/nft');
// });

// app.get('/nft', (req, res) => {
//     res.render('blockchain/getAllnfts');
// });


const authRouter = require('./routes/auth');
const categoryRouter = require('./routes/category');
const questionRouter = require('./routes/question');
const testRouter = require('./routes/test');
const nftRouter = require('./routes/nft');

//api o fday
const apiAuthRouter = require('./routes/api/api.auth');
const apiTestRouter = require('./routes/api/api.testt');
const apiScoreRouter = require('./routes/api/api.score');
const apiRankRouter = require('./routes/api/api.rank');
const apiCapchaRouter = require('./routes/api/api.capcha');
const apiHelpRouter = require('./routes/api/api.help');
// const apiNftRouter = require('./routes/api/tranfer');
const apiNotifnftRouter = require('./routes/api/api.notifnft');


app.use('/', authRouter);
app.use('/category', categoryRouter);
app.use('/question', questionRouter);
app.use('/test', testRouter);
app.use('/nft', nftRouter);

//api o fday
app.use('/api', apiAuthRouter);
app.use('/api/quizz', apiTestRouter);
app.use('/api/score', apiScoreRouter);
app.use('/api/rank', apiRankRouter);
app.use('/api/capcha', apiCapchaRouter);
app.use('/api/help', apiHelpRouter);
// app.use('/api/nft', apiNftRouter);
app.use('/api/notf', apiNotifnftRouter);



app.listen(process.env.PORT || port, () => console.log(`Server listening on ${process.env.PORT}!`));
