let http = require('http');
let fs = require('fs');

let server = http.createServer(function (req, res) {

    let host = "http://" + req.headers.host;
    const query = new URL(req.url, host); //optional second paramter, that should be the root of the website
    let path = "." + query.pathname;

    if( path ==="./" ) //index page
        path = "./index.html"

    let extension = path.split('.').pop();
    if(extension === "html"){
        try{
            let content = fs.readFileSync(path);
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(content);

        }catch(err){
            //data dump
            console.log(err);
        }
    }

    res.end();
});

server.listen(8080);