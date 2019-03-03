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

//  Running this application will first display all of the items available for sale. 
//      Include the ids, names, and prices of products for sale.

function start() {
    connection.query("SELECT id, product_name, price FROM products", function(err, res) {
        if (err) throw err;
        console.table(res);
        promptUser(res);
        connection.end();
    })
}

//  The app should then prompt users with two messages.

function promptUser(res) {
    inquirer.prompt ([
        {

//  The first should ask them the ID of the product they would like to buy.

            name: "product",
            type: "input",
            message: "Which Product Would You Like To Purchase? (Enter ID Number)"
        },{

//  The second message should ask how many units of the product they would like to buy.

            name: "amount",
            type: "input",
            message: "How Many Units Would You Like To Buy?"
        }
    ]).then(function(answer){
        console.log(answer.product, answer.amount);
        console.log(res[answer.product].id);
        var chosenItem;
        for (var i = 0; i < res.length; i++) {
            if (res[i].id === answer.product) {
                chosenItem = res[i];
                console.log("chosen item = "+chosenItem);
            }
        }

//  Once the customer has placed the order, your application should check if your store has enough of the product 
//      to meet the customer's request.
//      If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.

        // if (chosenItem.stock_quantity < answer.amount) {
        //     console.log("Insufficient Quantity.");
        //     promptUser();
        // }

//  However, if your store _does_ have enough of the product, you should fulfill the customer's order.
//      This means updating the SQL database to reflect the remaining quantity.
//      Once the update goes through, show the customer the total cost of their purchase.        

    //     else if (chosenItem.stock_quantity >= answer.amount) {
    //         connection.query("UPDATE products SET ? WHERE ?",
    //             [
    //                 {
    //                     stock_quantity: stock_quantity - answer.amount
    //                 },{
    //                     id: answer.product
    //                 }
    //             ],
    //             function(err) {
    //                 if (err) throw err;
    //                 console.log("Total Cost = " + answer.amount * chosenItem.price);
    //             }
    //         )
    //     };
    })
}