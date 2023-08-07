const Brand = require('./Model');
const { connect } = require('mongoose')
require('dotenv').config()


// ============== Get All Brands ============= //

const getAllBrands = async (req, res) => {
    try {
        await connect(process.env.MONGO_URL);
        const brands = await Brand.find();
        res.json({ brands });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};

//=============Create brand==========//

const createBrand = async (req, res) => {
    const { BrandName, BrandImage } = req.body;

    if (!BrandName || !BrandImage) {
        return res.status(403).json({
            message: "Missing Required Field"
        });
    } else {
        try {
            await connect(process.env.MONGO_URL);
            const checkExisting = await Brand.exists({ BrandName });

            if (checkExisting) {
                res.status(400).json({
                    message: "Brand Already Exists"
                });
            } else {
                await Brand.create({ BrandName, BrandImage });
                const allBrands = await Brand.find();

                res.json({
                    message: "Brand Created",
                    brands: allBrands
                });
            }
        } catch (error) {
            res.status(400).json({
                message: error.message
            });
        }
    }
};


//=============Get brand by name==========//

const getBrandByName = async (req, res) => {
    const { BrandName } = req.params;
    try {
        await connect(process.env.MONGO_URL);

        const brand = await Brand.findOne({ BrandName });

        if (!brand) {
            return res.status(404).json({
                message: 'Brand not found',
            });
        }

        res.json({ brand });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};

//=============Get brand by id==========//

const getBrandById = async (req, res) => {
    const { _id } = req.params;
    try {
        await connect(process.env.MONGO_URL);

        const brand = await Brand.findOne({ _id });

        if (!brand) {
            return res.status(404).json({
                message: 'Brand not found',
            });
        }

        res.json({ brand });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};

//=============Update brand==========//

const updateBrand = async (req, res) => {
    const { _id, BrandName, BrandImage } = req.body;
    const filter = { _id };
    const update = { BrandName, BrandImage };
    try {
        await connect(process.env.MONGO_URL);

        await Brand.findOneAndUpdate(filter, update, {
            new: true,
        });

        const brands = await Brand.find();

        res.json({
            message: "Brand updated successfully",
            brands,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};

//=============Delete brand==========//

const deleteBrand = async (req, res) => {
    const { _id } = req.body;
    try {
        await connect(process.env.MONGO_URL);
        await Brand.findByIdAndDelete({ _id });
        const brands = await Brand.find();

        res.status(200).json({
            message: "Brand deleted successfully",
            brands,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};

module.exports = { getAllBrands, createBrand, getBrandByName, getBrandById, updateBrand, deleteBrand };
