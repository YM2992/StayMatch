import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchIcon, Star, StarIcon } from "lucide-react"; // Star = outline, StarIcon = filled

import jeddahImg from "../assets/jeddah.jpg";
import meccaImg from "../assets/mecca.webp";
import medinaImg from "../assets/medina.jpg";
import riyadhImg from "../assets/riyadh.jpg";
import taifImg from "../assets/taif.jpg";
import hotelone from "../assets/one.jpg";
import hoteltwo from "../assets/two.jpeg";
import hotelthree from "../assets/three.webp";
import hotelfour from "../assets/four.jpg";

function Main() {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const mockData = {
    destination: "Mecca",
    checkIn: "2025-06-01",
    checkOut: "2025-06-05",
    adults: 2,
    children: 1,
    rooms: 1,
    priceRange: "2000 - 5000 SAR",
    currency: "SAR",
    rating: "8+",
    roomType: "Deluxe Suite",
    bedInfo: "1 King Bed + 1 Sofa Bed",
    breakfastIncluded: true,
    freeCancellation: true,
    noPrepayment: true,
  };

  const handleSearch = () => {
    const mockResults = [
      {
        id: 1,
        name: "Red Sea Horizon Hotel",
        location: "Corniche Road, Jeddah",
        rating: 8.1,
        ratingText: "Very Good",
        reviews: 745,
        price: 4200,
        originalPrice: 5890,
        nights: `4 nights, ${mockData.adults} adults`,
        image: hotelone,
        link: "https://papertoilet.com/",
      },
      {
        id: 2,
        name: "Palm Gate Suites",
        location: "Al Zahra District, Jeddah",
        rating: 9.3,
        ratingText: "Superb",
        reviews: 1102,
        price: 3550,
        originalPrice: null,
        nights: `4 nights, ${mockData.adults} adults`,
        image: hoteltwo,
        link: "https://papertoilet.com/",
      },
      {
        id: 3,
        name: "Bayfront Breeze Hotel",
        location: "North Obhur, Jeddah",
        rating: 7.8,
        ratingText: "Good",
        reviews: 398,
        price: 2800,
        originalPrice: 3590,
        nights: `4 nights, ${mockData.adults} adults`,
        image: hotelthree,
        link: "https://papertoilet.com/",
      },
      {
        id: 4,
        name: "Golden Palm Inn",
        location: "Al Andalus, Jeddah",
        rating: 8.6,
        ratingText: "Fabulous",
        reviews: 612,
        price: 3999,
        originalPrice: null,
        nights: `4 nights, ${mockData.adults} adults`,
        image: hotelfour,
        link: "https://papertoilet.com/",
      },
    ];
    setSearchResults(mockResults);
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3a506b] to-[#1c1c2b] flex items-center justify-center p-[5%]">
      <div className="bg-gray-100 p-8 rounded-xl shadow-md w-full">
        <header className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#1c1c2b]">StayMatch</h1>
          <div className="space-x-4">
            <button className="border border-white text-white px-4 py-2 rounded-md hover:bg-blue-100">
              Register
            </button>
            <button className="border border-white text-white px-4 py-2 rounded-md hover:bg-blue-100">
              Sign in
            </button>
          </div>
        </header>

        <main>
          <h2 className="text-3xl font-semibold text-[#1c1c2b] mb-2">
            Find your next stay
          </h2>
          <p className="text-md text-gray-700 mb-6">
            Search low prices on hotels, homes and much more...
          </p>

          <div className="bg-white text-black rounded-xl shadow p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center text-sm font-medium">
            {/* Mock filter info display */}
            <div>
              <p className="text-gray-500">Location</p>
              <p className="text-black">{mockData.destination}</p>
            </div>
            <div>
              <p className="text-gray-500">Check-in</p>
              <p className="text-black">{mockData.checkIn}</p>
            </div>
            <div>
              <p className="text-gray-500">Check-out</p>
              <p className="text-black">{mockData.checkOut}</p>
            </div>
            <div>
              <p className="text-gray-500">Guests</p>
              <p className="text-black">
                {mockData.adults} adults · {mockData.children} children ·{" "}
                {mockData.rooms} room
              </p>
            </div>
            <div>
              <p className="text-gray-500">Price Range</p>
              <p className="text-black">{mockData.priceRange}</p>
            </div>
            <div>
              <p className="text-gray-500">Currency</p>
              <p className="text-black">{mockData.currency}</p>
            </div>
            <div>
              <p className="text-gray-500">Rating</p>
              <p className="text-black">{mockData.rating}</p>
            </div>
            <div>
              <p className="text-gray-500">Room Type</p>
              <p className="text-black">{mockData.roomType}</p>
            </div>
            <div>
              <p className="text-gray-500">Bed Info</p>
              <p className="text-black">{mockData.bedInfo}</p>
            </div>
            <div>
              <p className="text-gray-500">Breakfast Included</p>
              <p className="text-black">
                {mockData.breakfastIncluded ? "Yes" : "No"}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Free Cancellation</p>
              <p className="text-black">
                {mockData.freeCancellation ? "Yes" : "No"}
              </p>
            </div>
            <div>
              <p className="text-gray-500">No Prepayment</p>
              <p className="text-black">
                {mockData.noPrepayment ? "Yes" : "No"}
              </p>
            </div>

            <button
              className="col-span-1 md:col-span-auto px-4 py-2 rounded-full flex items-center justify-center transition-transform bg-[#b0cde5] hover:bg-[#99bbdb] text-white hover:scale-105"
              onClick={() => navigate("/filter")}
            >
              <SearchIcon className="mr-2 h-4 w-4" />
              Back to Filters
            </button>
          </div>

          {/* Recommended Stays */}
          <div className="mt-12">
            <h3 className="text-2xl font-semibold text-black mb-1">
              Recommended Stays
            </h3>
            <p className="text-md text-gray-500 mb-6">
              Available stays based on your filters
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              {searchResults.map((stay) => (
                <a
                  key={stay.id}
                  href={stay.link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex bg-white rounded-xl shadow overflow-hidden relative hover:scale-[1.01] transition-transform"
                >
                  {/* Favorite Star */}
                  <div
                    className="absolute top-2 right-2 cursor-pointer z-10"
                    onClick={() => toggleFavorite(stay.id)}
                  >
                    {favorites.includes(stay.id) ? (
                      <StarIcon className="text-yellow-400" />
                    ) : (
                      <Star className="text-gray-400" />
                    )}
                  </div>

                  <img
                    src={stay.image}
                    alt={stay.name}
                    className="w-40 h-40 object-cover rounded-l-xl"
                  />
                  <div className="p-4 flex flex-col justify-between flex-grow">
                    <div>
                      <h4 className="font-semibold text-lg text-[#1c1c2b]">
                        {stay.name}
                      </h4>
                      <p className="text-sm text-gray-500">{stay.location}</p>
                      <p className="text-sm mt-1 text-gray-700">
                        {stay.nights}
                      </p>
                    </div>
                    <div className="flex justify-between items-end mt-4">
                      <div>
                        {stay.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            AUD {stay.originalPrice}
                          </span>
                        )}
                        <p className="text-lg font-bold text-[#1c1c2b]">
                          AUD {stay.price}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {stay.ratingText}
                        </p>
                        <p className="text-lg font-bold text-blue-600">
                          {stay.rating}
                        </p>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Trending Destinations */}
          <div className="mt-12">
            <h3 className="text-2xl font-semibold text-black mb-1">
              Trending destinations
            </h3>
            <p className="text-md text-gray-500 mb-6">
              Most popular choices for travellers from Saudi Arabia
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { city: "Jeddah", country: "Saudi Arabia", img: jeddahImg },
                { city: "Mecca", country: "Saudi Arabia", img: meccaImg },
                { city: "Medina", country: "Saudi Arabia", img: medinaImg },
                { city: "Riyadh", country: "Saudi Arabia", img: riyadhImg },
                { city: "Taif", country: "Saudi Arabia", img: taifImg },
              ].map(({ city, country, img }, i) => (
                <div
                  key={i}
                  className={`relative rounded-xl overflow-hidden shadow-lg border-2 ${
                    i === 0 ? "border-yellow-400" : "border-transparent"
                  } hover:scale-[1.02] transition-transform`}
                >
                  <img
                    src={img}
                    alt={city}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black/80 to-transparent w-full">
                    <h4 className="text-lg font-bold text-white">{city}</h4>
                    <p className="text-sm text-white">{country}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Main;
