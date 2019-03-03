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
    connection.query("SELECT id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 5", function(err, res) {
        if (err) throw err;
        console.table(res);
        start();
    })
}

//  If a manager selects `Add to Inventory`, your app should display a prompt that will let the manager "add more" of any item currently in the store.

function addInventory () {
    connection.query("SELECT id, product_name, stock_quantity FROM products", function(err, res) {
        if (err) throw err;
        inquirer.prompt ([
            {
                name: "choice",
                type: "rawlist",
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

//  If a manager selects `Add New Product`, it should allow the manager to add a completely new product to the store.

function newInventory () {
    
}