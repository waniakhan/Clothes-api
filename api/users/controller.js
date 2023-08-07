require('dotenv').config()
const user = require('./model')
const { connect } = require('mongoose')
const { hash, compare } = require('bcryptjs')
const { sign } = require('jsonwebtoken')


//=========== signup ========//

const signup = async (req, res) => {
    const { username, password, email, profilePic } = req.body

    try {

        await connect(process.env.MONGO_URL)
        // console.log("DB CONNECTED")

        const checkExist = await user.exists({ email: email })

        if (checkExist) {
            res.status(208).json({
                message: "User Already Exist"
            })
        }
        else {
            // Hash the password before storing it in the database
            const hashedPassword = await hash(password, 12);

            // Create the user with encrypted password, default role, and profile pic (if provided)
            await user.create({
                username,
                email,
                password: hashedPassword,
                role: "user", // You can set the role here, or use the default role from the schema
                profilePic: profilePic || "https://media.istockphoto.com/id/1210939712/vector/user-icon-people-icon-isolated-on-white-background-vector-illustration.jpg?s=612x612&w=0&k=20&c=vKDH9j7PPMN-AiUX8vsKlmOonwx7wjqdKiLge7PX1ZQ=" // Default profile pic URL if not provided

            });

            res.status(201).json({
                message: "Done"
            });
        }
    }
    catch (error) {
        res.json({
            message: "error"
        })
    }
}

//=========== login ========//

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        await connect(process.env.MONGO_URL)
        const existingUser = await user.findOne({ email: email });
        
        if (!existingUser) {
            res.status(404).json({
                message: "User not found"
            });
        } else {
            const decryptPassword = await compare(password, existingUser.password);
            
            if (email == existingUser.email && decryptPassword) {
                const token = sign(
                    {
                        id: existingUser._id,
                        username: existingUser.username,
                        email: existingUser.email,
                        profilePic: existingUser. profilePic,
                        role: existingUser.role
                    },
                    process.env.JWT_SECRET
                );

                res.status(200).json({
                    message: "Successfully Logged in",
                    token: token
                });
            } else {
                res.json({
                    message: "Invalid Credentials"
                });
            }
        }
    } catch (error) {
        res.json({
            message: error.message
        });
    }
};


//===========all users ========//

const allUsers = async (req, res) => {
    try {
        await connect(process.env.MONGO_URL)

        const Users = await user.find()
        res.json(
            {
                Users: Users
            }
        )

    }

    catch (error) {
        res.json(
            {
                message: error.message
            }
        )

    }
}

//===========user by email========//

const userbyEmail = async (req, res) => {

    const { email } = req.params


    try {
        await connect(process.env.MONGO_URL)
        const Users = await user.findOne({ email: email })
        res.json(
            {
                Users: Users
            }
        )

    }

    catch (error) {
        res.json(
            {
                message: error.message
            }
        )

    }
}

//===============user by ID=======//

const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        await connect(process.env.MONGO_URL);
        const userById = await user.findById(id);

        if (!userById) {
            res.status(404).json({
                message: "User not found",
            });
        } else {
            res.status(200).json({
                User: userById,
            });
        }
    } catch (error) {
        res.json({
            message: error.message,
        });
    }
};

//===============Delete user=======//

const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        await connect(process.env.MONGO_URL);
        const deletedUser = await user.findByIdAndDelete(id);

        if (!deletedUser) {
            res.status(404).json({
                message: "user not found"
            })
        }
        else {
            res.status(200).json({
                message: "user deleted successfully",
                User: deletedUser
            })
        }

    } catch (error) {
        res.json({
            message: error.message,
        });
    }

}

//===============update username and profile pic=======//

const updateUser = async (req, res) => {
    const { id } = req.params
    const {username, profilePic } = req.body

    try {
        await connect(process.env.MONGO_URL);

        const userToUpdate = await user.findById(id)

        if(!userToUpdate){
            res.status(404).json({
                message: "user not found"
            })
        }
        else{
            if (username) {
                userToUpdate.username = username
            }
            if(profilePic){
                userToUpdate.profilePic = profilePic
            }
        }
        await userToUpdate.save()

        res.status(200).json({
            message: "user updated successfully",
            User: userToUpdate
        })
    } catch (error) {
        res.json({
            message: error.message,
        })
    }
}


module.exports = { signup, login, allUsers, userbyEmail, getUserById, deleteUser, updateUser }