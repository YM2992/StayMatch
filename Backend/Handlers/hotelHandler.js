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
    const { name, location, min_price, max_price, currency, rating, room_type, beds, breakfast, free_cancellation, no_prepayment } = filters;

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
    if (min_price) {
        filterConditions.push('price >= @min_price');
        params.push({ name: 'min_price', type: 'int', value: parseInt(min_price) });
    }
    if (max_price) {
        filterConditions.push('price <= @max_price');
        params.push({ name: 'max_price', type: 'int', value: parseInt(max_price) });
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
        const roomTypes = room_type.split(',').map(rt => rt.trim());
        filterConditions.push(`room_type IN (${roomTypes.map((_, i) => `@room_type${i}`).join(', ')})`);
        roomTypes.forEach((rt, i) => {
            params.push({ name: `room_type${i}`, type: 'varchar', value: rt });
        });
    }
    if (beds) {
        const bedsValues = beds.split(',').map(b => b.trim());
        filterConditions.push(`beds IN (${bedsValues.map((_, i) => `@beds${i}`).join(', ')})`);
        bedsValues.forEach((b, i) => {
            params.push({ name: `beds${i}`, type: 'varchar', value: b });
        });
    }
    if (breakfast != null) {
        const breakfastValues = breakfast.split(',').map(b => b.trim());
        filterConditions.push(`breakfast IN (${breakfastValues.map((_, i) => `@breakfast${i}`).join(', ')})`);
        breakfastValues.forEach((b, i) => {
            params.push({ name: `breakfast${i}`, type: 'bit', value: b === 'true' });
        });
    }
    if (free_cancellation != null) {
        const freeCancellationValues = free_cancellation.split(',').map(fc => fc.trim());
        filterConditions.push(`free_cancellation IN (${freeCancellationValues.map((_, i) => `@free_cancellation${i}`).join(', ')})`);
        freeCancellationValues.forEach((fc, i) => {
            params.push({ name: `free_cancellation${i}`, type: 'bit', value: fc === 'true' });
        });
    }
    if (no_prepayment != null) {
        const noPrepaymentValues = no_prepayment.split(',').map(np => np.trim());
        filterConditions.push(`no_prepayment IN (${noPrepaymentValues.map((_, i) => `@no_prepayment${i}`).join(', ')})`);
        noPrepaymentValues.forEach((np, i) => {
            params.push({ name: `no_prepayment${i}`, type: 'bit', value: np === 'true' });
        });
    }

    if (filterConditions.length === 0) {
        return await executeQuery('SELECT * FROM [dbo].[Hotel]');
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