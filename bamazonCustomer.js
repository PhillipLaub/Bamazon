// Then create a Node application called bamazonCustomer.js. Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.
// The app should then prompt users with two messages.

// The first should ask them the ID of the product they would like to buy.
// The second message should ask how many units of the product they would like to buy.

// Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

// If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.

// However, if your store does have enough of the product, you should fulfill the customer's order.

// This means updating the SQL database to reflect the remaining quantity.
// Once the update goes through, show the customer the total cost of their purchase.

const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon"
});

readProducts();

function bamazon() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "item_id",
        message:
          "What item which you would like to purchase? \n(Enter Item Id): ",
          filter: Number
      },
      {
        type: "input",
        name: "stock_quantity",
        message: "How many units would you like to purchase?",
        filter:Number
      }
    ])
    .then(function(input) {
      let item = input.item_id;
      let quantity = input.stock_quantity;

      connection.query(
        "SELECT * FROM products WHERE ?",
        { item_id: item },
        function(err, res) {
          if (err) throw err;

          if (res.length === 0) {
            console.log(
              "---------------------------------------------------------------------"
            );

            console.log(
              "\nERROR!!! You entered an invalid Item Id, Please try again.\n"
            );
            console.log(
              "---------------------------------------------------------------------"
            );

            readProducts();
          } else {
            let product = res[0];

            if (quantity <= product.stock_quantity) {
              console.log(
                "---------------------------------------------------------------------\n"
              );
              console.log(
                "Your product is in stock, now placing your order!\n"
              );

              let updateStock =
                "UPDATE products SET stock_quantity = " +
                (product.stock_quantity - quantity) +
                " WHERE item_id = " +
                item;

              connection.query(updateStock, function(err, res) {
                if (err) throw err;
                console.log(
                  "---------------------------------------------------------------------"
                );
                console.log(
                  "\nOrder Completed!\nYour total is $" +
                    product.price * quantity
                );
                console.log("Thank you for your purchase!\n");
                console.log(
                  "---------------------------------------------------------------------"
                );

                connection.end();
              });
            } else {
              console.log(
                "---------------------------------------------------------------------"
              );
              console.log(
                "\nThere is not currently enough product in stock, Please try again.\n"
              );
              console.log(
                "---------------------------------------------------------------------"
              );

              readProducts();
            }
          }
        }
      );
    });
}

function readProducts() {
  console.log(
    "------------------------------------------------------------------------------------------------------------------------"
  );
  console.log("\nHere are the products that are available for SALE!!!\n");
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.log(
      "------------------------------------------------------------------------------------------------------------------------"
    );
    for (let i = 0; i < res.length; i++) {
      console.log(
        "Item Id: " +
          res[i].item_id +
          " || Product Name: " +
          res[i].product_name +
          " || Dept. Name: " +
          res[i].department_name +
          " || Price: $" +
          res[i].price +
          " || Stock Quantity: " +
          res[i].stock_quantity
      );
      console.log(
        "------------------------------------------------------------------------------------------------------------------------"
      );
    }
    console.log("\n");
    bamazon();
    // connection.end();
  });
}
