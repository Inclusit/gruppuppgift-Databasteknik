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

      const Product = mongoose.model("Products", productSchema);

      const Offer = mongoose.model("Offers", offerSchema);

      const Order = mongoose.model("Orders", orderSchema);

      const { db } = mongoose.connection;
      const productList = db.collection("productList");

      if (Product) {
        try {
          let productsData = [
            {
              name: "Mens Casual Premium Slim Fit T-Shirts",
              category: "men's clothing",
              type: "top",
              price: 22.3,
              cost: 17.84,
              stock: 15,
            },
            {
              name: "Mens Cotton Jacket",
              category: "men's clothing",
              type: "jacket",
              price: 55.99,
              cost: 44.79,
              stock: 30,
            },
            {
              name: "Mens Casual Slim Fit",
              category: "men's clothing",
              type: "top",
              price: 15.99,
              cost: 12.79,
              stock: 22,
            },
            {
              name: "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
              category: "jewelery",
              type: "jewelery",
              price: 695,
              cost: 556,
              stock: 17,
            },
            {
              name: "Solid Gold Petite Micropave",
              category: "jewelery",
              type: "jewelery",
              price: 168,
              cost: 134.4,
              stock: 29,
            },
            {
              name: "White Gold Plated Princess",
              category: "jewelery",
              type: "jewelery",
              price: 9.99,
              cost: 7.992,
              stock: 5,
            },
            {
              name: "Pierced Owl Rose Gold Plated Stainless Steel Double",
              category: "jewelery",
              type: "jewelerey",
              price: 10.99,
              cost: 8.792,
              stock: 10,
            },
            {
              name: "BIYLACLESEN Women's 3-in-1 Snowboard Jacket Winter Coats",
              category: "women's clothing",
              type: "jacket",
              price: 56.99,
              cost: 45.592,
              stock: 7,
            },
            {
              name: "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket",
              category: "women's clothing",
              type: "jacket",
              price: 29.95,
              cost: 23.96,
              stock: 11,
            },
            {
              name: "Rain Jacket Women Windbreaker Striped Climbing Raincoats",
              category: "women's clothing",
              type: "jacket",
              price: 39.99,
              cost: 31.992,
              stock: 14,
            },
            {
              name: "MBJ Women's Solid Short Sleeve Boat Neck V",
              category: "women's clothing",
              type: "top",
              price: 9.85,
              cost: 7.88,
              stock: 21,
            },
            {
              name: "Opna Women's Short Sleeve Moisture",
              category: "women's clothing",
              type: "top",
              price: 7.95,
              cost: 6.36,
              stock: 26,
            },
            {
              name: "DANVOUY Womens T Shirt Casual Cotton Short",
              category: "women's clothing",
              type: "top",
              price: 12.99,
              cost: 10.392,
              stock: 3,
            },
          ];
          const countPre = await ProductsModel.countDocuments();
          console.log(
            "Number of repeated productinformation skipped:",
            countPre
          );

          if (countPre === 0) {
            await ProductsModel.insertMany(productsData);
          }
        } catch (error) {
          console.log("An error occurred", error);
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
