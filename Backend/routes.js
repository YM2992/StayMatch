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
            const { branch_name, address, price, room_count, bed_count, amenities } = req.query;

            try {
                // Build a filter object based on provided query parameters
                const filters = {};
                if (branch_name) filters.branch_name = branch_name;
                if (address) filters.address = address;
                if (price) filters.price = price;
                if (room_count) filters.room_count = room_count;
                if (bed_count) filters.bed_count = bed_count;
                if (amenities) filters.amenities = amenities;

                // Replace with actual logic to fetch hotels based on filters
                const hotels = await hotelHandler.getHotels(filters);

                return res.status(200).json({ hotels });
            } catch (error) {
                return res.status(500).json({ error: error.message || 'An error occurred while fetching hotels' });
            }
        }
    }
];

export default routes;