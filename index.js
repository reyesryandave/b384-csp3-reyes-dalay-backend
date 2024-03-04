// [SECTION] Dependencies and Modules
const express = require("express");
const mongoose = require("mongoose");

// Allows our backend application to be available to our frontend application
// Allows us to control the app's Cross-Origin Resources Sharing settings
const cors = require("cors");
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order")

// [SECTION] Environment Setup
const port = 4000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

// [SECTION] Database Connection
mongoose.connect("mongodb+srv://reyesryandave:admin@cluster0.rfy1rol.mongodb.net/ecommerce-product?retryWrites=true&w=majority")

mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas.'));

// [SECTION] Backend Routes
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/carts", cartRoutes);
app.use("/orders", orderRoutes);

// [SECTION] Server Gateway Response
if(require.main === module){
	// "process.env.PORT || port" will use the environment variable if it is avaiable OR will used port 4000 if none is defined
	app.listen(process.env.PORT || port, () => {
		console.log(`API is now online on port ${process.env.PORT || port}`)
	});
}

module.exports = { app, mongoose };
