const app = require('express')
const router = app.Router()
const { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } = require('./Controller')

router.get('/get-all-categories', getAllCategories )
router.get('/get-categories-by-id/:_id', getCategoryById )
router.post('/create-category', createCategory )
router.put('/update-category', updateCategory )
router.delete('/delete-category', deleteCategory )

module.exports = router