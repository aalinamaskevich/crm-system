const express = require('express')
const mongoose = require('mongoose')
const cors = require("cors")
const bodyParser = require('body-parser');

const {PORT, DB_URL} = require('./config');

const accountRouter = require('./routes/AccountRouter');
const profileInfoRouter = require('./routes/ProfileInfoRouter');
const categoryRouter = require('./routes/CategoryRouter');
const aimRouter = require('./routes/AimRouter');
const itemRouter = require('./routes/ItemRouter');
const imageRouter = require('./routes/ImageRouter');

const app = express(); 

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', 'html');

app.use(cors());
app.use(bodyParser.json());

const start = async () => {
    try{
        await mongoose.connect(DB_URL, {}).then(() => {
            console.log('Connected to database successfully');
        });

        app.use('/api/account', accountRouter);
        app.use('/api/profile-info', profileInfoRouter);
        app.use('/api/category', categoryRouter);
        app.use('/api/aims', aimRouter);
        app.use('/api/item', itemRouter);
        app.use('/api/img', imageRouter);

        app.listen(PORT, () => {
            console.log(`App listening on port ${PORT}`);
        })
    }catch (e){
        console.log(e);
    }
}

start();