require("dotenv").config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./routes/Router');
const mongoose  = require("./database/mongodb/connection");


const app = express();

// confg Json response
app.use(express.json());
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
//cors
app.use(cors({ credentials: true, origin: 'http://localhost:3000'}));
// upload directory
app.use(express.static('public'));
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use(router);

app.listen(5000, () => {
    console.log('App rodando da porta 5000');
});