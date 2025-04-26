import { useState } from "react";
import { toast } from "react-hot-toast";

// MOCK API DATA
const MOCK_API_DATA = {
  Location: ["New York", "Paris", "Tokyo", "Cairo"],
  Amenities: ["Pool", "Wi-Fi", "Breakfast", "Parking"],
  Price: ["$100 - $200", "$200 - $300", "$300+"],
  Bed: ["Single", "Double", "Queen", "King"],
  Rooms: ["1 Room", "2 Rooms", "3+ Rooms"],
};

export default function Filter() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState([]); // options to display as buttons
  const [activeFilter, setActiveFilter] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({});

  const handleFilterClick = async (filterType) => {
    setLoading(true);
    setError(null);
    setActiveFilter(filterType);
    setOptions([]); // reset options when clicking new filter

    try {
      // simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const fetchedOptions = MOCK_API_DATA[filterType];
      if (!fetchedOptions) {
        throw new Error("Data not found");
      }

      setOptions(fetchedOptions);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data. Please try again.");
      toast.error("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (filterType, option) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: option,
    }));
  };

  const hasSelectedFilters = Object.keys(selectedFilters).length > 0;

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-[#3a506b] to-[#1c1c2b] p-6">
      <div className="bg-gray-100 p-8 rounded-xl shadow-md w-full max-w-6xl">
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
        {/* Options Area */}
        {
          <div className="border border-dashed border-gray-400 p-6 mb-8 bg-white rounded-md min-h-[150px]">
            <h2 className="text-xl font-semibold mb-4 text-black text-center">
              Choose {activeFilter}
            </h2>
            {loading ? (
              <p className="text-md text-gray-600 text-center">
                Loading {activeFilter} options...
              </p>
            ) : error ? (
              <p className="text-md text-red-500 text-center">{error}</p>
            ) : (
              <div className="flex flex-wrap gap-4 justify-center">
                {options.map((option) => (
                  <button
                    key={option}
                    className="px-4 py-2 bg-[#b0cde5] hover:bg-[#99bbdb] rounded-full text-white transition-transform hover:scale-110"
                    onClick={() => handleOptionSelect(activeFilter, option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        }
        {/* Selected Filters Card */}(
        <div className="border border-dashed border-gray-400 p-6 bg-white rounded-md min-h-[150px] mb-8">
          <h2 className="text-xl font-semibold mb-4 text-black">
            Selected Filters
          </h2>
          <ul className="list-disc list-inside text-gray-700">
            {Object.entries(selectedFilters).map(
              ([filterType, selectedValue]) => (
                <li key={filterType}>
                  <strong>{filterType}:</strong> {selectedValue}
                </li>
              )
            )}
          </ul>
        </div>
        ){/* Search Button */}
        <div className="flex justify-center">
          <button className="w-40 h-10 bg-[#b0cde5] hover:bg-[#99bbdb] text-white rounded-full flex justify-center items-center hover:scale-110 transition-transform duration-300">
            SEARCH
          </button>
        </div>
      </div>
    </div>
  );
}
