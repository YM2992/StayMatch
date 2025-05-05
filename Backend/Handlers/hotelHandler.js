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
    const { name, location, price, currency, rating, room_type, beds, breakfast, free_cancellation, no_prepayment } = filters;

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
        params.push({ name: 'price', type: 'float', value: price });
    }
    if (currency) {
        filterConditions.push('currency = @currency');
        params.push({ name: 'currency', type: 'varchar', value: currency });
    }
    if (rating) {
        const ratingMappings = {
            "1 Stars": 0,
            "2 Stars": 2,
            "3 Stars": 4,
            "4 Stars": 6,
            "5 Stars": 8
        };

        const ratingValue = ratingMappings[rating];
        if (ratingValue) {
            filterConditions.push('rating >= @ratingValue');
            params.push({ name: 'ratingValue', type: 'float', value: ratingValue });
        }
    }
    if (room_type) {
        filterConditions.push('room_type = @room_type');
        params.push({ name: 'room_type', type: 'varchar', value: room_type });
    }
    if (beds) {
        filterConditions.push('beds >= @beds');
        params.push({ name: 'beds', type: 'varchar', value: beds });
    }
    if (breakfast != null) {
        filterConditions.push('breakfast = @breakfast');
        params.push({ name: 'breakfast', type: 'bit', value: breakfast });
    }
    if (free_cancellation != null) {
        filterConditions.push('free_cancellation = @free_cancellation');
        params.push({ name: 'free_cancellation', type: 'bit', value: free_cancellation });
    }
    if (no_prepayment != null) {
        filterConditions.push('no_prepayment = @no_prepayment');
        params.push({ name: 'no_prepayment', type: 'bit', value: no_prepayment });
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

hotelHandler.getFilters = async function() {
    const query = `
        SELECT DISTINCT location, currency, room_type, beds 
        FROM [dbo].[Hotel]
    `;

    try {
        const result = await executeQuery(query);

        const locations = [...new Set(result.map(hotel => hotel.location))];
        const currencies = [...new Set(result.map(hotel => hotel.currency))];
        const room_types = [...new Set(result.map(hotel => hotel.room_type))];
        const beds = [...new Set(result.map(hotel => hotel.beds))];

        const filters = {
            locations,
            currencies,
            room_types,
            beds
        };

        return filters;
    } catch (err) {
        console.error('Error fetching hotel filters:', err);
        throw err;
    }
}


module.exports = hotelHandler;