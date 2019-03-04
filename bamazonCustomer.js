//  Challenge #1: Customer View (Minimum Requirement)
//  Create a Node application called `bamazonCustomer.js`

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

//  Running this application will first display all of the items available for sale. 
//      Include the ids, names, and prices of products for sale.

function start() {
    connection.query("SELECT id, product_name, price FROM products", function(err, res) {
        if (err) throw err;
        console.table(res);
        promptUser(res);
    })
}

//  The app should then prompt users with two messages.
//  The first should ask them the ID of the product they would like to buy.
//  The second message should ask how many units of the product they would like to buy.

function promptUser(res) {
    inquirer.prompt ([
        {
            name: "product",
            type: "input",
            message: "Which Product Would You Like To Purchase? (Enter ID Number)"
        },{
            name: "amount",
            type: "input",
            message: "How Many Units Would You Like To Buy?"
        }
    ]).then(function(answer){
        var chosenItem = res[answer.product -1];

//  Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.
//      If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.

        connection.query("SELECT * FROM products WHERE id = "+chosenItem.id, function(err, res) {
            if (err) throw err;
            if (answer.amount > parseInt(res[0].stock_quantity)) {
                console.log("Insufficient Quantity.");
                promptUser();
                connection.end();
            }

//  However, if your store _does_ have enough of the product, you should fulfill the customer's order.
//      This means updating the SQL database to reflect the remaining quantity.
//      Once the update goes through, show the customer the total cost of their purchase.        
//  Challenge #3: Supervisor View (Final Level)
//      Modify your `bamazonCustomer.js` app so that when a customer purchases anything from the store, 
//      the price of the product multiplied by the quantity purchased is added to the product's product_sales column.

            else {
                var newQuantity = parseInt(res[0].stock_quantity) - parseInt(answer.amount);
                var totalCost = parseInt(answer.amount) * parseInt(chosenItem.price);
                var newProductSales = parseInt(res[0].product_sales) + parseInt(totalCost);
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
                        console.log("Total Cost = $" + totalCost);
                        connection.end();
                    }
                )
            }
        })
    })
}