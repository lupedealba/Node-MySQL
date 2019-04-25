var mysql = require("mysql");
require("dotenv").config();
var readlineSync = require('readline-sync');
const readline = require('readline');

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,
      
  // Your username
  user: process.env.WEBSITE_USER,

  // Your password
  password: process.env.WEBSITE_PASSWORD,
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  createProduct();
});

function createProduct() {
  console.log("********************************************************************")  
  console.log("Welcome to the Potterless kiosk! Here are the items that we sell: ");
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

    options=['put-outter', 'extendable ears', 'Love potions', 'Nimbus 2000', 'quaffels', 'The Marauders Map', 'toothflossing stringmints', 'Bertie Botts Every Flavour Beans','butterbeer','lemon drops'],
    index = readlineSync.keyInSelect(options, "Which product would you like to purchase?");
    var itemOrdered=options[index];
    console.log("Here is what you are ordering ->", itemOrdered);
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
    theQuery="Select stock_quantity FROM products WHERE product_name = " + "'" + itemOrdered + "'";
    connection.query(theQuery,
    function(err,res){
        if (err) throw err;
        stockQuantity=res[0].stock_quantity;
        updateValues(stockQuantity, itemOrdered, quantityOrdered);
    })
   
}

function updateValues(stock_Quantity, item_Ordered, quanitity_Ordered){
    
    var stockQuantity =stock_Quantity;
    var itemOrdered = item_Ordered;
    var quanitityOrdered= quanitity_Ordered;

    if (quanitityOrdered>stockQuantity){
        console.log("Sorry, we do not have enough stock to place this order.");
        console.log("You have ordered " + quanitityOrdered + " units, and we only have " + stockQuantity + " in our stock. Try either updating your order or ordering something else.");
        getInput();
    }
    else{
         var newTotal = stockQuantity - quanitityOrdered;
            var theQuery = "UPDATE products SET stock_quantity =" + newTotal + " WHERE product_name= " + "'" +itemOrdered + "'";
            connection.query(theQuery,
                function(err,res){
                    if (err) throw err;
                    //console.log(res);
                console.log("********************************************************************")  
                console.log("CONGRATULATIONS! Your order went through.")
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