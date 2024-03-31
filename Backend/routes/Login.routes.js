const express = require('express');
require('dotenv').config();
const LoginRouter = express.Router();



LoginRouter.post('/', async (req, res) => {
    const { email, password } = req.body;
    try {
        if (email === process.env.email && password === process.env.password) {
            res.send({
                message: "Login Succesful",
                status: 1
            })
        }
        else {
            res.send({
                message: "Login Failed",
                status: 0
            })
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'An error occurred during login' });
    }
});

module.exports = {
    LoginRouter
};