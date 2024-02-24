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
      name: { type: String },
      products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
      price: { type: Number },
      active: { type: Boolean },
      inStock: {
        type: [
          {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            status: { type: Boolean, default: false },
          },
        ],
        default: [],
      },
      bothInStock: { type: Boolean, default: false },
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
    orderSchema.add({
      createdAt: { type: Date, default: Date.now },
    });

    const Category = mongoose.model("Categories", categorySchema);
    const Supplier = mongoose.model("Suppliers", supplierSchema);
    const Products = mongoose.model("Products", productSchema);
    const Offer = mongoose.model("Offers", offerSchema);
    const Order = mongoose.model("Orders", orderSchema);

    const { db } = mongoose.connection;
    let p = prompt();
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
                        return;
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
                  break;
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
            console.log(
              "\n --------- Offers within a price range --------- \n"
            );
            let minPrice = parseFloat(p("Enter minimum price: "));
            let maxPrice = parseFloat(p("Enter maximum price: "));

            let offersInRange = await Offer.find({
              price: { $gte: minPrice, $lte: maxPrice },
            });
            // console.log(offersInRange);
            if (offersInRange.length > 0) {
              console.log(
                `\n --------- Offers between ${minPrice} and ${maxPrice} --------- \n`
              );
              // console.log(offersInRange);
              offersInRange.forEach((offer, i) => {
                // console.log(offer);
                console.log(
                  `${offer.name}: ${offer.products.join(" + ")}, Price: ${
                    offer.price
                  }\n`
                );
              });
            } else {
              console.log(
                `\nThere are currently no offers between ${minPrice} and ${maxPrice}, redirecting you to main menu`
              );
            }
            exitOrMenu();
            break;

          case "6":
            console.log("\n --------- Offers by category --------- \n");
            let categoriesList = await Category.find();
            console.log("\n --------- Available Categories --------- \n");
            categoriesList.forEach((category, i) => {
              console.log(`${i + 1}. ${category.name}`);
            });

            let chosenCategoryInput = p(
              "Enter the category index from the list above: "
            );

            if (
              chosenCategoryInput >= 1 &&
              chosenCategoryInput <= categoriesList.length
            ) {
              let chosenCategory = categoriesList[chosenCategoryInput - 1];
              let offersByCategory = await Offer.find({
                categories: chosenCategory._id,
              });

              let offers = await Offer.find();
              console.log("offers", offers);
              console.log("offers by category", offersByCategory);
              offers.name && console.log("offers name", offers.name);

              if (offersByCategory.length > 0) {
                console.log(
                  `\n --------- Offers containing products from ${chosenCategory.name} --------- \n`
                );
                offersByCategory.forEach((offer) => {
                  console.log(
                    `\nName: ${offer.name}\nOffer ID: ${offer._id} \n Price: ${offer.price}\n`
                  );
                });
              } else {
                console.log(
                  `\nThere are currently no offers containing products from ${chosenCategory.name}, redirecting you to main menu`
                );
              }
            } else {
              console.log("\nInvalid input, redirecting you to main menu");
            }

            exitOrMenu();
            break;

          case "7":
            console.log("\n --------- Offers by stock --------- \n");
            let offersByStock = await Offer.find({
              inStock: { $elemMatch: { status: true } },
            });

            if (offersByStock.length > 0) {
              console.log(
                `\n --------- Offers containing products in stock --------- \n`
              );
              offersByStock.forEach((offer) => {
                console.log(`Offer: ${offer.name} \n Price: ${offer.price}`);
              });
            } else {
              console.log(
                `\nThere are currently no offers containing products in stock, redirecting you to main menu`
              );
            }

            exitOrMenu();
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
          const orders = await Order.find(
            {},
            "createdAt status total_revenue products"
          );

          for (const order of orders) {
            console.log(`Order ${orders.indexOf(order) + 1}:`);
            console.log(`  Created at: ${order.createdAt.toLocaleString()}`);
            console.log("  Products:");

            for (const productData of order.products) {
              const productId = productData.product;
              const product = await Products.findById(productId);
              console.log(
                `    - ${product.name} (Quantity: ${productData.quantity})`
              );
            }

            console.log(`  Status: ${order.status}`);
            console.log(`  Total Revenue: ${order.total_revenue} USD`);
            console.log("-------------------------");
          }

            exitOrMenu();
            break;

          case "14":
            console.log("\n --------- Sum of all profits --------- \n");
            const showProfits = await Order.aggregate([
              {
                $group: {
                  _id: null,
                  totalRevenue: { $sum: "$total_revenue" },
                  totalCost: { $sum: "$total_cost" },
                },
              },
              {
                $project: {
                  totalProfit: {
                    $subtract: [
                      "$totalRevenue",
                      {
                        $multiply: ["$totalCost", 0.7], // 70% of the cost as profit
                      },
                    ],
                  },
                },
              },
            ]);

            console.log(
              `Total profit generated: ${showProfits[0].totalProfit} USD`
            );
            console.log("");
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
                    totalRevenue: {
                      $sum: {
                        $multiply: ["$products.quantity", "$productInfo.price"],
                      },
                    },
                    totalCost: {
                      $sum: {
                        $multiply: ["$products.quantity", "$productInfo.cost"],
                      },
                    },
                  },
                },
                {
                  $project: {
                    totalProfit: {
                      $round: [
                        {
                          $subtract: [
                            "$totalRevenue",
                            { $multiply: ["$totalCost", 0.7] }, // 70% of the cost as profit
                          ],
                        },
                        2,
                      ],
                    },
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

            exitOrMenu();
            break;

          case "15":
            runApp = false;
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
    function exitOrMenu() {
      let exitOrMenu = 3;
      while (exitOrMenu != 1 && exitOrMenu != 2) {
        console.log("\nWhat do you want to do now?\n 1. Main menu \n 2. Exit \n");
        exitOrMenu = p("Please make a choice by entering a number: ");
        if (exitOrMenu == 1) {
          Menu();
        } else if (exitOrMenu == 2) {
          console.log("\nGoodbye!\n");
          process.exit();
        } else {
          console.log("Invalid input, please try again");
        }
      }
    }

    Menu();
  } //End of if-function
} catch (error) {
  console.log("Error connecting to MongoDB:", error);
};