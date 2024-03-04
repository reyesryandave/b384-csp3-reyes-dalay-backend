//[SECTION] Dependencies and Modules
const express = require("express");
const productController = require("../controllers/product");
const {verify, verifyAdmin, isLoggedIn} = require("../auth");

// [SECTION] Routing Component
const router = express.Router();

// [SECTION] Route for Creating Products
router.post("/", verify, verifyAdmin, productController.addProduct); 

//[SECTION] Route for retrieving all Product
router.get("/all", verify, verifyAdmin, productController.getAllProduct);

//[SECTION] Route for retrieving all active Product
router.get("/", productController.getAllActive);

// [SECTION] Route for retrieving single Product
router.get("/:productId", productController.getProduct);

// [SECTION] Route for updating Product
router.patch("/:productId/update", verify, verifyAdmin, productController.updateProduct);

// [SECTION] Route for archiving Product
router.patch("/:productId/archive", verify, verifyAdmin, productController.archiveProduct);

// [SECTION] Route for activating Product
router.patch("/:productId/activate", verify, verifyAdmin, productController.activateProduct);


// [SECTION] Route for search product by their names
router.post("/searchByName", productController.searchProductByName);

// [SECTION] Route for search product by their price
router.post("/searchByPrice", productController.searchProductByPrice);



module.exports = router;