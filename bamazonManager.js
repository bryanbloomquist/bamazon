//  Challenge #2: Manager View (Next Level)
//  Create a new Node application called `bamazonManager.js`.

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
    managerScreen();
    start();
});

function managerScreen (){
    console.log("=======================================");
    console.log("[($)] [($)] BAMAZON MANAGER [($)] [($)]")
    console.log("=======================================\n");
}

//  List a set of menu options: View Products for Sale / View Low Inventory / Add to Inventory / Add New Product
function start() {
    inquirer.prompt ({
        name: "option",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Products for Sale","View Low Inventory","Add To Inventory","Add New Product","Exit"]
    }).then(function(answer) {
        if (answer.option === "View Products for Sale") {
            seeInventory();
        } else if (answer.option === "View Low Inventory") {
            lowInventory();
        } else if (answer.option === "Add To Inventory") {
            addInventory();
        } else if (answer.option === "Add New Product") {
            newInventory();
        } else {
            connection.end();
        }
    });
}

// `View Products for Sale`should list every available item: the item IDs, names, prices, and quantities.
function seeInventory () {
    clear();
    connection.query("SELECT id AS 'ID', product_name AS 'Product Name', price AS 'Price', stock_quantity AS 'Stock Quantity' FROM products", function(err, res) {
        if (err) throw err;
        managerScreen();
        console.table(res);
        start();
    })
}

// `View Low Inventory` should list all items with an inventory count lower than five.
function lowInventory () {
    clear();
    connection.query("SELECT id AS 'ID', product_name AS 'Product Name', price AS 'Price', stock_quantity AS 'Stock Quantity' FROM products WHERE stock_quantity < 5", function(err, res) {
        if (err) throw err;
        managerScreen();
        console.table(res);
        start();
    })
}

//  `Add to Inventory` should display a prompt that will let the manager "add more" of any item currently in the store.
function addInventory () {
    clear();
    managerScreen();
    connection.query("SELECT id, product_name, stock_quantity FROM products", function(err, res) {
        if (err) throw err;
        inquirer.prompt ([
            {
                name: "choice",
                type: "list",
                choices: function() {
                    var choiceArray = [];
                    for (var i=0; i < res.length; i++) {
                        choiceArray.push(res[i].product_name);
                    }
                    return choiceArray;
                },
                message: "Which Item Would You Like To Add More Inventory To?"
            },{
                name: "amount",
                type: "input",
                message: "How Many Items Would You Like To Add To The Inventory?",
                validate: function(input) {
                    var valid = !isNaN(parseFloat(input));
                    return valid || "Please Enter A Number";
                },
                filter: Number
            }
        ]).then(function(answer) {
            var chosenItem;
            for (var i=0; i < res.length; i++) {
                if (res[i].product_name === answer.choice) {
                    chosenItem = res[i];
                }
            }
            var newQuantity = parseInt(chosenItem.stock_quantity) + parseInt(answer.amount)
            connection.query("UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: newQuantity
                    },{
                        id: chosenItem.id
                    }
                ],
                function(err) {
                    if (err) throw err;
                    start();
                }
            )
        })
    })
}

// `Add New Product` should allow the manager to add a completely new product to the store.
function newInventory () {
    clear();
    managerScreen();
    connection.query("SELECT department_name FROM departments", function(err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "product_name",
                type: "input",
                message: "Name Of New Inventory Item?",
                validate: function(value) {
                    if (value === "") {
                        return "Please Enter Product Name"
                    } else {
                        return true;
                    }
                }    
            },{
                name: "department_name",
                type: "list",
                choices: function() {
                    var choiceArray = [];
                    for (var i=0; i < res.length; i++) {
                        choiceArray.push(res[i].department_name);
                    }
                    return choiceArray;
                },
                message: "Which Department?"
            },{
                name: "price",
                type: "input",
                message: "Price?",
                validate: function(value){
                    var valid = !isNaN(parseFloat(value));
                    return valid || "Please Enter A Number";
                },
                filter: Number
            },{
                name: "stock_quantity",
                type: "input",
                message: "How Many?",
                validate: function(value){
                    var valid = !isNaN(parseFloat(value));
                    return valid || "Please Enter A Number";
                },
                filter: Number
            }
        ]).then(function(answer){
            connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: answer.product_name,
                    department_name: answer.department_name,
                    price: answer.price,
                    stock_quantity: answer.stock_quantity
                },
                function(err) {
                    if (err) throw err;
                    start();
                }
            )
        })
    })
}