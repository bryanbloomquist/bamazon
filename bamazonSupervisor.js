//  Challenge #3: Supervisor View (Final Level)
//  Create another Node app called `bamazonSupervisor.js`. 

require("dotenv").config();
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
    start();
});

//  Running this application will list a set of menu options:
//      View Product Sales by Department
//      Create New Department

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

//  When a supervisor selects `View Product Sales by Department`, the app should display a summarized table 
//      in their terminal/bash window. Use the table below as a guide.
//              | department_id | department_name | over_head_costs | product_sales | total_profit |
//              | ------------- | --------------- | --------------- | ------------- | ------------ |
//              | 01            | Electronics     | 10000           | 20000         | 10000        |
//              | 02            | Clothing        | 60000           | 100000        | 40000        |
//  The `total_profit` column should be calculated on the fly using the difference between `over_head_costs` and `product_sales`. `total_profit` should not be stored in any database. You should use a custom alias.
//  If you can't get the table to display properly after a few hours, then feel free to go back and just add `total_profit` to the `departments` table.
//      Hint: You may need to look into aliases in MySQL.
//      Hint: You may need to look into GROUP BYs.
//      Hint: You may need to look into JOINS.
//      **HINT**: There may be an NPM package that can log the table to the console. What's is it? Good question :)

function viewSales () {
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

// There were no parameters/instructions for this final part of the assignment

function newDepartment () {
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