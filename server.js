var http = require('http');
var url = require('url');

function start(route, handle,port) {
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
        else{
            console.log("GET Request for " + pathname + " received.");
            route(handle, pathname, response, postData);
        }
    }).listen(port);  
console.log("Server has started.");
}
exports.start = start;