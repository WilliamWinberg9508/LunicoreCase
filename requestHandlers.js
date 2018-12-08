var fs = require('fs');
var JSONFile = 'Data.json'

//Responds to a HTTP GET request, sends all employee parameters except sales
//in JSON format as a response
function getEmployees(response, postData) {
    fs.readFile(JSONFile, 'utf8', function (err, fileData) {
        if (err) {
            console.log(err);
        } else {
            var employeeData=JSON.parse(fileData).carshop.employees;
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
    fs.readFile(JSONFile, 'utf8', function (err, fileData) {
        if (err) {
            console.log(err);
        } else {
            var carData=JSON.parse(fileData).carshop.carmodels;
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.write(JSON.stringify(carData));
            response.end();
            console.log("Response for GET /carmodels sent");
        }
    });
}
//Responds to a HTTP GET request, sends all employee parameters and total sales
//value in JSON format as a response
function getTotalSales(response, postData) {
    fs.readFile(JSONFile, 'utf8', function (err, fileData) {
        if (err) {
            console.log(err);
        } else {
            var Data=JSON.parse(fileData);
            var employeeData=Data.carshop.employees;
            var salesData=Data.carshop.sales;
            var carData=Data.carshop.carmodels;
            var totalSaleArray=[];
            for(var i=0; i<employeeData.length; i++){
                totalSaleArray[i]=0;
            }
            for (var i = 0; i < salesData.length; i++) { 
                var sellerId=salesData[i].employee_id-1;
                var carModelId=salesData[i].carmodel_id-1;
                totalSaleArray[sellerId]=totalSaleArray[sellerId]+carData[carModelId].price;
            };
            for (var i = 0; i < employeeData.length; i++) {
                employeeData[i]["sales"]= totalSaleArray[i];
                }
            }
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.write(JSON.stringify(employeeData));
            response.end();
            console.log("Response for GET /total_sales sent");
        });
    };

//Responds to a HTTP POST request containing a carmodel in JSON format 
//and writes it to ./carmodelData.json
function postCarModel(response, postData){
    console.log("Request handler 'post_carmodel' was called")
    fs.readFile(JSONFile, 'utf8', function readFileCallback(err, data){
        if (err){
            console.log(err);
        } else {   
        JSONData=JSON.parse(data);    
        existingModels = JSONData.carshop.carmodels;
        newModel = JSON.parse(postData);
        newModel["id"] = existingModels.length+1;
        existingModels.push(newModel);
        JSONData.carshop["carmodels"]=existingModels;
        updatedData = JSON.stringify(JSONData, null, 2);
        fs.writeFile(JSONFile, updatedData, 'utf8', function(err) {
            if(err) {
                console.log(err);
            } else {
                console.log('carModelData.json was updated.');
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.write(JSON.stringify(newModel));
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