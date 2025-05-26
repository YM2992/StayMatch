import userHandler from './Handlers/userHandler.js';
import hotelHandler from './Handlers/hotelHandler.js';
import preferenceHandler from './Handlers/preferenceHandler.js';
import axios from 'axios';
import * as cheerio from 'cheerio';

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
                const user = await userHandler.loginUser(email, password);

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
            const { return_keys, Hotel_ID, name, location, min_price, max_price, currency, rating, room_type, beds, breakfast, free_cancellation, no_prepayment } = req.query;
            console.log(req.query)

            try {
                const filters = {};
                if (return_keys) filters.return_keys = return_keys;
                if (Hotel_ID) filters.Hotel_ID = Hotel_ID;
                if (name) filters.name = name;
                if (location) filters.location = location;
                if (min_price) filters.min_price = min_price;
                if (max_price) filters.max_price = max_price;
                if (currency) filters.currency = currency;
                if (rating) filters.rating = rating;
                if (room_type) filters.room_type = room_type;
                if (beds) filters.beds = beds;
                if (breakfast != null) filters.breakfast = breakfast;
                if (free_cancellation != null) filters.free_cancellation = free_cancellation;
                if (no_prepayment != null) filters.no_prepayment = no_prepayment;

                const hotels = await hotelHandler.getHotels(filters);

                return res.status(200).json({ hotels });
            } catch (error) {
                console.error('Error fetching hotels:', error);
                return res.status(500).json({ error: error.message || 'An error occurred while fetching hotels' });
            }
        }
    },

    {
        path: `${apiPath}/hotels/getFilters`,
        method: 'get',
        handler: async (req, res) => {
            console.log('Fetching filters...');
            try {
                const filters = await hotelHandler.getFilters();
                return res.status(200).json({ filters });
            } catch (error) {
                return res.status(500).json({ error: error.message || 'An error occurred while fetching filters' });
            }
        }
    },
    {
        path: `${apiPath}/hotels/getImages`,
        method: 'get',
        handler: async (req, res) => {
            try {
                const response = await axios.get(`https://www.google.com/search?q=Hotel%20Jeddah&tbm=isch`);
                const html = response.data;
                const $ = cheerio.load(html);
                const imageElements = $('img');
                const imageUrls = [];

                imageElements.each((index, element) => {
                    const imageUrl = $(element).attr('src') || $(element).attr('data-src');
                    if (imageUrl && imageUrl.startsWith('http')) {
                        imageUrls.push(imageUrl);
                    }
                });

                return res.status(200).json({ data: imageUrls });
            } catch (error) {
                console.error('Error fetching images:', error);
                return res.status(500).json({ error: error.message || 'An error occurred while fetching images' });
            }
        }
    },

    /* Preferences */
    {
        path: `${apiPath}/preferences/get`,
        method: 'post',
        handler: async (req, res) => {
            const { user } = req.body;

            if (!user) {
                return res.status(400).json({ error: 'User is required' });
            }

            try {
                const preferences = await preferenceHandler.getPreferences(user);
                return res.status(200).json({ preferences });
            } catch (error) {
                console.error('Error fetching preferences:', error);
                return res.status(500).json({ error: error.message || 'An error occurred while fetching preferences' });
            }
        }
    },
    {
        path: `${apiPath}/preferences/add`,
        method: 'post',
        handler: async (req, res) => {
            const { user, hotelId } = req.body;

            if (!user || !hotelId) {
                return res.status(400).json({ error: 'User and hotel ID are required' });
            }

            try {
                await preferenceHandler.addPreference(user, hotelId);
                return res.status(200).json({ message: 'Preference added successfully' });
            } catch (error) {
                console.error('Error adding preference:', error);
                return res.status(500).json({ error: error.message || 'An error occurred while adding preference' });
            }
        }
    },
    {
        path: `${apiPath}/preferences/remove`,
        method: 'post',
        handler: async (req, res) => {
            const { user, hotelId } = req.body;

            if (!user || !hotelId) {
                return res.status(400).json({ error: 'User and hotel ID are required' });
            }

            try {
                await preferenceHandler.removePreference(user, hotelId);
                return res.status(200).json({ message: 'Preference removed successfully' });
            } catch (error) {
                console.error('Error removing preference:', error);
                return res.status(500).json({ error: error.message || 'An error occurred while removing preference' });
            }
        }
    }
];

export default routes;