//  Challenge #2: Manager View (Next Level)
//  Create a new Node application called `bamazonManager.js`. Running this application will:

var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "", //ENTER YOUR PASSWORD HERE//
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    start();
});

//  List a set of menu options:
//      View Products for Sale / View Low Inventory / Add to Inventory / Add New Product

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

//  If a manager selects `View Products for Sale`, the app should list every available item: 
//      the item IDs, names, prices, and quantities.

function seeInventory () {
    connection.query("SELECT id, product_name, price, stock_quantity FROM products", function(err, res) {
        if (err) throw err;
        console.table(res);
        start();
    })
}

//  If a manager selects `View Low Inventory`, then it should list all items with an inventory count lower than five.

function lowInventory () {
    
}

//  If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.

function addInventory () {
    
}

//  If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.

function newInventory () {
    
}