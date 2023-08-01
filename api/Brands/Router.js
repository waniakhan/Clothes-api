const express = require('express');
const router = express.Router();
const { createBrand, getBrandByName, getBrandById, updateBrand, deleteBrand, getAllBrands } = require('./controller');


router.get('/get-all-brands',getAllBrands );
router.post('/create-brand', createBrand);
router.get('/get-brand-by-name/:BrandName', getBrandByName);
router.get('/get-brand-by-id/:_id', getBrandById);
router.put('/update-brand', updateBrand);
router.delete('/delete-brand', deleteBrand);

module.exports = router;