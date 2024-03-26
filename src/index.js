let http = require('http');
let fs = require('fs');
let pathModule = require('path');
let express = require('express');
let app = express();

/*
 * SOME VARIABLE DEFINITIONS
 */
var fileTransfer = require('./mgmt/mgmt');

// GET mgmt.html
app.get("/mgmt/mgmt.html", fileTransfer.runPage);

// Middleware for parsing JSON bodies
app.use(express.json());

// SERVE STATIC FILES EVERYWHERE
app.use(express.static( __dirname));

// DYNAMIC STUFF BELOW

//INITIALIZATION
fileTransfer.init(app);

app.listen(8080);
