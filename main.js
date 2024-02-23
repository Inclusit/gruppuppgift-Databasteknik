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
      offer: { type: mongoose.Schema.Types.ObjectId, ref: "Offer" },
      products: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
          },
          quantity: { type: Number, required: true },
        },
      ],
      total: Number,
      quantity: Number,
      status: String, //"pending"/"shipped"
      type: String,
      total_revenue: Number,
      total_profit: Number,
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
        console.log(
          "1. Add new category \n 2. Add new product \n 3. View products by category \n 4. View products by supplier"
        );
        console.log(
          "5. View all offers within a price range \n 6. View all offers that contain a product from a specific category"
        );
        console.log(
          "7. View the number of offers based on the number of it's products in stock \n 8. Create order for products"
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
                }
              } catch (error) {
                console.log("Unable to add new product ", error);
              }
            }
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
            console.log("\n --------- Create order --------- \n");

            const makeOrder = p("Do you want to make an order? y/n: ");
            console.log("");

            if (makeOrder === "y") {
              let shoppingCart = [];
              let showProducts = await Products.find(
                {},
                "name price cost stock"
              );
              while (true) {
                console.log("--------- Product list ---------");

                try {
                  showProducts.forEach((product, i) => {
                    console.log(
                      `${i + 1}. ${product.name} - ${product.price} USD`
                    );
                  });

                  console.log("");
                  const productIndex = p(
                    "Choose a product by entering its index (X to finish): "
                  );

                  if (productIndex === "x") {
                    break;
                  }

                  if (
                    productIndex >= 1 &&
                    productIndex <= showProducts.length
                  ) {
                    const selectedProduct = showProducts[productIndex - 1];

                    const quantity = parseInt(p("Enter the quantity: "));

                    if (quantity > 0 && quantity <= selectedProduct.stock) {
                      shoppingCart.push({
                        product: selectedProduct._id,
                        quantity: quantity,
                        name: selectedProduct.name,
                      });
                      console.log(
                        `Added ${quantity} units of ${selectedProduct.name} to the order.`
                      );
                    } else {
                      console.log(
                        "Invalid quantity or insufficient stock. Please try again."
                      );
                    }
                  } else {
                    console.log("Invalid product index. Please try again.");
                  }
                } catch (error) {
                  console.log("Error fetching products: ", error);
                }
              }

              if (shoppingCart.length > 0) {
                const { totalRevenue, totalCost } = shoppingCart.reduce(
                  (totals, product) => {
                    const selectedProduct = showProducts.find((p) =>
                      p._id.equals(product.product)
                    );
                    totals.totalRevenue +=
                      selectedProduct.price * product.quantity;
                    totals.totalCost += selectedProduct.cost * product.quantity;
                    return totals;
                  },
                  { totalRevenue: 0, totalCost: 0 }
                );

                const totalProfit = totalRevenue - totalCost;

                const order = await Order.create({
                  products: shoppingCart.map((product) => ({
                    product: product.product,
                    quantity: product.quantity,
                  })),
                  quantity: shoppingCart.reduce(
                    (total, product) => total + product.quantity,
                    0
                  ),
                  status: "pending", // default status
                  total_revenue: totalRevenue,
                  total_profit: totalProfit,
                });

                console.log(
                  "Order created successfully with the following products:"
                );
                shoppingCart.forEach((product) => {
                  console.log(`${product.quantity} units of ${product.name}`);
                });
              } else {
                console.log(
                  "No products added to the order. Order creation failed."
                );
              }
            }

            break;

          case "9":
            //massa kod
            break;

          case "10":
            //massa kod
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

            break;

          case "13":
            //massa kod
            break;

          case "14":
            console.log("\n --------- Sum of all profits --------- \n");
            const showProfits = await Order.aggregate([
              {
                $group: {
                  _id: null,
                  totalProfit: { $sum: "$total_profit" },
                },
              },
            ]);

            console.log(
              `Total profit generated: ${showProfits[0].totalProfit} USD`
            );
            let showDetailedProfits = p(
              "Would you want to see a detailed breakdown? y/n: "
            );

            if (showDetailedProfits === "y") {
              const detailedProfits = await Order.aggregate([
                {
                  $unwind: "$products",
                },
                {
                  $lookup: {
                    from: "products",
                    localField: "products.product",
                    foreignField: "_id",
                    as: "productInfo",
                  },
                },
                {
                  $unwind: "$productInfo",
                },
                {
                  $group: {
                    _id: "$productInfo.name",
                    totalProfit: { $sum: "$total_profit" },
                  },
                },
                {
                  $project: {
                    totalProfit: { $round: ["$totalProfit", 2] },
                  },
                },
              ]);

              console.log("\n --------- Profit breakdown --------- \n");
              detailedProfits.forEach((productProfit) => {
                console.log(
                  `${productProfit._id}: Profit - ${productProfit.totalProfit} USD`
                );
              });
            } else {
              console.log("Redirecting you to main menu");
              break;
            }

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
      } //End of runApp loop
    } //End of async menu function

    Menu();
  } //End of if-function
} catch (error) {
  console.log("Error connecting to MongoDB:", error);
}
