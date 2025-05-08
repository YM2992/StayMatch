const { verify } = require('jsonwebtoken');
const { executeQuery } = require('../Modules/Azure');
const userHandler = require('./userHandler');

let preferenceHandler = {};

preferenceHandler.getPreferences = async function(user) {
    const verified = await userHandler.verifyUser(user.userId, user.token);
    if (!verified) {
        throw new Error('User verification failed');
    }

    const query = `
        SELECT Hotel_ID 
        FROM Preference 
        WHERE User_ID = @userId
    `;
    const params = [
        { name: 'userId', type: 'int', value: user.userId }
    ];

    try {
        const result = await executeQuery(query, params);
        return result.map(row => row.Hotel_ID);
    } catch (err) {
        console.error('Error fetching preferences:', err);
        throw err;
    }
}

preferenceHandler.addPreference = async function(user, hotelId) {
    const verified = await userHandler.verifyUser(user.userId, user.token);
    if (!verified) {
        throw new Error('User verification failed');
    }

    const query = `
        INSERT INTO Preference (User_ID, Hotel_ID)
        VALUES (@userId, @hotelId)
    `;
    const params = [
        { name: 'userId', type: 'int', value: user.userId },
        { name: 'hotelId', type: 'int', value: hotelId }
    ];
    
    try {
        await executeQuery(query, params);
        return { message: 'Preference added successfully' };
    } catch (err) {
        console.error('Error adding preference:', err);
        throw err;
    }
}

preferenceHandler.removePreference = async function(user, hotelId) {
    const verified = await userHandler.verifyUser(user.userId, user.token);
    if (!verified) {
        throw new Error('User verification failed');
    }

    const query = `
        DELETE FROM Preference 
        WHERE User_ID = @userId AND Hotel_ID = @hotelId
    `;
    const params = [
        { name: 'userId', type: 'int', value: user.userId },
        { name: 'hotelId', type: 'int', value: hotelId }
    ];

    try {
        await executeQuery(query, params);
        return { message: 'Preference removed successfully' };
    } catch (err) {
        console.error('Error removing preference:', err);
        throw err;
    }
}

module.exports = preferenceHandler;