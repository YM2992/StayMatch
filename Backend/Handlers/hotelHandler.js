const { executeQuery } = require('../Modules/Azure');
let hotelHandler = {};

hotelHandler.insertHotels = async function(hotelData) {
    if (!Array.isArray(hotelData)) {
        throw new Error('hotelData must be an array of hotel objects');
    }

    const values = [];
    const params = [];

    hotelData.forEach((hotel, index) => {
        const { name, location, price, beds, room_type, rating } = hotel;
        values.push(`(@name${index}, @location${index}, @price${index}, @beds${index}, @room_type${index}, @rating${index})`);
        params.push(
            { name: `name${index}`, type: 'varchar', value: name },
            { name: `location${index}`, type: 'varchar', value: location },
            { name: `price${index}`, type: 'int', value: price },
            { name: `beds${index}`, type: 'int', value: beds },
            { name: `room_type${index}`, type: 'varchar', value: room_type },
            { name: `rating${index}`, type: 'float', value: rating }
        );
    });

    const query = `
        INSERT INTO Hotel (name, location, price, beds, room_type, rating)
        VALUES ${values.join(', ')}
    `;

    try {
        await executeQuery(query, params);
        return { message: 'Hotels inserted successfully' };
    } catch (err) {
        console.error('Error inserting hotels:', err);
        throw err;
    }
}

hotelHandler.getHotels = async function(filters) {
    const { name, location, price, beds, room_type, rating } = filters;

    // Build a filter object based on provided query parameters
    const filterConditions = [];
    const params = [];

    if (name) {
        filterConditions.push('name LIKE @name');
        params.push({ name: 'name', type: 'varchar', value: `%${name}%` });
    }
    if (location) {
        filterConditions.push('location LIKE @location');
        params.push({ name: 'location', type: 'varchar', value: `%${location}%` });
    }
    if (price) {
        filterConditions.push('price <= @price');
        params.push({ name: 'price', type: 'int', value: price });
    }
    if (beds) {
        filterConditions.push('beds >= @beds');
        params.push({ name: 'beds', type: 'int', value: beds });
    }
    if (room_type) {
        filterConditions.push('room_type = @room_type');
        params.push({ name: 'room_type', type: 'varchar', value: room_type });
    }
    if (rating) {
        filterConditions.push('rating >= @rating');
        params.push({ name: 'rating', type: 'float', value: rating });
    }

    const query = `
        SELECT * 
        FROM [dbo].[Hotel] 
        WHERE ${filterConditions.join(' AND ')}
    `;

    try {
        const result = await executeQuery(query, params);
        return result;
    } catch (err) {
        console.error('Error fetching hotels:', err);
        throw err;
    }
}


module.exports = hotelHandler;