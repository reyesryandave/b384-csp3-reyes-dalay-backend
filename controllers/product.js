//[SECTION] Dependencies and Modules
const Product = require("../models/Product");

// [SECTION] addProduct Controller
module.exports.addProduct = (req, res) => {


    let newProduct = new Product({
        name : req.body.name,
        description : req.body.description,
        price : req.body.price
    });

    Product.findOne({ name: req.body.name })
    .then(existingProduct => {
        if(existingProduct){
            return res.status(409).send({ error : 'Product already exists'});
        }


        return newProduct.save()
        .then(savedProduct => {
            res.status(201).send(savedProduct)
        })

        .catch(saveErr => {
            console.error("Error in saving product: ", saveErr)
            res.status(500).send({error: 'Failed to save the product'})
        })
    })
    .catch(findErr => {
        console.error("Error in finding the product: ", findErr)
        return res.status(500).send({ error: "Error finding the product" });
    });
};

// [SECTION] getAllProduct Controller
module.exports.getAllProduct = (req, res) => {

    return Product.find({}).then(products => {
        if(products.length > 0){
            return res.status(200).send({ products });
        }
        else{
            return res.status(200).send({ message: 'No product found.' });
        }
    })
    .catch(err => {
        console.error("Error in finding all products:", err)
        return res.status(500).send({ error: 'Error finding product.'})
    });

};

// [SECTION] getAllActive Controller
module.exports.getAllActive = (req, res) => {
    Product.find({ isActive: true })
    .then(products => {
        if(products.length > 0){
            return res.status(200).send({products});
        } else {
            return res.status(200).send({ message: 'No active product found.'});
        }
    })
    .catch(err => {
        console.error("Error in finding active product: ", err)
        return res.status(500).send({ error: 'Error finding active product.'})
    });
}

// [SECTION] getProduct Controller
module.exports.getProduct = (req, res) => {

    const productId = req.params.productId;

    Product.findById(productId)
    .then(product => {
        if (!product) {
            return res.status(404).send({ error: 'product not found' });
        }
        return res.status(200).send({ product });
    })
    .catch(err => {
        console.error("Error in fetching the product: ", err)
        return res.status(500).send({ error: 'Failed to fetch product' });
    })
    
};

// [SECTION] updateProduct Controller
module.exports.updateProduct = (req, res) => {

    // Made variable names more descriptive to enhance code readability
    const productId = req.params.productId;

    let updateProduct = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    }

    Product.findByIdAndUpdate(productId, updateProduct, { new : true })
    .then(updateProduct => {

        if(!updateProduct) {
            return res.status(404).send({ error: 'Product not found'});
        } 
        return res.status(200).send({ 
            message: 'Product updated successfully', 
            updateProduct: updateProduct 
        })
    })
    .catch(err => {
        console.error("Error in updating a product: ", err)
        return res.status(500).send({error: 'Error in updating a product.'})
    });
};

// [SECTION Archive Product]
module.exports.archiveProduct = (req, res) => {

    let updateActiveField = {
        isActive: false
    }

    if (req.user.isAdmin == true){
        return Product.findByIdAndUpdate(req.params.productId, updateActiveField)
        .then(archiveProduct => {
            if (!archiveProduct) {
                return res.status(404).send({ error: 'Product not found' });
            }
            return res.status(200).send({ 
                message: 'Product archived successfully', 
                archiveProduct: archiveProduct 
            });
        })
        .catch(err => {
            console.error("Error in archiving a product: ", err)
            return res.status(500).send({ error: 'Failed to archive product' })
        });
    }
    else {
        return res.status(403).send(false);
    }
};

// [SECTION Activate Product]
module.exports.activateProduct = (req, res) => {

    let updateActiveField = {
        isActive: true
    }
    if (req.user.isAdmin == true){
        return Product.findByIdAndUpdate(req.params.productId, updateActiveField)
        .then(activateProduct => {
            if (!activateProduct) {
                return res.status(404).send({ error: 'Product not found' });
            }
            return res.status(200).send({ 
                message: 'Product activated successfully', 
                activateProduct: activateProduct
            });
        })
        .catch(err => {
            console.error("Error in activating a product: ", err)
            return res.status(500).send({ error: 'Failed activating a product' })
        });
    }
    else{
        return res.status(403).send(false);
    }
};


// [SECTION] To search product by their names 
module.exports.searchProductByName = async (req, res) => {
      try {

        const { name } = req.body;

        const product = await Product.find({
            name: { $regex: name, $options: 'i' }
        });

        res.status(200).json(product);
    } catch (error) {
        console.error(error);

        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// [SECTION] To search product by their price, either minPrice or maxpPrice 
module.exports.searchProductByPrice = async (req, res) => {
    try {
        const { minPrice, maxPrice } = req.body;

        if (!minPrice && !maxPrice) {
            return res.status(400).json({ error: 'Please provide at least one price value.' });
        }

        let query = {};
        if (minPrice && maxPrice) {
            query = { price: { $gte: minPrice, $lte: maxPrice } };
        } else if (minPrice) {
            query = { price: { $gte: minPrice } };
        } else {
            query = { price: { $lte: maxPrice } };
        }

        const products = await Product.find(query);

        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};