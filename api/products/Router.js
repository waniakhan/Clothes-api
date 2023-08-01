const express = require('express');
const router = express.Router();
const { createProduct, getProductByBrand, getProductByCategory, updateProduct, deleteProduct, getAllProducts } = require('./controller');

router.post('/create-product', createProduct);
router.get('/get-product-by-brand', getProductByBrand);
router.get('/get-product-by-category', getProductByCategory);
router.put('/update-product', updateProduct);
router.delete('/delete-product', deleteProduct);
router.get('/get-all-products', getAllProducts);

module.exports = router;
