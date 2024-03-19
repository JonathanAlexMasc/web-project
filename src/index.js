let http = require('http');
let fs = require('fs');
let pathModule = require('path');

let server = http.createServer(function (req, res) {
    let host = "http://" + req.headers.host;
    const query = new URL(req.url, host);
    let path = "." + query.pathname;

    if (path === "./") {
        path = "./index.html";
    }

    let extension = pathModule.extname(path).toLowerCase();

    try {
        let content;
        let contentType;

        // Serve HTML files
        if (extension === ".html") {
            content = fs.readFileSync(path);
            contentType = 'text/html';
        }
        // Serve CSS files
        else if (extension === ".css") {
            content = fs.readFileSync(path);
            contentType = 'text/css';
        }
        // Add other file types as needed

        // Send response
        if (content) {
            res.writeHead(200, {'Content-Type': contentType});
            res.write(content);
            res.end();
        } else {
            // Return 404 if file type is not supported
            res.writeHead(404);
            res.end();
        }
    } catch(err) {
        // Log any errors
        console.log(err);
        res.writeHead(500);
        res.end();
    }
});

server.listen(8080);
