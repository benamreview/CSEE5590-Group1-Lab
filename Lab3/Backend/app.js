const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const apiRouter = require('./routes/api');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use(cookieParser());

app.use('/api', apiRouter);

mongoose.connect('mongodb://localhost/lab3',  { useNewUrlParser: true });
mongoose.set('debug', true);

module.exports = app;
