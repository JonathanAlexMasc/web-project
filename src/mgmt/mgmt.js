const Mustache = require('mustache');
const fs = require("fs");
const formidable = require('formidable');
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

function deleteFile(req, res) {
    const filename = req.params.filename; // Assuming filename is passed as a parameter in the URL

    const filePath = path.join(folder, filename); // Constructing the file path

    // Check if the file exists
    if (fs.existsSync(filePath)) {
        // Delete the file
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
                res.status(500).send('Error deleting file');
            } else {
                console.log('File deleted successfully:', filename);
                res.status(200).send('File deleted successfully');
            }
        });
    } else {
        // If the file doesn't exist, return an error response
        res.status(404).send('File not found');
    }
}

//move mapping out of server call to app.get
function init(app, urlRoot = "/") {
    //override default location
    folder = path.join(__dirname, folder);
    hiddenFolder = path.join(__dirname, hiddenFolder);
    location = folder + '/temp.txt';

    app.delete(urlRoot + "mgmt/delete/:filename", deleteFile);

    app.get( urlRoot + "mgmt/read", function(req, res) {
        var data = getParams(req);
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

    app.post(urlRoot + "saveDataEndpoint", function(req, res) {
        const data = req.body; // Assuming data is sent in the request body

        const jsonString = JSON.stringify(data);

        // Write data to a file named "data.json" in the hiddenFolder
        const filePath = path.join(hiddenFolder, "data.json");

        fs.writeFile(filePath, jsonString, function(err) {
            if (err) {
                console.error('Error saving data:', err);
                res.status(500).send('Error saving data');
            } else {
                console.log('Data saved successfully');
                res.status(200).send('Data saved successfully');
            }
        });
    });


}

function runPage(req, res) {
    load(req,res)
}

module.exports = {init, runPage};

