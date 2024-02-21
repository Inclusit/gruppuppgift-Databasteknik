import mongoose, { connect } from "mongoose";
import prompt from "prompt-sync";

try {
  const con = await connect("mongodb://127.0.0.1:27017/onlineStore");
  
   if (con) {
    console.log("Connected to MongoDB");

    //Schemas 
      const categorySchema = mongoose.Schema({
        name: { type: String },
        description: { type: String },
      });

      const supplierSchema = mongoose.Schema({
        name: { type: String },
        contact: {
          name: { type: String },
          email: { type: String },
        },
      });

      const productSchema = mongoose.Schema({
        name: { type: String },
        category: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category",
        },
        type: { type: String },
        price: { type: Number },
        cost: { type: Number },
        stock: { type: Number },
        supplier: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Supplier",
        },
      });

      const offerSchema = mongoose.Schema({
        products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
        price: { type: Number },
        active: { type: Boolean },
      });

      const orderSchema = mongoose.Schema({
        products: [
          {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            quantity: { type: Number, required: true },
          },
        ],
        offer: { type: mongoose.Schema.Types.ObjectId, ref: "Offer" },
        quantity: { type: Number, required: true },
        status: {
          type: String,
          enum: ["pending", "shipped"],
          default: "pending",
        }
      });

      const Category = mongoose.model("Categories", categorySchema);
      const Supplier = mongoose.model("Suppliers", supplierSchema);
      const Products = mongoose.model("Products", productSchema);
      const Offer = mongoose.model("Offers", offerSchema);
      const Order = mongoose.model("Orders", orderSchema);      

      const { db } = mongoose.connection;

     async function Menu() {

      let p = prompt();
      let runApp = true;

      while (runApp) {
        console.log("\n ---------------------------------------------\n");
        console.log("1. Add new category \n 2. Add new product \n 3. View products by category \n 4. View products by supplier")
        console.log("5. View all offers within a price range \n 6. View all offers that contain a product from a specific category")
        console.log("7. View the number of offers based ont he number of it's products in stock \n 8. Create order for products")
        console.log("9. Create order for offers \n 10. Ship orders \n 11. Add a new supplier \n 12. View suppliers")
        console.log("13. View all sales \n 14. View sum of all profits \n 15. Cancel")
        console.log("\n ---------------------------------------------\n");
        let input = p("Please make a choice by entering a number: ")

        //idé för offers:
        //"For him & her: Order one top from men's clothing and one top from women's clothing"
        //Köp tre betala för två <--- Troligtvis mycket lättare än den ovan
        
        //View products  by supplier -> använd $group?

        //Punkt 5: Användare för välja mellan färdiginställda ranges, ex. 0-99, 100-199, 200-299. Använd sedan aggregations
        //Punkt 10: Lista orders, välj order, välj mellan om den ska vara true eller false (shipped/pending)

        //Create order for products -> lista alla produktnamn och pris, när någon väljer topp från män eller kvinnor så sker en offer



        switch (input) {
          case "1":
          
          console.log("\n --------- Add  new category --------- \n");
          let addCat = p("Do you wish to add a new category? y/n: ")

          if (addCat == "y") {
            
            try {let catName = p("Input new category name: ");
            let catDesc = p("Input category description: ");

            let checkExistingCat = await Category.countDocuments({name: catName});
            
            if (checkExistingCat > 0) {
              console.log(`Category ${catName} already exists in database, redirecting you to main menu`);
              break;
              
            } else {

              await Category.create({
                name: catName,
                description: catDesc,
              });

              console.log(`\n ${catName} category has been added`);
            };
            

             } catch (error) {
            console.log("Unable to add new category ", error)
          };

          } else {
            console.log("Redirecting you to main menu")
          }
          
          break;

          case "2":
            //massa kod
            
            //struktur för om någon vill lägga till ny produkt:
            //"choose category"-> lista med kategorier 
            //"category not available, do you want to create a new one?" -> "redirecting you to category creation"

            //"choose category" -> "insert x" -> "you have added x to y category"

            break;


          case "3":
            const categoryList = await Category.find();
            console.log("\n --------- Available Categories --------- \n");
            categoryList.forEach((category, i) => {
              console.log(`${i + 1}. ${category.name}`);
            });

            const chosenCategory = p(
              "Enter the category name from the list above: "
            );

            if (chosenCategory >= 1 && chosenCategory <= categoryList.length) {

              let chosenCat= categoryList[chosenCategory -1];
              let productsInCategory = await Products.find({category: chosenCat});

              if (productsInCategory.length > 0) {
                console.log(
                  `\n --------- Products in ${chosenCat.name} --------- \n`
                );
                productsInCategory.forEach((product) => {
                  console.log(`${product.name} - ${product.price} USD \n`)
                });

              } else {
                console.log(`\nThere are currently no products in ${chosenCat.name}, redirecting you to database`)
              }; //slut på productsInCategory if-sats

              break;

            } else{
              console.log("\nInvalid input, redirecting you to main menu")
              
            }; //Slut på chosenCategory if-sats

            break;

          case "4":
            //massa kod
            break;

          case "5":
            //massa kod
            break;

          case "6":
            //massa kod
            break;

          case "7":
            //massa kod
            break;

          case "8":
            //massa kod
            break;

          case "9":
            //massa kod
            break;

          case "10":
            //massa kod
            break;

          case "11":
            //massa kod
            break;

          case "12":
            //massa kod
            break;

          case "13":
            //massa kod
            break;

          case "14":
            //massa kod
            break;

          case "15":
            runApp = false;
            break;

          default:
            console.log(
              "\n Invalid input \n Please choose an option between 1-15 \n"
            );
            break;
        } //End of switch/case loop
      
    }; //End of runApp loop
      
     }//End of async menu function

     Menu();

    }; //End of if-function


} catch (error) {
  console.log("Error connecting to MongoDB:", error);
  
}


