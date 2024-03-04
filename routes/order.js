const express = require("express");
const orderController = require("../controllers/order")
const {verify, verifyAdmin, isLoggedIn} = require("../auth");

// [SECTION] Routing Component
const router = express.Router();

// [SECTION] Route for create order.
router.post("/checkout", verify, orderController.createOrder);


// [SECTION] Route for Retrieve logged in user's orders
 router.get("/my-orders", verify, orderController.getUserOrders);


// [SECTION] Route for Retrieve all user's orders
 router.get("/all-orders", verify, verifyAdmin, orderController.getAllOrder);

module.exports = router;