const { Schema, model } = require('mongoose')

const OrdersSchema = new Schema(
    {
        items: {
            type: Array,
            required: true
        }, 
        totalBill:{
            type: String,
            required: true

        },
         customerAddress:{
            type:  String,
            required: true

         }, 
         customerContact:{
            type:  String,
            required: true

         }, customerName:{
            type:  String,
            required: true

         }, 
         customerEmail:{
            type: String,
            required: true

         },
         order_at: {
            type: Date,
            default: Date.now
         }
    }
)

const Orders = model('order', OrdersSchema)
module.exports = Orders