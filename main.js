import mongoose, { connect } from "mongoose";
import prompt from "prompt-sync";

let p = prompt();

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
      },
    });

    const Category = mongoose.model("Categories", categorySchema);
    const Supplier = mongoose.model("Suppliers", supplierSchema);
    const Products = mongoose.model("Products", productSchema);
    const Offer = mongoose.model("Offers", offerSchema);
    const Order = mongoose.model("Orders", orderSchema);

    const { db } = mongoose.connection;

    async function Menu() {
      let runApp = true;

      while (runApp) {
        console.log("\n ---------------------------------------------\n");
        console.log(
          "1. Add new category \n 2. Add new product \n 3. View products by category \n 4. View products by supplier"
        );
        console.log(
          "5. View all offers within a price range \n 6. View all offers that contain a product from a specific category"
        );
        console.log(
          "7. View the number of offers based ont he number of it's products in stock \n 8. Create order for products"
        );
        console.log(
          "9. Create order for offers \n 10. Ship orders \n 11. Add a new supplier \n 12. View suppliers"
        );
        console.log(
          "13. View all sales \n 14. View sum of all profits \n 15. Cancel"
        );
        console.log("\n ---------------------------------------------\n");
        let input = p("Please make a choice by entering a number: ");

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
            let addCat = p("Do you wish to add a new category? y/n: ");

            if (addCat == "y") {
              try {
                let catName = p("Input new category name: ");
                let catDesc = p("Input category description: ");

                let checkExistingCat = await Category.countDocuments({
                  name: catName,
                });

                if (checkExistingCat > 0) {
                  console.log(
                    `Category ${catName} already exists in database, redirecting you to main menu`
                  );
                  break;
                } else {
                  await Category.create({
                    name: catName,
                    description: catDesc,
                  });

                  console.log(`\n ${catName} category has been added`);
                }
              } catch (error) {
                console.log("Unable to add new category ", error);
              }
            } else {
              console.log("Redirecting you to main menu");
            }
            exitOrMenu();
            break;

          case "2":
            //massa kod
            console.log("\n --------- Add new product --------- \n");
            let addProduct = p("Do you wish to add a new product? y/n: ");

            if (addProduct == "y") {
              try {
                let productName = "";
                while (!productName) {
                  productName = p("Input product name: ");
                  if (!productName) {
                    console.log(
                      "Product name cannot be empty. Please try again."
                    );
                  }
                }

                let productType = "";
                while (!productType) {
                  productType = p("Input product type: ");
                  if (!productType) {
                    console.log(
                      "Product type cannot be empty. Please try again."
                    );
                  }
                }

                let productPrice = NaN;
                while (isNaN(productPrice)) {
                  productPrice = parseFloat(p("Input product price: "));
                  if (isNaN(productPrice)) {
                    console.log(
                      "Invalid input for product price. Please enter a valid number."
                    );
                  }
                }

                let productCost = NaN;
                while (isNaN(productCost)) {
                  productCost = parseFloat(p("Input product cost: "));
                  if (isNaN(productCost)) {
                    console.log(
                      "Invalid input for product cost. Please enter a valid number."
                    );
                  }
                }

                let productStock = NaN;
                while (isNaN(productStock)) {
                  productStock = parseInt(p("Input product stock: "));
                  if (isNaN(productStock)) {
                    console.log(
                      "Invalid input for product stock. Please enter a valid number."
                    );
                  }
                }

                const categoryList = await Category.find();
                console.log("\n --------- Available Categories --------- \n");
                categoryList.forEach((category, i) => {
                  console.log(`${i + 1}. ${category.name}`);
                });
                console.log(`${categoryList.length + 1}. Add new category`);

                let chosenCategory = "x";
                while (
                  isNaN(chosenCategory) ||
                  chosenCategory < 1 ||
                  chosenCategory > categoryList.length + 1
                ) {
                  chosenCategory = p("Choose category: ");
                  if (isNaN(chosenCategory)) {
                    console.log("Invalid input, please try again");
                  }
                }

                if (
                  chosenCategory >= 1 &&
                  chosenCategory <= categoryList.length
                ) {
                  chosenCategory = categoryList[chosenCategory - 1];
                } else if (chosenCategory == categoryList.length + 1) {
                  let addCat = p("Do you wish to add a new category? y/n: ");

                  if (addCat == "y") {
                    try {
                      let catName = p("Input new category name: ");
                      let catDesc = p("Input category description: ");

                      let checkExistingCat = await Category.countDocuments({
                        name: catName,
                      });

                      if (checkExistingCat > 0) {
                        console.log(
                          ` Category ${catName} already exists in database, redirecting you to main menu`
                        );
                        break;
                      } else {
                        await Category.create({
                          name: catName,
                          description: catDesc,
                        });

                        console.log(` \n ${catName} category has been added`);
                      }
                    } catch (error) {
                      console.log("Unable to add new category ", error);
                    }
                  } else {
                    console.log("Redirecting you to main menu");
                  }
                }
                let supplierList = await Supplier.find();
                console.log("\n --------- Available Suppliers --------- \n");
                supplierList.forEach((supplier, i) => {
                  console.log(`${i + 1}. ${supplier.name}`);
                });

                let chosenSupplier = parseInt(p("Choose supplier: "));

                if (
                  chosenSupplier >= 1 &&
                  chosenSupplier <= supplierList.length
                ) {
                  chosenSupplier = supplierList[chosenSupplier - 1];

                  let productCreated = await Products.create({
                    name: productName,
                    category: chosenCategory._id,
                    type: productType,
                    price: productPrice,
                    cost: productCost,
                    stock: productStock,
                    supplier: chosenSupplier,
                  });

                  productCreated &&
                    console.log(
                      `\n ${productName} has been added to ${chosenCategory.name} category`
                    );
                  console.log("Product created: ", productCreated);
                } else {
                  console.log("Invalid input, redirecting you to main menu");
                  break;
                }
              } catch (error) {
                console.log("Unable to add new product ", error);
              }
            }
            exitOrMenu();
            break;

          case "3":
            const categoryList = await Category.find();
            console.log("\n --------- Available Categories --------- \n");
            categoryList.forEach((category, i) => {
              console.log(`${i + 1}. ${category.name}`);
            });

            const chosenCategory = p(
              "Enter the category index from the list above: "
            );

            if (chosenCategory >= 1 && chosenCategory <= categoryList.length) {
              let chosenCat = categoryList[chosenCategory - 1];
              let productsInCategory = await Products.find({
                category: chosenCat,
              });

              if (productsInCategory.length > 0) {
                console.log(
                  `\n --------- Products in ${chosenCat.name} --------- \n`
                );
                productsInCategory.forEach((product) => {
                  console.log(`${product.name} - ${product.price} USD \n`);
                });
              } else {
                console.log(
                  `\nThere are currently no products in ${chosenCat.name}, redirecting you to database`
                );
              } //slut på productsInCategory if-sats

              break;
            } else {
              console.log("\nInvalid input, redirecting you to main menu");
            } //Slut på chosenCategory if-sats
            exitOrMenu();
            break;

          case "4":
            let suppliersList = await Supplier.find();
            console.log("\n --------- Available Suppliers --------- \n");
            suppliersList.forEach((supplier, i) => {
              console.log(`${i + 1}. ${supplier.name}`);
            });

            const supplierIndex = p(
              "Enter the supplier index from the list above: "
            );

            if (supplierIndex >= 1 && supplierIndex <= suppliersList.length) {
              let chosenSupplier = suppliersList[supplierIndex - 1];
              let productsInSupplier = await Products.find({
                supplier: chosenSupplier._id,
              });

              if (productsInSupplier.length > 0) {
                console.log(
                  `\n --------- Products in ${chosenSupplier.name} --------- \n`
                );
                productsInSupplier.forEach((product) => {
                  console.log(`${product.name} - ${product.price} USD \n`);
                });
              } else {
                console.log(
                  `\nThere are currently no products in ${chosenSupplier.name}, redirecting you to main menu`
                );
              }

              break;
            } else {
              console.log("\nInvalid input, redirecting you to main menu");
            }
            exitOrMenu();
            break;

          case "5":
            //massa kod
            exitOrMenu();
            break;

          case "6":
            //massa kod
            exitOrMenu();
            break;

          case "7":
            //massa kod
            exitOrMenu();
            break;

          case "8":
            //massa kod
            exitOrMenu();
            break;

          case "9":
            //massa kod
            exitOrMenu();
            break;

          case "10":
            //massa kod
            exitOrMenu();
            break;

          case "11":
            console.log("\n --------- Add  new supplier --------- \n");
            let addSupplier = p("Do you wish to add a new supplier? y/n: ");

            if (addSupplier == "y") {
              try {
                let supplierName = p("Input new supplier name: ");
                let contactName = p("Input contact person name: ");
                let contactMail = p("Input contact email: ");

                let checkExistingSupplier = await Supplier.countDocuments({
                  name: supplierName,
                });

                if (checkExistingSupplier > 0) {
                  console.log(
                    `Supplier ${supplierName} already exists in database, redirecting you to main menu`
                  );
                  break;
                } else {
                  await Supplier.create({
                    name: supplierName,
                    contact: {
                      name: contactName,
                      email: contactMail,
                    },
                  });

                  console.log(`\n ${supplierName} has been added to suppliers`);
                }
              } catch (error) {
                console.log("Unable to add new supplier ", error);
              }
            } else {
              console.log("Redirecting you to main menu");
            }
            exitOrMenu();
            break;

          case "12":
            const supplierList = await Supplier.find();

            console.log("\n --------- Suppliers in database --------- \n");

            supplierList.forEach((supplier) => {
              console.log(`
            ${supplier.name} \n
            Contact: ${supplier.contact.name}\n
            Email: ${supplier.contact.email}\n`);
            });
            exitOrMenu();
            break;

          case "13":
            //massa kod
            exitOrMenu();
            break;

          case "14":
            //massa kod
            exitOrMenu();
            break;

          case "15":
            runApp = false;
            exitOrMenu();
            break;

          default:
            console.log(
              "\n Invalid input \n Please choose an option between 1-15 \n"
            );
            exitOrMenu();
            break;
        } //End of switch/case loop
      } //End of runApp loop
    } //End of async menu function

    Menu();
  } //End of if-function
} catch (error) {
  console.log("Error connecting to MongoDB:", error);
}
async function exitOrMenu() {
  console.log("Return to main menu or exit?");
  console.log("\n1. Main menu\n2. Exit\n");
  let exitOrMenuInput = p(" ");
  while (exitOrMenuInput != "1" && exitOrMenuInput != "2") {
    exitOrMenuInput = p(
      "Return to main menu or exit?\n1. Main menu\n2. Exit\n"
    );
  }
  if (exitOrMenuInput == "1") {
    Menu();
  } else if (exitOrMenuInput == "2") {
    console.log("\nExiting program");
    process.exit();
  }
}

// async function exitOrMenu() {
//   let exit = p("Do you wish to exit? y/n: ");
//   while (exit !== "y" && exit !== "n") {
//     console.log("Invalid input, please try again");
//     exit = p("Do you wish to exit? y/n: ");
//   }
//   if (exit == "y") {
//     console.log("Exiting program");
//     process.exit();
//   } else {
//     Menu();
//   }
// }
