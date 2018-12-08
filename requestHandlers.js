var fs = require('fs');
var employeeFile = './employeesData.json'
var modelFile = './carmodelData.json'

//Responds to a HTTP GET request, sends all employee parameters except sales
//in JSON format as a response
function getEmployees(response, postData) {
    fs.readFile(employeeFile, 'utf8', function (err, fileData) {
        if (err) {
            console.log(err);
        } else {
            var employeeData=JSON.parse(fileData);
            for (var i = 0; i < employeeData.length; i++) { 
                delete employeeData[i].sales;
            };
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.write(JSON.stringify(employeeData));
            response.end();
            console.log("Response for GET /employees sent");
        }
    });
}
//Responds to a HTTP GET request, sends all car models with parameters
//in JSON format as a response
function getCarModels(response, postData) {
    console.log("Request handler 'carmodels' was called.");
    fs.readFile(modelFile, 'utf8', function (err, fileData) {
        if (err) {
            console.log(err);
        } else {
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.write(fileData);
            response.end();
            console.log("Response for GET /carmodels sent");
        }
    });
}
//Responds to a HTTP GET request, sends all employee parameters and total sales
//value in JSON format as a response
function getTotalSales(response, postData) {
    fs.readFile(employeeFile, 'utf8', function (err, fileData) {
        if (err) {
            console.log(err);
        } else {
            var employeeData=JSON.parse(fileData);
            for (var i = 0; i < employeeData.length; i++) { 
                var totalSales=0;
                for (var j = 0; j < employeeData[i].sales.length; j++){
                    totalSales += employeeData[i].sales[j].sale;
                }
                employeeData[i].sales=totalSales;
            }
        };
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.write(JSON.stringify(employeeData));
        response.end();
        console.log("Response for GET /total_sales sent");
    });
}
//Responds to a HTTP POST request containing a carmodel in JSON format 
//and writes it to ./carmodelData.json
function postCarModel(response, postData){
    console.log("Request handler 'post_carmodel' was called")
    fs.readFile(modelFile, 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {   
        existingModels = JSON.parse(data);
        newModel = JSON.parse(postData);
        existingModels.push(newModel[0]);
        allModelsJSON = JSON.stringify(existingModels, null, 2);
        fs.writeFile(modelFile, allModelsJSON, 'utf8', function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log('carModelData.json was updated.');
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.write(JSON.stringify(newModel[0]));
                response.end();
                console.log("Response for POST /carmodels sent");
            }
        });
        }
        });  
}
exports.getEmployees = getEmployees;
exports.getCarModels = getCarModels;
exports.getTotalSales = getTotalSales;
exports.postCarModel = postCarModel;