//  Challenge #3: Supervisor View (Final Level)
//  Create another Node app called `bamazonSupervisor.js`. 

require("dotenv").config();
require("console.table");
var clear = require("clear");
var mysql = require("mysql");
var inquirer = require("inquirer");
var keys = require("./keys.js");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: keys.mySQL.id,
    password: keys.mySQL.secret,
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    clear();
    supervisorScreen();
    start();
});

function supervisorScreen (){
    console.log("==========================================");
    console.log("[($)] [($)] BAMAZON SUPERVISOR [($)] [($)]")
    console.log("==========================================\n");
}

//  Running this app will list a set of menu options: View Product Sales by Department & Create New Department
function start() {
    inquirer.prompt ({
        name: "option",
        type: "list",
        message: "What Would You Like To Do?",
        choices: ["View Product Sales By Department","Create New Department","Exit"]
    }).then(function(answer) {
        if (answer.option === "View Product Sales By Department") {
            viewSales();
        } else if (answer.option === "Create New Department") {
            newDepartment();
        } else {
            connection.end();
        }
    });
}

// `View Product Sales by Department`should display a summarized table in their terminal/bash window. 
// `total_profit` should be calculated on the fly using `over_head_costs` and `product_sales`. 
// `total_profit` should not be stored in any database.
function viewSales () {
    clear();
    supervisorScreen();
    connection.query(
        "SELECT " +
            "departments.department_id AS 'Department ID', " +
            "departments.department_name AS 'Department Name', " +
            "departments.over_head_costs AS 'Over Head Costs', " +
            "SUM(products.product_sales) AS 'Product Sales', " +
            "SUM(products.product_sales) - departments.over_head_costs AS 'Total Profit' " +
        "FROM departments " +
        "LEFT JOIN products ON departments.department_name = products.department_name " +
        "GROUP BY departments.department_id", function(err, res) {
            if (err) throw err;
            console.table(res);
            start();
    })
}

// There were no instructions for this final part of the assignment
function newDepartment () {
    clear();
    supervisorScreen();
    inquirer.prompt([
        {
            name: "department_name",
            type: "input",
            message: "Name Of New Department?",
            validate: function(value) {
                if (value === "") {
                    return "Please Enter Department Name"
                } else {
                    return true;
                }
            }
        },{
            name: "over_head_costs",
            type: "input",
            message: "Over Head Costs?",
            validate: function(value){
                var valid = !isNaN(parseFloat(value));
                return valid || "Please Enter A Number";
            },
            filter: Number
        }
    ]).then(function(answer){
        connection.query(
            "INSERT INTO departments SET ?",
            {
                department_name: answer.department_name,
                over_head_costs: answer.over_head_costs
            },
            function(err) {
                if (err) throw err;
                start();
            }
        )
    })
}