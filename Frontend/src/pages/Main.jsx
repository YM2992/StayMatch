import { useState } from "react";
import { CalendarIcon, SearchIcon } from "lucide-react";

function Main() {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3a506b] to-[#1c1c2b] flex items-center justify-center px-4">
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

          <div className="bg-white rounded-xl shadow p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            <input
              type="text"
              placeholder="Where are you going?"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="border px-3 py-2 rounded-md w-full"
            />
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="border px-3 py-2 rounded-md w-full"
            />
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="border px-3 py-2 rounded-md w-full"
            />
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-1">Guests & Rooms</label>
              <select
                className="border rounded px-3 py-2"
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
            <button className="col-span-1 md:col-span-auto bg-[#b0cde5] hover:bg-[#99bbdb] text-white px-4 py-2 rounded-full flex items-center justify-center transition-transform hover:scale-105">
              <SearchIcon className="mr-2 h-4 w-4" /> Search
            </button>
          </div>

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
        </main>
      </div>
    </div>
  );
}

export default Main;
