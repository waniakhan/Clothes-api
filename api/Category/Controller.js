const Category = require('./Model');

const { connect } = require('mongoose')
require('dotenv').config()


//=============All Categories==========//
const getAllCategories = async (req, res) => {
    try {
        await connect(process.env.MONGO_URL)

        const allCategories = await Category.find()

        res.json({
            category: allCategories
        })

    }
    catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}

//=============Category by name==========//
const getCategoryByName = async (req, res) => {
    const { CategoryName } = req.params;
    try {
      await connect(process.env.MONGO_URL);
  
      const category = await Category.findOne({ CategoryName });
  
      if (!category) {
        return res.status(404).json({
          message: 'Category not found',
        });
      }
  
      res.json({ category });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  };
//=============Category by id==========//
const getCategoryById = async (req, res) => {
    const { _id } = req.params
    try {
        await connect(process.env.MONGO_URL)

        const category = await Category.findOne({ _id })

        res.json({ category })

    }
    catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}

//=============Create category==========//
const createCategory = async (req, res) => {
    const { CategoryName, CategoryImage } = req.body

    if (!CategoryName || !CategoryImage) {
        res.status(403).json({
            message: "Missing Required Field"
        })
    }

    else {
        try {
            await connect(process.env.MONGO_URL)
            const checkExisting = await Category.exists({ CategoryName })

            if (checkExisting) {
                res.status(400).json({
                    message: "Category Already Exists"
                })
            }

            else {
                await Category.create({ CategoryName, CategoryImage })
                const allCategories = await Category.find()

                res.json({
                    message: "DB Connected",
                    category: allCategories
                })

            }
        }
        catch (error) {
            res.status(400).json({
                message: error.message
            })
        }
    }
}

//=============Update category==========//
const updateCategory = async (req, res) => {

    const { _id, CategoryName, CategoryImage } = req.body
    const filter = { _id };
    const update = { CategoryName, CategoryImage };
    try {
        await connect(process.env.MONGO_URL)

     await Category.findOneAndUpdate(filter, update, {
            new: true
        });

        const category = await Category.find()

        res.json({
            message: "Success",
            category
        })

    }



    catch (error) {
        res.status(400).json({
            message: error.message
        })

    }
}

//=============Delete category==========//
const deleteCategory = async (req, res) => {
    const { _id } = req.body
    try {
        await connect(process.env.MONGO_URL)
        await Category.findByIdAndDelete({ _id })
        const category = await Category.find()

        res.status(200).json({
            message: "deleted Successfully",
            category
        })

    }
    catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
}

module.exports = { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory, getCategoryByName }