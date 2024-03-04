# SESSION-50
## Install Packages
```bash
npm init -y
npm install express mongoose
npm install cors
npm install jsonwebtoken


<!-- Create Server index.js -->
<!-- Create authentication using JWT filename auth -->
<!-- Create a user model, routes, controllers -->


 ## Inside User Model 
   firstName String
   lastName String
   Email  String
   Password String
   Role boolean
   MobileNo String


  ## Inside User Controller
   registerUser
   loginUser
   getProfile
   resetPassword
   updateUserAsAdmin


   ## Inside User Routes
   1./register
   2./login
   3./details
   4./update-password
   5./:userId/set-as-admin


    <!-- Inside auth.js -->
     1. createAccessToken
     2. verify
     3. verifyAdmin
     4. isLoggedIn



# SESSION-51

## Inside Cart Model 
   Name String
   Description String
   Price Number
   Activation: isActive Boolean
   createdOn: Date

## Inside Cart Model 
  {
   userId String
  },
    cartItems:[
   {
     productId String
     quantity Number
     subTotal: Number
   }
  ],

 totalPrice: {
    type: Number,
    
  orderedOn: {
    type: Date,
    default: Date.now
  }

});

## Inside Order Model 
  {
   userId String
  },
    productsOrdered:[
   {
     productId String
     quantity Number
     subTotal: Number
   }
  ],

 totalPrice: {
    type: Number,
    
  orderedOn: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: 'Pending'
  }

});


  ## Inside Product Controller
   Add Product
   Get all products
   Get Product
   Update Product
   Get all active product
   Archive Product
   Activate Product


   ## Inside Product Routes
   1. "/" Create Product
   2."/all" Retrive all products for admin only
   3."/" Retrive all active products for all.
   4."/:productId" Retrieve single product for all.
   5. "/:productId/update" Update product info for admin only
   6. "/:productId/archive" Archive Product for admin only
   7. "/:productId/activate" Activate product for admin only.


    <!-- Inside auth.js to products -->
     1. verify
     2. verifyAdmin
     3. isLoggedIn

  # SESSION 52
   ## Inside Cart Controller
   1. Retrieve users cart
   2. Add to cart
   3. Change product quantities.

   

   ## Inside Cart Routes
   1. "/get-cart" Retrieve user's cart access authenticated user.
   2."/add-to-cart" Add to cart authenticated user.
   3."/update-cart-quantity"  Change product quantities in cart authenticated user.



   <!-- Inside auth.js to cart -->
     1. verify
     2. verifyAdmin
     3. isLoggedIn

    # SESSION 53

    ## Inside product routes

    1.Create routes remove item from cart cartItems
    2. Create routes clear cartItems
    3. Create routes for add search from products by their names
    4. Create routes for add search for products by price range


   ## Inside product controllers

    1.Create controller remove item from cart cartItems
    2. Create controller clear cartItems
    3. Create controller for add search from products by their names
    4. Create controller for add search for products by price range

   ## Authenticated for non-admin

   1.Create authenthicated for non-admin user send-post
   2.API validates user identity via JWT, returns a message and error details if validation fails
   3.If validation successful, Find the cart of the user using the user's ID from passed token.

   #SESSION 54
   ## Inside order routes
    1. Create route order "/checkout" for authenticated user.
    2. Create route for retrieve logged-in user's orders /my-orders for authenticated user.
    3. Create route for retrieve all user's orders for admin only. 


   
   ## Inside order controllers
    1. Create controllers order "createOrder" for authenticated user.
    2. Create controllers for retrieve logged-in user's orders "getUserOrder" for authenticated user.
    3. Create controllers for retrieve all user's "getAllOrder" orders for admin only. 


    ## Using JWT
    1. Authenticated Admin for user send get request containg JWT in its header to the/orders/all-orders endpoint.
    2. API validates user identity via JWT. 
    3. If validation successful, find all all-orders
    4. Then send the found orders to the client.
    5. Catch the error and send message and the error details in the client. 


