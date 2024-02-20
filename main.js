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


     async function Menu() {
      let p = prompt();
      let runApp = true;

      while (runApp) {
        console.log("\n ---------------------------------------------\n");
        console.log("1. Add new category \n 2. Add new product \n 3. View products by category \n 4. View products by supplier")
        console.log("5. View all offers within a price range \n 6. View all offers that contain a product from a specific category")
        console.log("7. View the number of offers based ont he number of it's products in stock \n 8. Create order for products")
        console.log("9. Create order for offers \n 10. Ship orders \n 11. Add a new supplier \n 12. View suppliers")
        console.log("13.View all sales \n 14. View sum of all profits \n 15. Cancel")
        console.log("\n ---------------------------------------------\n");
        let input = p("Please make a choice by entering a number: ")

        //idé för offers:
        //"For him & her: Order one top from men's clothing and one top from women's clothing"
        //Köp tre betala för två
        
        //struktur för om någon vill lägga till ny produkt:
        //"choose category"-> "category not available, do you want to create a new one?" -> "redirecting you to category creation"
        //"choose category" -> "insert x" -> "you have added x to y category"

        //View products  by supplier -> använd $group

        //Create order for products -> lista alla produktnamn och pris, när någon väljer topp från män eller kvinnor så sker en offer



        switch (input) {
          case "1":
            //massa kod
            break;

          case "2":
            //massa kod
            break;

          case "3":
            //massa kod
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
                console.log("\n Invalid input \n Please choose an option between 1-15 \n")
                break;
                
        } //End of switch/case loop
      
    }; //End of runApp loop
      
     }//End of async menu function

     Menu();

    }; //End of if-function


} catch (error) {
  console.log("Error connecting to MongoDB:", error);
  
}

const { db } = mongoose.connection;