const Product = require('./Model');
const { connect } = require('mongoose')
require('dotenv').config()

// =============Create Product=============//

const createProduct = async (req, res) => {
    const { products } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
        return res.status(403).json({
            message: "Missing or invalid products data",
        });
    } else {
        try {
            await connect(process.env.MONGO_URL);
            await Product.insertMany(products);
            res.json({ message: 'Products created successfully' });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

//============ Get Product by Brand============//

const getProductByBrand = async (req, res) => {
    const { brand } = req.body;
    try {
        await connect(process.env.MONGO_URL);

        const products = await Product.find({ brand });

        if (products.length === 0) {
            return res.status(404).json({
                message: 'No products found for the given brand',
            });
        }

        res.json({ products });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};


// =============Get Product by Category==========//

const getProductByCategory = async (req, res) => {
    const { category } = req.body;
    try {
        await connect(process.env.MONGO_URL);

        const products = await Product.find({ category });

        if (products.length === 0) {
            return res.status(404).json({
                message: 'No products found for the given category',
            });
        }
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};


//============== Update Product==============//

const updateProduct = async (req, res) => {
    const { _id, ...updateData } = req.body;
    const filter = { _id };
    try {
        await connect(process.env.MONGO_URL);

        const updatedProduct = await Product.findOneAndUpdate(filter, updateData, {
            new: true,
        });

        if (!updatedProduct) {
            return res.status(404).json({
                message: 'Product not found',
            });
        }

        const allProducts = await Product.find(); // Get all products after updating

        res.json({ message: 'Success', product: updatedProduct, allProducts });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};


//  =========== Delete Product========//

const deleteProduct = async (req, res) => {
    const { _id } = req.body; // For deleting, we can use the product ID from the JSON body
    try {
        await connect(process.env.MONGO_URL);
        await Product.findByIdAndDelete(_id); // Use the product ID directly
        const allProducts = await Product.find(); // Get all products after deletion

        res.status(200).json({
            message: "Product deleted successfully",
            allProducts
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

// ============Get All Products===========//
const getAllProducts = async (req, res) => {
    try {
        await connect(process.env.MONGO_URL);
        const products = await Product.find();

        if (products.length === 0) {
            return res.status(404).json({
                message: 'No products found',
            });
        }

        res.json({ products });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};


module.exports = { createProduct, getProductByBrand, getProductByCategory, updateProduct, deleteProduct, getAllProducts };
