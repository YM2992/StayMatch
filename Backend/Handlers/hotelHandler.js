const { executeQuery } = require('../Modules/Azure');
let hotelHandler = {};


hotelHandler.getHotels = async function(filters) {
    const { branch_name, address, price, room_count, bed_count, amenities } = filters;

    // Build a filter object based on provided query parameters
    const filterConditions = [];
    const params = [];

    if (branch_name) {
        filterConditions.push('branch_name = @branch_name');
        params.push({ name: 'branch_name', type: 'varchar', value: branch_name });
    }
    if (address) {
        filterConditions.push('address = @address');
        params.push({ name: 'address', type: 'varchar', value: address });
    }
    if (price) {
        filterConditions.push('price <= @price');
        params.push({ name: 'price', type: 'int', value: price });
    }
    if (room_count) {
        filterConditions.push('room_count >= @room_count');
        params.push({ name: 'room_count', type: 'int', value: room_count });
    }
    if (bed_count) {
        filterConditions.push('bed_count >= @bed_count');
        params.push({ name: 'bed_count', type: 'int', value: bed_count });
    }
    if (amenities) {
        const amenitiesArray = amenities.split(',');
        for (let i = 0; i < amenitiesArray.length; i++) {
            filterConditions.push(`FIND_IN_SET(@amenity${i}, amenities)`);
            params.push({ name: `amenity${i}`, type: 'varchar', value: amenitiesArray[i] });
        }
    }

    const query = `
        SELECT * 
        FROM Hotels 
        WHERE ${filterConditions.join(' AND ')}
    `;

    try {
        const result = await executeQuery(query, params);
        return result.recordset;
    } catch (err) {
        console.error('Error fetching hotels:', err);
        throw err;
    }
}


module.exports = hotelHandler;