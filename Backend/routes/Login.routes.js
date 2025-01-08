const express = require('express'); // Import the Express library for handling HTTP requests
require('dotenv').config(); // Load environment variables from .env file

// Create a new Express Router for handling login requests
const LoginRouter = express.Router();

// Route to handle login requests
LoginRouter.post('/', async (req, res) => {
    // Extract email and password from the request body
    const { email, password } = req.body;
    try {
        // Check if the provided email and password match the environment variables
        if (email === process.env.email && password === process.env.password) {
            // If they match, send a success response
            res.send({
                message: "Login Successful",
                status: 1
            });
        } else {
            // If they don't match, send a failure response
            res.send({
                message: "Login Failed",
                status: 0
            });
        }
    } catch (error) {
        // Log any errors and send a generic error response
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'An error occurred during login' });
    }
});

// Export the LoginRouter for use in other parts of the application
module.exports = {
    LoginRouter
};
