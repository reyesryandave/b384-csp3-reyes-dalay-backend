// Importing of Dependencies and Modules
const Cart = require("../models/Cart");
const User = require("../models/User");
const Product = require("../models/Product");

// Get the cart of the user
module.exports.getCart = (req, res) => {
    if (!req.user) {
        return res.status(403).send({ error: "User Unauthorized" });
    }

    Cart.findOne({ userId: req.user.id })
        .then(cart => {
            if (!cart) {
                return res.status(404).send({ error: "No cart found" });
            } else {
                return res.status(200).send({cart: cart});
            }
        })
        .catch(err => {
            console.error("Error in getting cart:", err);
            return res.status(500).send({ error: "Failed to get the cart" });
        });
};


// Add to cart of the user
module.exports.addToCart = (req, res) => {
    if (req.user.isAdmin) {
        return res.status(403).send({ error: "Admin users are forbidden to perform this action" });
    }

    const userId = req.user.id;
    const { quantity } = req.body;
    const productId = req.params.productId;

    Product.findById(productId)
        .then(product => {
            if (!product) {
                return res.status(404).send({ error: "Product not found" });
            } else if (!product.isActive) {
                return res.status(400).send({ error: "Product is not available" });
            }

            const subTotal = product.price * quantity;

            return Cart.findOne({ userId })
                .then(cart => {
                    if (!cart) {
                        cart = new Cart({ userId, cartItems: [], totalPrice: 0 });
                    }

                    const existingProductIndex = cart.cartItems.findIndex(item => item.productId === productId);
                    if (existingProductIndex !== -1) {
                        cart.cartItems[existingProductIndex].quantity += quantity;
                        cart.cartItems[existingProductIndex].subTotal += subTotal;
                    } else {
                        cart.cartItems.push({ 
                            productId,
                            productName: product.name,
                            price: product.price,
                            quantity,
                            subTotal 
                        });
                    }

                    cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subTotal, 0);

                    return cart.save()
                        .then(savedCart => {
                            res.status(200).send({ message: "Product added to cart successfully", cart: savedCart });
                        })
                        .catch(err => {
                            console.error("Error adding product to cart.", err);
                            res.status(500).send({ error: "Internal server error" });
                        });
                })
                .catch(err => {
                    console.error("Error finding the cart by ID", err);
                    return res.status(500).send({ error: "Failed to find the cart." });
                })
        })
        .catch(err => {
            console.error("Error finding product by ID.", err);
            return res.status(500).send({ error: "Failed to find the product." });
        })
};


// Updating the cart of the user
module.exports.updateCart = (req, res) => {
    if (req.user.isAdmin) {
        return res.status(403).send({ error: "Admin users are forbidden to perform this action" });
    }

    const userId = req.user.id;
    const { quantity } = req.body;
    const productId = req.params.productId;

    Product.findById(productId)
        .then(product => {
            if (!product) {
                return res.status(404).send({ error: "Product not found" });
            } else if (!product.isActive) {
                return res.status(400).send({ error: "Product is not available" });
            }

            // Calculate subTotal
            const subTotal = product.price * quantity;

            return Cart.findOne({ userId })
                .then(cart => {
                    if (!cart) {
                        return res.status(404).send({ error: "No cart found" });
                    }

                    const existingProduct = cart.cartItems.find(item => item.productId === productId);

                    if (existingProduct) {
                        // Update quantity and subTotal
                        existingProduct.quantity = quantity;
                        existingProduct.subTotal = subTotal;
                    } else {
                        return res.status(404).send({ error: "Product not found in cart" });
                    }

                    // Recalculate total price
                    cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subTotal, 0);

                    return cart.save()
                        .then(savedCart => {
                            res.status(200).send({ message: "Cart updated successfully", cart: savedCart });
                        })
                        .catch(err => {
                            console.error("Error updating cart.", err);
                            res.status(500).send({ error: "Internal server error" });
                        });
                })
                .catch(err => {
                    console.error("Error finding the cart by ID", err);
                    return res.status(500).send({ error: "Failed to find the cart." });
                });
        })
        .catch(err => {
            console.error("Error finding product by ID.", err);
            return res.status(500).send({ error: "Failed to find the product." });
        });
};


// Removing item from the cart
module.exports.removeItemFromCart = (req, res) => {
    if(req.user.isAdmin){
        return res.status(403).send({error: "Admin users are forbidden to perform this action"});
    }

    const userId = req.user.id;
    const productId = req.params.productId;

    return Cart.findOne({ userId })
    .then(cart => {
        if(!cart){
            return res.status(404).send({error: "No cart found"})
        }

        const cartItemIndex = cart.cartItems.findIndex(item => item.productId === productId);
        if (cartItemIndex === -1) {
            return res.status(404).json({ error: "Product not found in cart" });
        }

        cart.cartItems.splice(cartItemIndex, 1);

        cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subTotal, 0);

        return cart.save()
        .then(savedCart => {
            res.status(200).json({ message: "Product removed from cart successfully", cart: savedCart });
        })
        .catch(err => {
            console.error("Error removing product from cart.", err);
            res.status(500).json({ error: "Failed to remove product from cart." });
        })
    })
    .catch(err => {
        console.error("Error finding cart by ID.", err);
        return res.status(500).send({ error: "Failed to find the cart." });
    })
};


// Clearing the cart
module.exports.clearCart = (req, res) => {
    if(req.user.isAdmin){
        return res.status(403).send({error: "Admin users are forbidden to perform this action"});
    }

    const userId = req.user.id

    return Cart.findOne({ userId })
    .then(cart => {
        if(!cart){
            return res.status(404).send({error: "No cart found"})
        } else if(cart.cartItems.length === 0){
            return res.status(400).send({error: "Cart is already empty"})
        } 

        cart.cartItems = [];
        cart.totalPrice = 0;

        return cart.save()
        .then(savedCart => {
            res.status(200).json({ message: "All products removed from the cart", cart: savedCart });
        })
        .catch(err => {
            console.error("Error removing all products from cart.", err);
            res.status(500).json({ error: "Failed to remove all products from cart." });
        })
    })
    .catch(err => {
        console.error("Error finding cart by ID.", err);
        return res.status(500).send({ error: "Failed to find the cart." });
    })
};