const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: [true, 'User ID is Required']
	}, productsOrdered:[
		{
			productId: {
				type: String,
				required: [true, 'Cart ID is Required']
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
		required: [true, 'Total price is Required']
	},
	orderedOn: {
		type: Date,
		default: Date.now
	},
	status: {
		type: String,
		default: 'Pending'
	}

});

// [SECTION] Model
module.exports = mongoose.model('Order', orderSchema);