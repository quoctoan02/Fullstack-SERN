import express from 'express';
import bodyParser from 'body-parser';
import viewEngine from './config/viewEngine';
import initWebRouters from './route/web';
import connectDB from './config/connectDB';
import cors from 'cors';

require('dotenv').config();

const app = express();
const port = process.env.PORT;
app.use(cors({ origin: true }));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));

//view engine
viewEngine(app);
//web router
initWebRouters(app);

connectDB();

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
