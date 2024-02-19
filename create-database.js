import mongoose, { connect } from "mongoose";

export async function database() {
  try {
    const con = await connect("mongodb://127.0.0.1:27017/onlineStore");

    if (con) {
      console.log("connected to MongoDB");

      const productSchema = mongoose.Schema({
        name: { type: String },
        category: { type: String },
        price: { type: Number },
        cost: { type: Number },
        stock: { type: Number },
      });

      const offerSchema = mongoose.Schema({
        offer: {type: Number},
        products: [String],
        price: {type: Number},
        active: {type: Boolean}
      });

      const supplierSchema = mongoose.Schema({
        supplier: [],
        name: {type: String},
        contact: {type: String}
      });

      const orderSchema = mongoose.Schema({
        order: {type: String},
        offer: {type: Number},
        quantity: {type: Number},
        status: {type: Boolean}
      })

      const ProductsModel = mongoose.model("Products", productSchema);

      const OfferModel = mongoose.model("Offers", offerSchema);

      const supplierModel = mongoose.model("Supplier", supplierSchema);

      const orderModel = mongoose.model("Orders", orderSchema);


      const { db } = mongoose.connection;
      const productList = db.collection("productList");

      if (ProductsModel) {
        try {
          let productsData = [
            {
              name: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
              category: "men's clothing",
              price: 109.95,
              cost: 87.96,
              stock: 12,
            },
            {
              name: "Mens Casual Premium Slim Fit T-Shirts",
              category: "men's clothing",
              price: 22.3,
              cost: 17.84,
              stock: 27,
            },
            {
              name: "Mens Cotton Jacket",
              category: "men's clothing",
              price: 55.99,
              cost: 44.79,
              stock: 5,
            },
            {
              name: "Mens Casual Slim Fit",
              category: "men's clothing",
              price: 15.99,
              cost: 12.79,
              stock: 16,
            },
            {
              name: "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
              category: "jewelery",
              price: 695,
              cost: 556,
              stock: 8,
            },
            {
              name: "Solid Gold Petite Micropave",
              category: "jewelery",
              price: 168,
              cost: 134.4,
              stock: 20,
            },
            {
              name: "White Gold Plated Princess",
              category: "jewelery",
              price: 9.99,
              cost: 7.992,
              stock: 2,
            },
            {
              name: "Pierced Owl Rose Gold Plated Stainless Steel Double",
              category: "jewelery",
              price: 10.99,
              cost: 8.792,
              stock: 28,
            },
            {
              name: "WD 2TB Elements Portable External Hard Drive - USB 3.0",
              category: "electronics",
              price: 64,
              cost: 51.2,
              stock: 19,
            },
            {
              name: "SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s",
              category: "electronics",
              price: 109,
              cost: 87.2,
              stock: 1,
            },
            {
              name: "Silicon Power 256GB SSD 3D NAND A55 SLC Cache Performance Boost SATA III 2.5",
              category: "electronics",
              price: 109,
              cost: 87.2,
              stock: 9,
            },
            {
              name: "WD 4TB Gaming Drive Works with Playstation 4 Portable External Hard Drive",
              category: "electronics",
              price: 114,
              cost: 91.2,
              stock: 14,
            },
            {
              name: "Acer SB220Q bi 21.5 inches Full HD (1920 x 1080) IPS Ultra-Thin",
              category: "electronics",
              price: 599,
              cost: 479.2,
              stock: 7,
            },
            {
              name: "Samsung 49-Inch CHG90 144Hz Curved Gaming Monitor (LC49HG90DMNXZA) – Super Ultrawide Screen QLED",
              category: "electronics",
              price: 999.99,
              cost: 799.992,
              stock: 22,
            },
            {
              name: "BIYLACLESEN Women's 3-in-1 Snowboard Jacket Winter Coats",
              category: "women's clothing",
              price: 56.99,
              cost: 45.592,
              stock: 18,
            },
            {
              name: "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket",
              category: "women's clothing",
              price: 29.95,
              cost: 23.96,
              stock: 29,
            },
            {
              name: "Rain Jacket Women Windbreaker Striped Climbing Raincoats",
              category: "women's clothing",
              price: 39.99,
              cost: 31.992,
              stock: 25,
            },
            {
              name: "MBJ Women's Solid Short Sleeve Boat Neck V",
              category: "women's clothing",
              price: 9.85,
              cost: 7.88,
              stock: 3,
            },
            {
              name: "Opna Women's Short Sleeve Moisture",
              category: "women's clothing",
              price: 7.95,
              cost: 6.36,
              stock: 11,
            },
            {
              name: "DANVOUY Womens T Shirt Casual Cotton Short",
              category: "women's clothing",
              price: 12.99,
              cost: 10.392,
              stock: 26,
            },
          ];
          const countPre = await ProductsModel.countDocuments();
          console.log("Number of repeated productinformation skipped:", countPre);

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
