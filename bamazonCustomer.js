// Then create a Node application called bamazonCustomer.js. Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.
// The app should then prompt users with two messages.

// The first should ask them the ID of the product they would like to buy.
// The second message should ask how many units of the product they would like to buy.

// Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

// If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.

// However, if your store does have enough of the product, you should fulfill the customer's order.

// This means updating the SQL database to reflect the remaining quantity.
// Once the update goes through, show the customer the total cost of their purchase.

var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "jad3fir3",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  readProducts();
});

function readProducts() {
  console.log("------------------------------------------------------------------------------------------------------------------------");
  console.log("\nAll Products available for SALE!!!\n");
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.log("------------------------------------------------------------------------------------------------------------------------");
    for (let i =0; i < res.length; i++) {
      console.log("Item Id: " + res[i].item_id + " || Product Name: " + res[i].product_name + " || Dept. Name: " + res[i].department_name + " || Price: $"+ res[i].price + " || Stock Quantity: " + res[i].stock_quantity);
      console.log("------------------------------------------------------------------------------------------------------------------------");
    }
    
    connection.end();
  });
}