const Order = require("../models/Order");
const Cart = require("../models/Cart");
const User = require('../models/User');


module.exports.createOrder = (req, res) => {
    const userId = req.user.id;

    User.findById(userId)
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            Cart.findOne({ userId })
                .then(cart => {
                    if (!cart) {
                        return res.status(404).json({ message: 'Cart not found for this user' });
                    }

                    if (cart.cartItems.length === 0) {
                        return res.status(400).json({ message: 'Cart is empty' });
                    }

                    const newOrder = new Order({
                        userId: userId,
                        productsOrdered: cart.cartItems.map(item => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            subTotal: item.subTotal,
                        })),
                        totalPrice: cart.totalPrice
                    });

                    return newOrder.save()
                        .then(savedOrder => {
                            cart.cartItems = [];
                            return cart.save().then(() => savedOrder);
                        });
                })
                .then(savedOrder => {
                    res.status(200).json({ message: 'Order placed successfully', order: savedOrder });
                })
                .catch(err => {
                    console.error('Error during checkout:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                });
        })
        .catch(err => {
            console.error('Error finding user:', err);
            return res.status(500).json({ error: 'Internal server error' });
        });
};


module.exports.getUserOrders = (req, res) => {
    const userId = req.user.id;

    Order.find({ userId })
        .then(orders => {
            res.status(200).json({ orders });
        })
        .catch(err => {
            console.error('Error fetching user orders:', err);
            res.status(500).json({ error: 'Internal server error' });
        });
};

// [SECTION]
exports.getAllOrder = (req, res) => {
    Order.find()
        .then(orders => {
            res.status(200).json({ orders });
        })
        .catch(err => {
            console.error('Error fetching all orders:', err);
            res.status(500).json({ error: 'Internal server error' });
        });
};