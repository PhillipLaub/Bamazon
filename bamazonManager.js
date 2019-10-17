var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  runBamazon();
});

function runBamazon() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product",
        "exit"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
        case "View Products for Sale":
          readProducts();
          break;

        case "View Low Inventory":
          lowInventory();
          break;

        case "Add to Inventory":
          addInventory();
          break;

        case "Add New Product":
          addProduct();
          break;

        case "exit":
          connection.end();
          break;
      }
    });
}

function readProducts() {
  console.log(
    "------------------------------------------------------------------------------------------------------------------------"
  );
  console.log("\nHere are the products that are available...\n");
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
    //   bamazon();
    runBamazon();
  });
}

//   If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.

function lowInventory() {
  console.log(
    "------------------------------------------------------------------------------------------------------------------------"
  );
  console.log("\nHere are the products that are low on inventory\n");
  connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(
    err,
    res
  ) {
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
    //   bamazon();
    runBamazon();
  });
}

//   If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.

function addInventory() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "item_id",
        message:
          "What item would you like to add to Inventory? \n(Enter Item Id): ",
        filter: Number
      },
      {
        type: "input",
        name: "stock_quantity",
        message: "How many units would you like to add?",
        filter: Number
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

            addInventory();
          } else {
            let product = res[0];

            if (quantity > 0) {
              console.log(
                "---------------------------------------------------------------------\n"
              );
              console.log("Now placing your order.....\n");

              let updateStock =
                "UPDATE products SET stock_quantity = " +
                (product.stock_quantity + quantity) +
                " WHERE item_id = " +
                item;

              connection.query(updateStock, function(err, res) {
                if (err) throw err;
                console.log(
                  "---------------------------------------------------------------------"
                );
                console.log(
                  "\nOrder Completed!\nYou have added " +
                    quantity +
                    " to your Inventory!"
                );
                console.log(
                  "---------------------------------------------------------------------"
                );

                runBamazon();
              });
            }
          }
        }
      );
    });
}

//   If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.

function addProduct() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "product_name",
        message: "What type of product should be added to the inventory? "
      },
      {
        type: "input",
        name: "department_name",
        message: "Which department should this product be placed in?"
      },
      {
        type: "input",
        name: "price",
        message: "How much should the product be sold for?",
        filter: Number
      },
      {
        type: "input",
        name: "stock_quantity",
        message: "How many of this item should be added into the inventory?",
        filter: Number
      }
    ])
    .then(function(input) {
      let item = input.item_id;
      let quantity = input.stock_quantity;
      let name = input.product_name;
      let priceVar = input.price;
      let dept = input.department_name;

    var query = connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: name,
          department_name: dept,
          price: priceVar,
          stock_quantity: quantity

        },
        function(err, res) {
          if (err) throw err;
          console.log("New Product has been added to the Inventory!");
          // Call updateProduct AFTER the INSERT completes
          runBamazon()
        }
      );
    });
}
