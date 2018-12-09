var fs = require('fs');
const sqlite3 = require('sqlite3');
var JSONFile = 'Data.json'
let sqlCar = `SELECT   ID id,
                        BRAND brand,
                        MODEL model,
                        PRICE price
            FROM CARMODELS
            ORDER BY ID`;
    let sqlEmployee = `SELECT   ID id,
                        NAME name
            FROM EMPLOYEES
            ORDER BY ID`;
    
    let sqlSales = `SELECT   ID id,
                        EMPLOYEEID employee_id,
                        CARMODELID carmodel_id
            FROM SALES
            ORDER BY ID`;
let db = new sqlite3.Database('./carshopDataBase.db',sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    } else{
        console.log('Connected to the carshopDataBase database.');
    }
  });

//Responds to a HTTP GET request, sends all employee parameters except sales
//in JSON format as a response
function getEmployees(response, postData) {
    console.log("Request handler 'employees' was called.");
    var employees=[];
    db.each(sqlEmployee, (err, row)=> {
            if(err) {
                console.log(err);
            } else {
                employees.push({"id":`${row.id}`,"name":`${row.name}`});
            }  
        }, (err)=>{
            if(err) {
                console.log(err);
            } else {
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.write(JSON.stringify(employees));
                response.end();
            }  
        } );
}
//Responds to a HTTP GET request, sends all car models with parameters
//in JSON format as a response
function getCarModels(response, postData) {
    console.log("Request handler 'carmodels' was called.");
    carModels=[];
    db.each(sqlCar, (err, row)=> {
        if(err) {
            console.log(err);
        } else {
            carModels.push({"id":`${row.id}`,"brand":`${row.brand}`,"model":`${row.model}`,"price":`${row.price}`});
        }  
    }, (err)=>{
        if(err) {
            console.log(err);
        } else {
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.write(JSON.stringify(carModels));
            response.end();
        }  
    } );
}
//Responds to a HTTP GET request, sends all employee parameters and total sales
//value in JSON format as a response
function getTotalSales(response, postData) {
    console.log("Request handler 'total_sales' was called.");  
    db.serialize(()=> {
        var employees=[];
        var carModels=[];
        var sales=[];
        db.each(sqlCar, (err , row)=> {
            if(err) {
                console.log(err);
            } else {
                carModels.push({"id":`${row.id}`,"brand":`${row.brand}`,"model":`${row.model}`,"price":`${row.price}`});
            } 

        }
    ).each(sqlEmployee, (err, row)=> {
        if(err) {
            console.log(err);
        } else {
            employees.push({"id":`${row.id}`,"name":`${row.name}`});
        }  
    }
    ).each(sqlSales, (err, row)=>{
        if(err) {
            console.log(err);
        } else {
            sales.push({"id":`${row.id}`,"employee_id":`${row.employee_id}`,"carmodel_id":`${row.carmodel_id}`});
        } 
    },(err)=>{
        if(err) {
            console.log(err);
        } else {
            var totalSaleArray=[];
            for(var i=0; i<employees.length; i++){
                totalSaleArray[i]=0;
            }
            for (var i = 0; i < sales.length; i++) { 
                var sellerId=sales[i].employee_id-1;
                var carModelId=sales[i].carmodel_id-1;
                totalSaleArray[sellerId]=totalSaleArray[sellerId]+parseInt(carModels[carModelId].price,10)
            
            };

            for (var i = 0; i < employees.length; i++) {
                employees[i]["sales"]= totalSaleArray[i];
                }
            }
            response.writeHead(200, {'Content-Type': 'application/json'});
            response.write(JSON.stringify(employees));
            response.end();
            console.log("Response for GET /total_sales sent");   
    });   
    
})
}

//Responds to a HTTP POST request containing a carmodel in JSON format 
//and writes it to ./carmodelData.json
function postCarModel(response, postData){
    console.log("Request handler 'post_carmodel' was called")
        newModel = JSON.parse(postData);
        let sqlPOST='INSERT INTO CARMODELS VALUES('+newModel.id+","+"\'"+newModel.brand+"\'"+","+"\'"+newModel.model+"\'"+","+newModel.price+")"
        db.run(sqlPOST, function(err) {
            if (err) {
              return console.error(err.message);
            }
            console.log(`Rows inserted ${this.changes}`);
          });
          response.writeHead(200, {'Content-Type': 'application/json'});
          response.write(JSON.stringify(newModel));
          response.end();
          console.log("Response for GET /total_sales sent");  
        
    };  

exports.getEmployees = getEmployees;
exports.getCarModels = getCarModels;
exports.getTotalSales = getTotalSales;
exports.postCarModel = postCarModel;