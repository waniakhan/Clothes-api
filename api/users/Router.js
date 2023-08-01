const express = require('express')
const router = express.Router()

const { login, signup, allUsers,userbyEmail, getUserById, deleteUser, updateUser } = require('./controller')

router.post('/signup', signup)
router.post('/login', login)
router.get('/getallusers', allUsers)
router.get('/userbyemail/:email', userbyEmail);
router.get('/user/:id', getUserById);
router.delete('/user/:id', deleteUser)
router.put('/user/:id', updateUser); // Add the updateUser route



module.exports = router