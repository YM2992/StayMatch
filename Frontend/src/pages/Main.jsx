import { useState } from "react";
import { CalendarIcon, UserIcon, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function Main() {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);

  return (
    <div className="min-h-screen bg-blue-800 text-white">
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Booking.com</h1>
        <div className="space-x-4">
          <Button variant="outline">Register</Button>
          <Button variant="outline">Sign in</Button>
        </div>
      </header>

      <main className="px-6 py-8">
        <h2 className="text-4xl font-bold mb-2">Find your next stay</h2>
        <p className="text-lg text-gray-200 mb-6">
          Search low prices on hotels, homes and much more...
        </p>

        <div className="bg-white text-black rounded-xl shadow p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <Input
            placeholder="Where are you going?"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
          <Input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            icon={<CalendarIcon className="w-4 h-4" />}
          />
          <Input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            icon={<CalendarIcon className="w-4 h-4" />}
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
          <Button className="col-span-1 md:col-span-auto bg-blue-600 text-white">
            <SearchIcon className="mr-2 h-4 w-4" /> Search
          </Button>
        </div>

        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">Offers</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-white text-black rounded-lg p-4 shadow">
              <h4 className="font-bold mb-2">Quick escape, quality time</h4>
              <p className="mb-2">Save up to 20% with a Getaway Deal</p>
              <Button className="bg-blue-600 text-white">Save on stays</Button>
            </div>
            <div className="bg-blue-700 rounded-lg p-4 shadow">
              <h4 className="font-bold mb-2">Genius flight price alerts</h4>
              <p className="mb-4">
                Save on flights with price alerts in your pocket. Set up an
                alert and get notified when prices drop.
              </p>
              <Button variant="outline" className="text-white border-white">
                Get the app
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
export default Main;
