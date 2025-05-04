import userHandler from './Handlers/userHandler.js';
import hotelHandler from './Handlers/hotelHandler.js';

const apiPath = '/api';
const routes = [
    /* User */
    {
        path: `${apiPath}/user/register`,
        method: 'post',
        handler: async (req, res) => {
            const { name, email, password, securityQuestion, securityAnswer } = req.body;

            if (!name || !email || !password || !securityQuestion || !securityAnswer) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            try {
                const userId = await userHandler.registerUser(name, email, password, securityQuestion, securityAnswer);
                return res.status(201).json({ message: 'User registered successfully', userId });
            } catch (error) {
                console.error('Registration error:', error);
                return res.status(500).json({ error: error.message || 'An error occurred during registration' });
            }
        }
    },
    {
        path: `${apiPath}/user/login`,
        method: 'post',
        handler: async (req, res) => {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }

            try {
                // Replace with actual authentication logic
                const user = await userHandler.authenticateUser(email, password);

                if (!user) {
                    return res.status(401).json({ error: 'Invalid credentials' });
                }

                return res.status(200).json({ message: 'Login successful', user });
            } catch (error) {
                return res.status(500).json({ error: error.message || 'An error occurred during login' });
            }
        }
    },
    {
        path: `${apiPath}/user/update`,
        method: 'put',
        handler: async (req, res) => {
            const { userId, updatedFields } = req.body;

            if (!userId || !updatedFields) {
                return res.status(400).json({ error: 'User ID and updated fields are required' });
            }

            try {
                await updateUser(userId, updatedFields);
                return res.status(200).json({ message: 'User updated successfully' });
            } catch (error) {
                return res.status(500).json({ error: error.message || 'An error occurred during user update' });
            }
        }
    },
    {
        path: `${apiPath}/user/forgot-password`,
        method: 'post',
        handler: async (req, res) => {
            const { email, newPassword, securityQuestion, securityAnswer } = req.body;

            if (!email || !newPassword || !securityQuestion || !securityAnswer) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            try {
                // Replace with actual logic to reset password
                await userHandler.resetPassword(email, newPassword, securityQuestion, securityAnswer);
                return res.status(200).json({ message: 'Password reset successfully' });
            } catch (error) {
                return res.status(500).json({ error: error.message || 'An error occurred during password reset' });
            }
        }
    },
    

    /* Hotels */
    {
        path: `${apiPath}/hotels`,
        method: 'get',
        handler: async (req, res) => {
            const { name, location, price, beds, room_type, rating } = req.query;
            console.log(req.query)

            try {
                const filters = {};
                if (name) filters.name = name;
                if (location) filters.location = location
                if (price) filters.price = price;
                if (beds) filters.beds = beds;
                if (room_type) filters.room_type = room_type;
                if (rating) filters.rating = rating;

                const hotels = await hotelHandler.getHotels(filters);

                return res.status(200).json({ hotels });
            } catch (error) {
                return res.status(500).json({ error: error.message || 'An error occurred while fetching hotels' });
            }
        }
    }
];

export default routes;