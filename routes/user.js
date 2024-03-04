const express = require("express");
const userController = require("../controllers/user");
// Import the auth module and deconstruct it to get our verify method.
const {verify, verifyAdmin, isLoggedIn} = require("../auth");

// [SECTION] Routing Component
const router = express.Router();


// [SECTION] Route for user registration
router.post("/checkEmail", userController.checkEmailExists);

router.post("/register", userController.registerUser);

router.post("/login", userController.loginUser);

router.get("/details", verify, userController.getProfile);

router.post("/update-password", verify, userController.resetPassword);

router.patch("/:userId/set-as-admin", verify, verifyAdmin, userController.updateUserAsAdmin)















// [SECTION] Export Route System
module.exports = router;