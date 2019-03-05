//  Challenge #1: Customer View (Minimum Requirement)
//  Create a Node application called `bamazonCustomer.js`

require("dotenv").config();
require("console.table");
var clear = require("clear");
var mysql = require("mysql");
var inquirer = require("inquirer");
var keys = require("./keys.js");
var choiceArray = [];
var grandTotal = 0;
var totalItems = 0;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: keys.mySQL.id,
    password: keys.mySQL.secret,
    database: "bamazon"
});

// Establish the connection with MySQL database
connection.connect(function(err) {
    if (err) throw err;
    start();
});

// First display all of the items available for sale. 
function start() {
    clear();
    // Include the ids, names, and prices of products for sale.
    connection.query("SELECT id, product_name AS 'Product', price AS 'Price' FROM products", function(err, res) {
        if (err) throw err;
        for (var i=0; i < res.length; i++) {
            choiceArray.push(res[i].id); // This is used later to validate purchased item

        }
        console.log("==================================================================================");
        console.log("=[($)]=[($)]=[($)]=[($)]=[($)]= WELCOME TO BAMAZON =[($)]=[($)]=[($)]=[($)]=[($)]=")
        console.log("==================================================================================");
        console.table(res);
        console.log("==================================================================================");
        promptUser(res);
    })
}

// The app should then prompt users with two messages.
function promptUser(res) {
    inquirer.prompt ([
        {
            // The first should ask them the ID of the product they would like to buy.
            name: "product",
            type: "input",
            message: "Which Product Would You Like To Purchase? (Enter ID Number)",
            validate: function(value){
                var valid = choiceArray.includes(value);
                return valid || "Please Enter A Valid Number";
            },
            filter: Number
        },{
            // The second message should ask how many units of the product they would like to buy.
            name: "amount",
            type: "input",
            message: "How Many Units Would You Like To Buy?",
            validate: function(value){
                var valid = !isNaN(parseFloat(value));
                return valid || "Please Enter A Number";
            },
            filter: Number
        }
    ]).then(function(answer){
        var chosenItem = res[answer.product -1];
        //  Your application should check if your store has enough of the product to meet the customer's request.
        connection.query("SELECT * FROM products WHERE id = "+chosenItem.id, function(err, res) {
            if (err) throw err;
            if (answer.amount > parseInt(res[0].stock_quantity)) {
                // If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.
                console.log("Insufficient Quantity! We Have "+res[0].stock_quantity+" In Stock.");
                end();
            }
            // If your store does have enough of the product, you should fulfill the customer's order.
            if (answer.amount <= parseInt(res[0].stock_quantity)) {
                // Update the SQL database to reflect the remaining quantity.
                var newQuantity = parseInt(res[0].stock_quantity) - parseInt(answer.amount);
                // Determine the total cost for the customer
                var totalCost = parseInt(answer.amount) * parseInt(chosenItem.Price);
                // Update the SQL database to reflect the product's sales.
                var newProductSales = parseInt(res[0].product_sales) + parseInt(totalCost);
                grandTotal += totalCost;
                totalItems += answer.amount;
                connection.query("UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: newQuantity,
                            product_sales: newProductSales
                        },{
                            id: answer.product
                        }
                    ],
                    function(err) {
                        if (err) throw err;
                        // Once the update goes through, show the customer the total cost of their purchase.        
                        console.log("Total Cost = $" + totalCost);
                        end();
                    }
                )
            }
        })
    })
}

function end() {
    inquirer.prompt ({
        name: "option",
        type: "list",
        message: "Would You Like To Make Another Purchase?",
        choices: ["Yes","No"]
    }).then(function(answer) {
        if (answer.option === "Yes") {
            start();
        } else {
            console.log("You Purchased "+totalItems+" Items.\nYour final cost is $"+grandTotal+".");
            connection.end();
        }
    })
}