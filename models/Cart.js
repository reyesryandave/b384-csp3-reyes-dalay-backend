// Importing of Dependencies, Modules, and Models
const mongoose = require("mongoose");

// Setup for cartSchema
const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, 'User ID is Required']
    }, 
    cartItems: [
        {
            productId: {
                type: String,
                required: [true, 'Product ID is Required']
            },
            productName: {
                type: String,
                required: [true, 'Product Name is Required']
            },
            price: {
                type: Number,
                required: [true, 'Price is Required']
            },
            quantity: {
                type: Number,
                required: [true, 'Quantity is Required']
            },
            subTotal: {
                type: Number,
                required: [true, 'Subtotal is Required']
            }
        }
    ],
    totalPrice: {
        type: Number,
        required: [true, 'Total Price is Required']
    },
    orderedOn: {
        type: Date,
        default: Date.now
    }
});

// Exporting and Setup for cart model
module.exports = mongoose.model('Cart', cartSchema);