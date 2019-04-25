var mysql = require("mysql");
require("dotenv").config();
var readlineSync = require('readline-sync');
var inquirer = require("inquirer");

// Initializes the connection variable to sync with a MySQL database
var connection = mysql.createConnection({
  host: 'localhost',
  // Your port; if not 3306
  port: 3306,
  //Your username
  user: process.env.WEBSITE_USER,
  //Your password
  password: process.env.WEBSITE_PASSWORD,
  database: 'bamazon'
});

// Creates the connection with the server and loads the product data upon a successful connection
connection.connect(function(err) {
  if (err) throw err;
  createProduct();
});

function createProduct() {
  console.log("********************************************************************")  
  console.log("Items that we sell: ");
  console.log("********************************************************************")  
  connection.query("SELECT * FROM products",
    function(err,res){
        if (err) throw err;
        console.log(res);
        console.log("********************************************************************")  
        getInput();
    })
    
};

function getInput(){
    console.log("Choose from one of the following items you saw above by typing the number next to it.")
    console.log("********************************************************************")  

    options=['charger', 'microphone', 'hairspray', 'tweezers', 'shoes', 'belt', 'stapler', 'llama plushie','light bulbs','blender'],
    index = readlineSync.keyInSelect(options, "Which product would you like to purchase?");
    var itemOrdered=options[index];
    console.log("item ->", itemOrdered);
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('How much of this product would you like to order? ', (answer) => {
        var quantityOrdered = answer;
        console.log(`You would like ${answer} unit(s) of `+ itemOrdered);
    rl.close();

    checkValues(itemOrdered, quantityOrdered)
    
});
}

function checkValues(itemOrdered, quantityOrdered){
    var stockQuantity;
    theQuery="Select * FROM products WHERE product_name = " + "'" + itemOrdered + "'";
    connection.query(theQuery,
    function(err,res){
        if (err) throw err;
        stockQuantity=res[0].stock_Quantity;
        price = res[0].price;
      // console.log(res); this is just the row for tweezers
        updateValues(stockQuantity, itemOrdered, quantityOrdered, price);
    })
   
}

//function getPrice()

function updateValues(stock_Quantity, item_Ordered, quantity_Ordered, price){
    
    var stockQuantity =stock_Quantity;
    var itemOrdered = item_Ordered;
    var quantityOrdered= quantity_Ordered;

    if (quantityOrdered>stockQuantity){
        console.log("Sorry, insufficient quantity.");
        console.log("You have ordered " + quantityOrdered + " units, and we only have " + stockQuantity + " in our stock. Try either updating your order or ordering something else.");
        getInput();
    }
    else{
         var newTotal = stockQuantity - quantityOrdered;
         var totalCost = price * quantityOrdered;
            var theQuery = "UPDATE products SET stock_Quantity =" + newTotal + " WHERE product_name= " + "'" +itemOrdered + "'";
            connection.query(theQuery,
                function(err,res){
                    if (err) throw err;
                    //console.log(res);
                console.log("********************************************************************")  
                console.log("Item purchased.")
                console.log("total cost:", totalCost);
                console.log("********************************************************************")  

                console.log("The new stockQuantity is ", newTotal);
                console.log("The updated JSON is as follows: ");
                    connection.query("SELECT * FROM products",
                        function(err,res){
                            if (err) throw err;
                            console.log(res);
                    })
                connection.end();
            })
            
    }


  
}