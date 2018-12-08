var http = require('http');
var url = require('url');

function start(route, handle, port) {
    http.createServer(function (request, response) {
        var pathname = url.parse(request.url).pathname;
        var postData ='';
        if(request.method=='POST') {
            console.log("POST Request for " + pathname + " received.");
            request.on('data', function (data) {
                postData+=data;
            });
            request.on('end', function (data) {
                var postPath = pathname + "POST"
                route(handle, postPath, response, postData)
            });
        }
        else if(request.method=='GET') {
            console.log("GET Request for " + pathname + " received.");
            route(handle, pathname, response, postData);
        }
        else {
            console.log(request.method+" request received but is not defined for this endpoint");
            response.writeHead(200, {"Content-Type": "text/plain"});
            response.write(request.method+" request received but is not defined for this endpoint");
            response.end();
        }
        
    }).listen(port);  
console.log("Server has started.");
}
exports.start = start;