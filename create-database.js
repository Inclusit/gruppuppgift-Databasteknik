import mongoose, { connect } from "mongoose";

export async function database() {
  try {
    const con = await connect("mongodb://127.0.0.1:27017/onlineStore");

    if (con) {
      console.log("connected to MongoDB");

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
          ref: "Categories",
        },
        type: { type: String },
        price: { type: Number },
        cost: { type: Number },
        stock: { type: Number },
        supplier: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Suppliers",
        },
      });

      const offerSchema = mongoose.Schema({
        name: { type: String },
        products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
        categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
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

      // const orderSchema = mongoose.Schema({
      //   products: [
      //     {
      //       product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      //       quantity: { type: Number, required: true },
      //     },
      //   ],
      //   offer: { type: mongoose.Schema.Types.ObjectId, ref: "Offer" },
      //   quantity: { type: Number, required: true },
      //   status: {
      //     type: String,
      //     enum: ["pending", "shipped"],
      //     default: "pending",
      //   },
      // });

      const orderSchema = mongoose.Schema({
        offers: [
          {
            offer: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Offer", // Refererar till Offer-modellen
            },
            quantity: { type: Number, required: true },
          },
        ],
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
        details: String,
        status: String, //"pending"/"shipped"
        type: String,
        total_revenue: Number,
        total_profit: Number,
      });
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

      const categories = db.collection("categories");
      const suppliers = db.collection("suppliers");
      const productList = db.collection("products");
      const currentOffers = db.collection("currentOffers");
      const orders = db.collection("orders");

      if (Supplier) {
        try {
          let suppliersData = [
            {
              name: "supplier_1",
              contact: { name: "Sven Svensson", email: "sven@suppliers_1.com" },
            },
            {
              name: "supplier_2",
              contact: {
                name: "Johan Johansson",
                email: "johan@suppliers_2.com",
              },
            },
            {
              name: "supplier_3",
              contact: {
                name: "Gunnar Gunnarsson",
                email: "gunnar@supplier_3.com",
              },
            },
          ];

          const countSuppliers = await Supplier.countDocuments();
          console.log("Number of repeated suppliers skipped:", countSuppliers);

          if (countSuppliers === 0) {
            await Supplier.insertMany(suppliersData);
          }
        } catch (error) {
          console.log("An error occurred while adding suppliers", error);
        }
      }

      if (Category) {
        try {
          let categoriesData = [
            { name: "men's clothing", description: "Clothing for men" },
            { name: "women's clothing", description: "Clothing for women" },
            { name: "jewelery", description: "Jewelery products" },
          ];

          const countCategories = await Category.countDocuments();
          console.log(
            "Number of repeated categories skipped:",
            countCategories
          );

          if (countCategories === 0) {
            await Category.insertMany(categoriesData);
          }
        } catch (error) {
          console.log("An error occurred while adding categories", error);
        }
      }

     
      if (Products) {
        try {
          let productsData = [
            {
              name: "Mens Casual Premium Slim Fit T-Shirts",
              category: await Category.findOne({ name: "men's clothing" }),
              type: "top",
              price: 22.3,
              cost: 17.84,
              stock: 15,
              supplier: await Supplier.findOne({ name: "supplier_1" }),
            },
            {
              name: "Mens Cotton Jacket",
              category: await Category.findOne({ name: "men's clothing" }),
              type: "jacket",
              price: 55.99,
              cost: 44.79,
              stock: 30,
            },
            {
              name: "Mens Casual Slim Fit",
              category: await Category.findOne({ name: "men's clothing" }),
              type: "top",
              price: 15.99,
              cost: 12.79,
              stock: 22,
              supplier: await Supplier.findOne({ name: "supplier_1" }),
            },
            {
              name: "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
              category: await Category.findOne({ name: "jewelery" }),
              type: "jewelery",
              price: 695,
              cost: 556,
              stock: 17,
              supplier: await Supplier.findOne({ name: "supplier_2" }),
            },
            {
              name: "Solid Gold Petite Micropave",
              category: await Category.findOne({ name: "jewelery" }),
              type: "jewelery",
              price: 168,
              cost: 134.4,
              stock: 29,
              supplier: await Supplier.findOne({ name: "supplier_2" }),
            },
            {
              name: "White Gold Plated Princess",
              category: await Category.findOne({ name: "jewelery" }),
              type: "jewelery",
              price: 9.99,
              cost: 7.992,
              stock: 5,
              supplier: await Supplier.findOne({ name: "supplier_3" }),
            },
            {
              name: "Pierced Owl Rose Gold Plated Stainless Steel Double",
              category: await Category.findOne({ name: "jewelery" }),
              type: "jewelerey",
              price: 10.99,
              cost: 8.792,
              stock: 10,
              supplier: await Supplier.findOne({ name: "supplier_2" }),
            },
            {
              name: "BIYLACLESEN Women's 3-in-1 Snowboard Jacket Winter Coats",
              category: await Category.findOne({ name: "women's clothing" }),
              type: "jacket",
              price: 56.99,
              cost: 45.592,
              stock: 7,
              supplier: await Supplier.findOne({ name: "supplier_2" }),
            },
            {
              name: "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket",
              category: await Category.findOne({ name: "women's clothing" }),
              type: "jacket",
              price: 29.95,
              cost: 23.96,
              stock: 11,
              supplier: await Supplier.findOne({ name: "supplier_3" }),
            },
            {
              name: "Rain Jacket Women Windbreaker Striped Climbing Raincoats",
              category: await Category.findOne({ name: "women's clothing" }),
              type: "jacket",
              price: 39.99,
              cost: 31.992,
              stock: 14,
              supplier: await Supplier.findOne({ name: "supplier_3" }),
            },
            {
              name: "MBJ Women's Solid Short Sleeve Boat Neck V",
              category: await Category.findOne({ name: "women's clothing" }),
              type: "top",
              price: 9.85,
              cost: 7.88,
              stock: 21,
              supplier: await Supplier.findOne({ name: "supplier_1" }),
            },
            {
              name: "Opna Women's Short Sleeve Moisture",
              category: await Category.findOne({ name: "women's clothing" }),
              type: "top",
              price: 7.95,
              cost: 6.36,
              stock: 26,
              supplier: await Supplier.findOne({ name: "supplier_1" }),
            },
            {
              name: "DANVOUY Womens T Shirt Casual Cotton Short",
              category: await Category.findOne({ name: "women's clothing" }),
              type: "top",
              price: 12.99,
              cost: 10.392,
              stock: 3,
              supplier: await Supplier.findOne({ name: "supplier_2" }),
            },
          ];

          const countPre = await Products.countDocuments();
          console.log(
            "Number of repeated productinformation skipped:",
            countPre
          );

          if (countPre === 0) {
            await Products.insertMany(productsData);
          }
        } catch (error) {
          console.log("An error occurred", error);
        }
      }
      if (Offer) {
        try {
          const offer1Product1 = await Products.findOne({
            name: "Mens Casual Premium Slim Fit T-Shirts",
          });

          const offer1Product2 = await Products.findOne({
            name: "Mens Cotton Jacket",
          });

          const offer2Product1 = await Products.findOne({
            name: "White Gold Plated Princess",
          });

          const offer2Product2 = await Products.findOne({
            name: "Pierced Owl Rose Gold Plated Stainless Steel Double",
          });

          const offer3Product1 = await Products.findOne({
            name: "MBJ Women's Solid Short Sleeve Boat Neck V",
          });

          const offer3Product2 = await Products.findOne({
            name: "Opna Women's Short Sleeve Moisture",
          });

          let offersData = [
            {
              name: "Men's Casual Premium Offer",
              products: [offer1Product1, offer1Product2],
              categories: [offer1Product1.category, offer1Product2.category],
              price: (offer1Product1.price + offer1Product2.price) * 0.8,
              active: true,
              inStock: [
                {
                  product: offer1Product1._id,
                  status: offer1Product1.stock > 0 ? true : false,
                },
                {
                  product: offer1Product2._id,
                  status: offer1Product2.stock > 0 ? true : false,
                },
              ],
              bothInStock: offer1Product1.stock > 0 && offer1Product2.stock > 0,
            },
            {
              name: "Jewelery Offer",
              products: [offer2Product1, offer2Product2],
              categories: [offer2Product1.category, offer2Product2.category],
              price: (offer2Product1.price + offer2Product2.price) * 0.8,
              active: true,
              inStock: [
                {
                  product: offer2Product1._id,
                  status: offer2Product1.stock > 0 ? true : false,
                },
                {
                  product: offer2Product2._id,
                  status: offer2Product2.stock > 0 ? true : false,
                },
              ],
              bothInStock: offer2Product1.stock > 0 && offer2Product2.stock > 0,
            },
            {
              name: "Women's Casual Offer",
              products: [offer3Product1, offer3Product2],
              categories: [offer3Product1.category, offer3Product2.category],
              price: (offer3Product1.price + offer3Product2.price) * 0.8,
              active: true,
              inStock: [
                {
                  product: offer3Product1._id,
                  status: offer3Product1.stock > 0 ? true : false,
                },
                {
                  product: offer3Product2._id,
                  status: offer3Product2.stock > 0 ? true : false,
                },
              ],
              bothInStock: offer3Product1.stock > 0 && offer3Product2.stock > 0,
            },
          ];

       if (Offer) {
         try {
           const offer1Product1 = await Products.findOne({
             name: "Mens Casual Premium Slim Fit T-Shirts",
           });

           const offer1Product2 = await Products.findOne({
             name: "Mens Cotton Jacket",
           });

           const offer2Product1 = await Products.findOne({
             name: "White Gold Plated Princess",
           });

           const offer2Product2 = await Products.findOne({
             name: "Pierced Owl Rose Gold Plated Stainless Steel Double",
           });

           const offer3Product1 = await Products.findOne({
             name: "MBJ Women's Solid Short Sleeve Boat Neck V",
           });

           const offer3Product2 = await Products.findOne({
             name: "Opna Women's Short Sleeve Moisture",
           });

           let offersData = [
             {
               name: "Men's Casual Premium Offer",
               products: [offer1Product1, offer1Product2],
               categories: [offer1Product1.category, offer1Product2.category],
               price: (offer1Product1.price + offer1Product2.price) * 0.8,
               active: true,
               inStock: [
                 {
                   product: offer1Product1._id,
                   status: offer1Product1.stock > 0 ? true : false,
                 },
                 {
                   product: offer1Product2._id,
                   status: offer1Product2.stock > 0 ? true : false,
                 },
               ],
               bothInStock:
                 offer1Product1.stock > 0 && offer1Product2.stock > 0,
             },
             {
               name: "Jewelery Offer",
               products: [offer2Product1, offer2Product2],
               categories: [offer2Product1.category, offer2Product2.category],
               price: (offer2Product1.price + offer2Product2.price) * 0.8,
               active: true,
               inStock: [
                 {
                   product: offer2Product1._id,
                   status: offer2Product1.stock > 0 ? true : false,
                 },
                 {
                   product: offer2Product2._id,
                   status: offer2Product2.stock > 0 ? true : false,
                 },
               ],
               bothInStock:
                 offer2Product1.stock > 0 && offer2Product2.stock > 0,
             },
             {
               name: "Women's Casual Offer",
               products: [offer3Product1, offer3Product2],
               categories: [offer3Product1.category, offer3Product2.category],
               price: (offer3Product1.price + offer3Product2.price) * 0.8,
               active: true,
               inStock: [
                 {
                   product: offer3Product1._id,
                   status: offer3Product1.stock > 0 ? true : false,
                 },
                 {
                   product: offer3Product2._id,
                   status: offer3Product2.stock > 0 ? true : false,
                 },
               ],
               bothInStock:
                 offer3Product1.stock > 0 && offer3Product2.stock > 0,
             },
           ];

          const countOffers = await Offer.countDocuments();
          console.log("Number of existing offers:", countOffers);
           const countOffers = await Offer.countDocuments();
           console.log("Number of existing offers:", countOffers);

          if (countOffers === 0) {
            await Offer.insertMany(offersData);
            console.log("The following offers have been added:", offersData);
          } else {
            console.log("Offers already exist in the database");
          }
        } catch (error) {
          console.log("An error occurred while adding the offers:", error);
        }
      }
           if (countOffers === 0) {
             await Offer.insertMany(offersData);
             console.log("The following offers have been added:", offersData);
           } else {
             console.log("Offers already exist in the database");
           }
         } catch (error) {
           console.log("An error occurred while adding the offers:", error);
         }
       }
    }
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  } finally {
    mongoose.connection.close();
  }
}

database();
