const nodemailer = require("nodemailer");
require('dotenv').config()
var Mailgen = require('mailgen');
const Orders = require('./model')
const { connect } = require('mongoose');

const demoMail = async (req, res) => {
    const { email, customerName } = req.body


    if (!email || !customerName) {
        res.status(403).json({ message: 'please give your email' })
    }


    else {
        const config = {
            service: 'gmail',
            auth: {
                // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                user: process.env.NODEMAILER_EMAIL,
                pass: process.env.NODEMAILER_PASSWORD
            }
        }

        const transporter = nodemailer.createTransport(config);

        var mailGenerator = new Mailgen({
            theme: 'default',
            product: {
                // Appears in header & footer of e-mails
                name: 'Mailgen ZM Store ',
                link: 'https://mailgen.js/'

            }
        });

        var mailGenEmail = {
            body: {
                name: customerName,
                intro: 'Welcome to ZM Store!',
                table: {
                    data: [
                        {
                            name: customerName,
                            email: email,
                            token: '1234567'
                        }
                    ]
                },
                outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
            }
        };

        const respone = {
            from: process.env.NODEMAILER_EMAIL, // sender address
            to: email, // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: mailGenerator.generate(mailGenEmail), // html body
        }

        try {
            await transporter.sendMail(respone);

            res.status(400).json({ message: 'check your email' })
        }

        catch (error) {
            res.status(500).jsn({
                error
            })
        }
    }
}

const calculateSubtotal = (items) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

const calculateTax = (subtotal) => {
    const taxRate = 0.05;
    return subtotal * taxRate;
};

const calculateTotal = (subtotal, tax) => {
    const shippingCost = 5; // Assuming shipping cost is fixed
    return subtotal + tax + shippingCost;
};

const addOrders = async (req, res) => {
    const { items, totalBill, customerAddress, customerContact, customerName, customerEmail } = req.body;

    if (!items || !totalBill || !customerAddress || !customerContact || !customerName || !customerEmail) {
        res.status(403).json({ message: 'Invalid payload' });
    } else {
        try {

            await connect(process.env.MONGO_URL);

            const subtotal = calculateSubtotal(items); // Calculate subtotal
            const tax = calculateTax(subtotal); // Calculate tax
            const totalBillValue = calculateTotal(subtotal, tax); // Calculate total bill

            const order = await Orders.create({ items, totalBill: totalBillValue, customerAddress, customerContact, customerName, customerEmail });

            //EMAIL
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.NODEMAILER_EMAIL,
                    pass: process.env.NODEMAILER_PASSWORD
                }
            });

            //MAIL GEN SETUP
            var mailGenerator = new Mailgen({
                theme: 'default',
                product: {
                    name: 'Mailgen ZM Store',
                    link: process.env.NODEMAILER_EMAIL
                }
            });

            await transporter.sendMail({
                from: process.env.NODEMAILER_EMAIL,
                to: customerEmail,
                subject: 'Your Order Details',
                text: 'Your order details',
                html: mailGenerator.generate({
                    body: {
                        name: customerName,
                        intro: 'Thank you for your order!',
                        table: {
                            data: items.map(item => ({
                                Product: item.title,
                                Price: `${item.price} €`,
                                Quantity: item.quantity,
                                Subtotal: `${item.price * item.quantity} €`,
                                Image: `<img src="${item.thumbnail}" alt="${item.title}" style="max-width:100px"/>`
                            }))
                        },
                        outro: `Your Order will be delivered at ${customerAddress}, please ensure to activate your contact number ${customerContact}. Your Total Bill is ${calculateTotal(subtotal, tax)}€.`
                    }
                })
            });

            res.status(201).json({
                message: 'Order placed successfully',
                TrackingId: order._id
            });
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

const orderbyId = async (req, res) => {
    const { _id } = req.params; // Extract _id from request parameters

    try {
        await connect(process.env.MONGO_URL);
        const order = await Orders.findOne({ _id });
        res.json({ order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const allOrders = async (req, res) => {
    try {
        await connect(process.env.MONGO_URL);
        const orders = await Orders.find(); // Find all orders
        res.json({ orders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//==============REMOVE PRODUCT BY ORDER ID===========//
const removeProductByOrderId = async (req, res) => {
    const { orderId } = req.params;

    try {
        await connect(process.env.MONGO_URL);

        // Find the product by productId
        const order = await Orders.findOne({ _id:orderId  });

        if (!order) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Remove the product
        await Orders.findByIdAndDelete(orderId);

        res.json({ message: 'order removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = { demoMail, addOrders, allOrders, orderbyId, removeProductByOrderId };



