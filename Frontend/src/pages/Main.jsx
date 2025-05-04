import { useState } from "react";
import { CalendarIcon, SearchIcon } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jeddahImg from "../assets/jeddah.jpg";
import meccaImg from "../assets/mecca.webp";
import medinaImg from "../assets/medina.jpg";
import riyadhImg from "../assets/riyadh.jpg";
import taifImg from "../assets/taif.jpg";

function Main() {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [searchResults, setSearchResults] = useState([]);

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

          <div className="bg-white text-black rounded-xl shadow p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <div className="text-sm font-medium mb-1 text-black">
              Destination
              <input
                type="text"
                placeholder="Where are you going?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="border px-3 py-2 rounded-md w-full"
              />
            </div>

            <div className="text-sm font-medium mb-1 text-black flex flex-col">
              Check In Date
              <DatePicker
                selected={checkIn}
                onChange={(date) => setCheckIn(date)}
                className="border px-3 py-2 rounded-md w-full"
                placeholderText="Select check-in"
                dateFormat="yyyy-MM-dd"
              />
            </div>

            <div className="text-sm font-medium mb-1 text-black flex flex-col">
              Check Out Date
              <DatePicker
                selected={checkOut}
                onChange={(date) => setCheckOut(date)}
                className="border px-3 py-2 rounded-md w-full"
                placeholderText="Select check-out"
                dateFormat="yyyy-MM-dd"
                minDate={checkIn}
              />
            </div>

            <div className="text-sm font-medium mb-1 text-black">
              Guests & Rooms
              <select
                className="border rounded px-3 py-2 w-full"
                value={`${adults},${children},${rooms}`}
                onChange={(e) => {
                  const [a, c, r] = e.target.value.split(",").map(Number);
                  setAdults(a);
                  setChildren(c);
                  setRooms(r);
                }}
              >
                <option value="2,0,1">2 adults · 0 children · 1 room</option>
                <option value="1,1,1">1 adult · 1 child · 1 room</option>
                <option value="2,2,2">2 adults · 2 children · 2 rooms</option>
              </select>
            </div>

            <button
              className="col-span-1 md:col-span-auto bg-[#b0cde5] hover:bg-[#99bbdb] text-white px-4 py-2 rounded-full flex items-center justify-center transition-transform hover:scale-105"
              onClick={() => {
                const mockResults = [
                  {
                    id: 1,
                    name: "Taiwan Seven Days Boutique Hotel",
                    location: "Wanhua District, Taipei",
                    rating: 7.4,
                    ratingText: "Good",
                    reviews: 528,
                    price: 3002,
                    originalPrice: 6982,
                    nights: "36 nights, 2 adults",
                    image: "",
                  },
                  {
                    id: 2,
                    name: "Sundaily Hostel 北車",
                    location: "Zhongzheng District, Taipei",
                    rating: 9.0,
                    ratingText: "Superb",
                    reviews: 1287,
                    price: 1766,
                    originalPrice: null,
                    nights: "36 nights, 2 adults",
                    image: "",
                  },
                ];
                setSearchResults(mockResults);
              }}
            >
              <SearchIcon className="mr-2 h-4 w-4" /> Search
            </button>
          </div>

          {/* Offers */}
          <div className="mt-10">
            <h3 className="text-xl font-semibold text-[#1c1c2b] mb-4">
              Offers
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-white text-[#1c1c2b] rounded-lg p-4 shadow">
                <h4 className="font-bold mb-2">Quick escape, quality time</h4>
                <p className="mb-2">Save up to 20% with a Getaway Deal</p>
                <button className="bg-[#b0cde5] hover:bg-[#99bbdb] text-white px-4 py-2 rounded-full">
                  Save on stays
                </button>
              </div>
              <div className="bg-[#3a506b] text-white rounded-lg p-4 shadow">
                <h4 className="font-bold mb-2">Genius flight price alerts</h4>
                <p className="mb-4">
                  Save on flights with price alerts in your pocket. Set up an
                  alert and get notified when prices drop.
                </p>
                <button className="border border-white px-4 py-2 rounded-full hover:bg-[#99bbdb] transition">
                  Get the app
                </button>
              </div>
            </div>
          </div>

          {/* Recommended Stays */}
          {searchResults.length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl font-semibold text-black mb-1">
                Recommended Stays
              </h3>
              <p className="text-md text-gray-500 mb-6">
                Available stays based on your filters
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                {searchResults.map((stay) => (
                  <div
                    key={stay.id}
                    className="flex bg-white rounded-xl shadow overflow-hidden"
                  >
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
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trending Locations */}
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
