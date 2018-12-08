var server = require('./server');
var router = require('./router');
var requestHandlers = require('./requestHandlers');

/*To add another endpoint add the pathname to the handle array
then bind it to the new function in the requestHandler file.
For POST http requests 'POST' will be automatically appended to
the pathname eg. if a POST request is sent to /carmodels it will call 
on the requestHandler function bound to handle["/carmodelsPOST"]
*/

var handle = {}
handle["/employees"] = requestHandlers.getEmployees;
handle["/carmodels"] = requestHandlers.getCarModels;
handle["/total_sales"] = requestHandlers.getTotalSales;
handle["/carmodelsPOST"] = requestHandlers.postCarModel;
var port = process.argv[2];
server.start(router.route, handle,port);
