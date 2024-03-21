let http = require('http');
let fs = require('fs');
let pathModule = require('path');
let express = require('express');
let app = express();

/*
 * SOME VARIABLE DEFINITIONS
 */




app.use(express.static( __dirname));

app.listen(8080);
