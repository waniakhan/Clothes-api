const express = require('express')
const router = express.Router()
const {demoMail, addOrders, allOrders, orderbyId, removeProductByOrderId} = require ('./controller')



router.post('/send-demo-mail', demoMail)
router.post('/create-order', addOrders)
router.get('/all-orders', allOrders)
router.get('/order-by-id/:_id', orderbyId)
router.delete('/remove-product/:orderId', removeProductByOrderId);

module.exports = router