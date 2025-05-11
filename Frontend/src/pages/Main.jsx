import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchIcon, Star, StarIcon } from "lucide-react";


import jeddahImg from "../assets/jeddah.jpg";
import meccaImg from "../assets/mecca.webp";
import medinaImg from "../assets/medina.jpg";
import riyadhImg from "../assets/riyadh.jpg";
import taifImg from "../assets/taif.jpg";
import hotelone from "../assets/one.jpg";
import hoteltwo from "../assets/two.jpeg";
import hotelthree from "../assets/three.webp";
import hotelfour from "../assets/four.jpg";
import api from "../api";
import toast from "react-hot-toast";
import { useAppContext } from "../context/Context";

import hotel1 from "../assets/Hotels/hotel1.jpg";
import hotel2 from "../assets/Hotels/hotel2.jpg";
import hotel3 from "../assets/Hotels/hotel3.webp";
import hotel4 from "../assets/Hotels/hotel4.jpg";
import hotel5 from "../assets/Hotels/hotel5.jpg";
import hotel6 from "../assets/Hotels/hotel6.jpg";
import hotel7 from "../assets/Hotels/hotel7.jpg";
import hotel8 from "../assets/Hotels/hotel8.jpg";
import hotel9 from "../assets/Hotels/hotel9.jpg";
import hotel10 from "../assets/Hotels/hotel10.jpg";


const hotelImages = [
  hotelone,
  hoteltwo,
  hotelthree,
  hotelfour,
  hotel1,
  hotel2,
  hotel3,
  hotel4,
  hotel5,
  hotel6,
  hotel7,
  hotel8,
  hotel9,
  hotel10,
];

const filterRenames = {
  "Location": "location",
  "Min Price": "min_price",
  "Max Price": "max_price",
  "Money Currency": "currency",
  "Rating": "rating",
  "Room Type": "room_type",
  "Bed Info": "beds",
  "Breakfast Included": "breakfast",
  "Free Cancellation": "free_cancellation",
  "No Prepayment": "no_prepayment",
};
const reverseFilterRenames = Object.fromEntries(
  Object.entries(filterRenames).map(([key, value]) => [value, key])
);

function Main() {
  const { preferences, updatePreferences } = useAppContext();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const reverseRenamedFilterKey = (filterKey) => {
    return reverseFilterRenames[filterKey] || filterKey;
  };

  const reverseRenamedFilterValue = (filterValue) => {
    filterValue = filterValue.toString().split(",").map(item => {
      item = item.trim();
      if (item === "true") return "Yes";
      if (item === "false") return "No";
      if (item === "breakfast") return "Breakfast Included";
      if (item === "free_cancellation") return "Free Cancellation";
      return item;
    });
    return filterValue.join(", ");
  };

  const fetchHotels = async () => {
    try {
      const filters = api.getParamsFromURL();

      if (!filters) throw new Error("No filters found");

      setFilters(filters);

      const cache = localStorage.getItem("cachedHotels");
      if (cache) {
        console.log("CachedHotels found");
        const cacheJSON = JSON.parse(cache);
        const cachedTime = cacheJSON.fetchedTime;

        const currentTime = new Date().getTime();
        const cachedTimeInMs = new Date(cachedTime).getTime();
        const timeDiff = currentTime - cachedTimeInMs;
        console.log("Time difference:", timeDiff);

        if (timeDiff > 1000 * 60 * 60) { // 1 hour
          localStorage.removeItem("cachedHotels");
        } else {
          if (JSON.stringify(cacheJSON.filters) === JSON.stringify(filters)) {
            console.log("Using cached hotels data");
            return cacheJSON.hotels;
          } else {
            console.log("Cached data is not valid for the current filters. Fetching from API.");
          }
        }
      }

      
      console.log("No timely cached data found. Fetching hotels from API");

      const response = await api.httpGet(api.paths.getHotels, filters);
      if (!response || response.status !== 200) throw new Error("Failed to fetch hotels");
      const hotels = response.data.hotels;
      if (!hotels) throw new Error("No hotels found");

      const searchedHotelImages = await api.httpGet(api.paths.getHotelImages);
      const hotelImageUrls = (searchedHotelImages && searchedHotelImages.data) || [];
      hotels.forEach((hotel) => {
        hotel.image =
          hotel.image ||
          hotelImageUrls.data[Math.floor(Math.random() * hotelImageUrls.data.length)] ||
          hotelImages[Math.floor(Math.random() * hotelImages.length)];
      });

      const fetchedTime = new Date().toUTCString();
      localStorage.setItem("cachedHotels", JSON.stringify({ fetchedTime, filters, hotels }));
      return hotels;
    } catch (error) {
      console.error("Error fetching hotels:", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const fetchAndSetHotels = async () => {
      try {
        const response = await fetchHotels();
        if (response) {
          console.log(response);
          setSearchResults(response);
        }
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    };

    fetchAndSetHotels();
  }, []);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );

    const updatedPreferences = !preferences || preferences.length === 0
      ? [id]
      : preferences.includes(id)
      ? preferences.filter((favId) => favId !== id)
      : [...preferences, id];
    
    updatePreferences(updatedPreferences);
  };

  useEffect(() => {
    const storedFavorites = preferences || [];
    setFavorites(storedFavorites);
  }, [preferences]);

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
            {
              Object.entries(filters).map(([key, value]) => (
                <div key={key}>
                  <p className="text-gray-500">{reverseRenamedFilterKey(key)}</p>
                  <p className="text-black">{reverseRenamedFilterValue(value)}</p>
                </div>
              ))
            }

            <button
              className="col-span-1 md:col-span-auto px-4 py-2 rounded-full flex items-center justify-center transition-transform bg-[#b0cde5] hover:bg-[#99bbdb] text-white hover:scale-105"
              onClick={() => navigate(`/filter${window.location.search}`)}
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
                  key={stay.Hotel_ID}
                  href={stay.link || `https://www.google.com/search?q=${encodeURIComponent(stay.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex bg-white rounded-xl shadow overflow-hidden relative hover:scale-[1.01] transition-transform"
                >
                  <div
                    className="absolute top-2 right-2 cursor-pointer z-10"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(stay.Hotel_ID);
                    }}
                  >
                    {favorites.includes(stay.Hotel_ID) ? (
                      <StarIcon className="text-yellow-400 fill-current" />
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
                            {stay.originalPrice} {stay.currency}
                          </span>
                        )}
                        <p className="text-lg font-bold text-[#1c1c2b]">
                          {stay.price} {stay.currency}
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
              ))};
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
