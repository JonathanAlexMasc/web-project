
const Mustache = require('mustache');
const fs = require("fs");
var formidable = require('formidable');
const path = require("path");

var hiddenFolder = "./uploads"
var folder = "./tmp"
var location = folder + "/temp.txt";
function pullData(data){

    //if no files yet, stop processing
    if(!fs.existsSync(folder))
        return;

    //template style
    data['filelist'] = fs.readdirSync(folder);

    //raw html style
    /*
    var items = fs.readdirSync(folder);
    var list = "<ul>";
    for( item of items){
        list += "<li>" + item + "</li>";
    }
    list += "</ul>";
    data['filelist'] = list;
    */
}


function getParams(req){
    let host = "http://" + req.headers.host;
    const query = new URL(req.url, host);

    return Object.fromEntries(query.searchParams);
}
function load(req, res, params){
    var data = getParams(req);

    pullData(data);

    data= Object.assign(data, params);

    try{
        let url =  path.join(__dirname,"mgmt.html");
        let content = fs.readFileSync(url);
        var output = Mustache.render(content.toString(), data);

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(output);

    }catch(err){
        //data dump
        console.log(err);
    }
    res.end();
}


//move mapping out of server call to app.get
function init(app, urlRoot = "/") {
    //override default location
    folder = path.join(__dirname, folder);
    hiddenFolder = path.join(__dirname, hiddenFolder);
    location = folder + '/temp.txt';

    app.get( urlRoot + "mgmt/read", function(req, res) {
        var data = getParams(req);
        console.log(location)
        console.log(fs.existsSync(location))
        if(fs.existsSync(location)) {
            var file = fs.readFileSync(location);
            data["read"] = file.toString().replaceAll("\n", "<br>");
        }

        load(req,res, data);
    });

    app.get(  urlRoot + "mgmt/download", function(req, res) {
        var path = location;
        var nameOfDownloadedFile = "temp.txt";

        res.download(path, nameOfDownloadedFile);
    });


    app.get(  urlRoot + "mgmt/write", function(req, res) {
        let host = "http://" + req.headers.host;
        const query = new URL(req.url, host);
        var data = Object.fromEntries(query.searchParams);
        var content = "";
        content += "\n" + data["stuff"] + "\n";
        content += data["more"] + "\n";

        //make the file is not already there, or append if it is
        if(!fs.existsSync(location)) {
            fs.writeFile(location, content, function (err) {
                if (err) throw err;
            });
        }
        else {
            fs.appendFile(location, content, function (err) {
                if (err) throw err;
            });
        }

        load(req,res);
    });

    app.post(urlRoot + "mgmt/upload", function(req, res) {
        var form = new formidable.IncomingForm();

        //these next three lines are optional, but a good idea
        form.multiples = false;
        form.maxFileSize = 50 * 1024 * 1024; // 5MB
        form.uploadDir = folder;

        form.parse(req, function(err, fields, files) {
            if (err != null) {
                console.log(err)
            } else {
                var oldpath = files.fileToUpload[0].filepath;
                var newpath = folder + "/" + "temp.txt";
                fs.rename(oldpath, newpath, function(err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('File replaced successfully.');
                    }
                });
            }
            res.redirect(urlRoot + "mgmt/mgmt.html");
        });

    });



    app.get(  urlRoot+ "mgmt/uploads/:file", function(req, res) {
        var path = hiddenFolder + "/" + req.params.file;
        res.download(path);

    });
}

function runPage(req, res) {
    load(req,res)
}

module.exports = {init, runPage};

