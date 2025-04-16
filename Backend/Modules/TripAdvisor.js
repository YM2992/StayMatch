const axios = require('axios');
const Util = require('./Util');

class TripAdvisorAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.content.tripadvisor.com/api/v1/location';
    }

    async getLocationDetails(
        placeId,
        language = 'en',
        currency = ''
    ) {
        try {
            const response = await axios.get(`${this.baseUrl}/${placeId}/details`, {
                headers: {
                    Accept: 'application/json',
                },
                params: {
                    key: this.apiKey,
                    language: language,
                    currency: currency
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching place details:', error.message);
            throw error;
        }
    }

    async searchLocation(
        searchQuery,
        category = 'hotels',
        phone = '',
        address = '',
        latLong = '',
        radius = 1,
        radiusUnit = 'km',
        language = 'en'
    ) {
        const validUnits = ['km', 'mi', 'm'];
        if (!validUnits.includes(radiusUnit)) {
            throw new Error('Radius unit must be one of the following: km, mi, or m');
        }

        if (radius <= 0) {
            throw new Error('Radius must be a number greater than 0');
        }

        try {
            const response = await axios.get(`${this.baseUrl}/search`, {
                headers: {
                    Accept: 'application/json',
                },
                params: {
                    key: this.apiKey,
                    searchQuery: searchQuery,
                    category: category,
                    phone: phone,
                    address: address,
                    latLong: latLong,
                    radius: radius,
                    radiusUnit: radiusUnit,
                    language: language
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error searching places:', error.message);
            throw error;
        }
    }

    async downloadTripAdvisorData(uploadDir) {
        try {
            const searchResults = await this.searchLocation("Jeddah");
            if (searchResults.data && searchResults.data.length > 0) {
            const locationDetails = await this.getLocationDetails(searchResults.data[0].location_id);

            const csvOptions = {
                header: true,
                delimiter: ',',
                quote: '"',
                eol: '\n',
                columns: [
                'location_id',
                'name',
                'address_obj.street1',
                'address_obj.street2',
                'address_obj.city',
                'address_obj.state',
                'address_obj.country'
                ]
            };

            await Util.jsonToCsvFile(locationDetails, `${uploadDir}/tripAdvisor.csv`, csvOptions);
            console.log('CSV file created successfully');
            } else {
            console.log('No search results found for the given query.');
            }
        } catch (error) {
            console.error('Error downloading TripAdvisor data:', error.message);
        }
    }
}

module.exports = TripAdvisorAPI;