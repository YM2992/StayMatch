import { useState } from "react";

export default function Filter() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);

  const handleFilterClick = async (filterType) => {
    setLoading(true);
    setError(null);
    setActiveFilter(filterType);
    setData(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setData(`Fetched data for ${filterType}`);
    } catch {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-[#3a506b] to-[#1c1c2b] p-6">
      <div className="bg-gray-100 p-8 rounded-xl shadow-md w-full max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-black">
            Choose your Hotel
          </h1>
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <button>
              <span>👤</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {["Location", "Amenities", "Price", "Bed", "Rooms"].map((filter) => (
            <button
              key={filter}
              className={`filter-btn ${
                activeFilter === filter ? "bg-[#b0cde5] text-white" : ""
              }`}
              onClick={() => handleFilterClick(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Filter Preview Area */}
        <div className="border border-dashed border-gray-400 p-6 mb-8 text-center bg-white rounded-md min-h-[100px] flex justify-center items-center">
          {loading ? (
            <p className="text-md text-gray-600">Loading {activeFilter}...</p>
          ) : error ? (
            <p className="text-md text-red-500">{error}</p>
          ) : data ? (
            <p className="text-md text-black">{data}</p>
          ) : (
            <p className="text-md text-gray-600">Layout your choice</p>
          )}
        </div>

        {/* Search Button */}
        <div className="flex justify-center">
          <button className="w-40 h-10 bg-[#b0cde5] hover:bg-[#99bbdb] text-white rounded-full flex justify-center items-center hover:scale-110 transition-transform duration-300">
            SEARCH
          </button>
        </div>
      </div>
    </div>
  );
}
