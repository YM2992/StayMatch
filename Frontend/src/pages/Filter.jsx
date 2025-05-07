import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import profileIcon from "../assets/profile-icon.svg";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

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

// MOCK API DATA
const MOCK_API_DATA = {
  "Location": ["New York", "Paris", "Tokyo", "Cairo", "London", "Berlin", "Rome"],
  "Price Range": ["$50 - $100", "$100 - $200", "$200+"],
  "Money Currency": ["SAR"],
  "Rating": ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"],
  "Room Type": [
    "1 Bathroom, 1 Window",
    "2 Bathrooms, No Window",
    "2 Bathrooms, 2 Windows",
    "Studio with Balcony",
  ],
  "Bed Info": ["1 Bed", "2 Beds", "3 Beds", "Bunk Bed", "Queen + Single"],
  "Breakfast Included": ["Yes", "No"],
  "Free Cancellation": ["Yes", "No"],
  "No Prepayment": ["Yes", "No"],
};

export default function Filter() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [availableFilters, setAvailableFilters] = useState([]);
  const [searchText, setSearchText] = useState("");
  
  const navigate = useNavigate();


  const reverseFilterRenames = Object.fromEntries(
    Object.entries(filterRenames).map(([key, value]) => [value, key])
  );
  const reverseRenamedFilters = (filters) => {
    return Object.entries(filters).reduce((acc, [key, value]) => {
      const originalKey = reverseFilterRenames[key] || key; // Reverse the key
      acc[originalKey] = value.map((item) =>
        item === true ? "Yes" : item === false ? "No" : item // Reverse the value transformation
      );
      return acc;
    }, {});
  };

  const setSelectedFiltersFromURL = () => {
    const filters = api.getParamsFromURL();
    const selectedFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      const renamedKey = filterRenames[key] || key;
      acc[renamedKey] = value.split(",").map(
        (item) => {
            item = item.trim();
            return item = item === "true" ? "Yes" : item === "false" ? "No" : item;
          });
      return acc;
    }, {});

    const reversedFilters = reverseRenamedFilters(selectedFilters);
    
    if (Object.keys(reversedFilters).length > 0) {
      setSelectedFilters(reversedFilters);
      // setActiveFilter(Object.keys(reversedFilters)[0]);
      // setOptions(availableFilters[Object.keys(reversedFilters)[0]] || []);
    }
  };

  useEffect(() => {
    const fetchAvailableFilters = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.httpGet(api.paths.getFilters);
        
        if (response.status !== 200) throw new Error("Failed to fetch filters");
        
        const filters = response.data.filters;
        if (!filters) throw new Error("No filters found");
        let collatedFilters = {
          "Location": filters.locations,
          "Min Price": filters.min_price,
          "Max Price": filters.max_price,
          "Money Currency": filters.currencies,
          "Rating": MOCK_API_DATA["Rating"],
          "Room Type": filters.room_types,
          "Bed Info": filters.beds,
          "Breakfast Included": MOCK_API_DATA["Breakfast Included"],
          "Free Cancellation": MOCK_API_DATA["Free Cancellation"],
          "No Prepayment": MOCK_API_DATA["No Prepayment"]
        };

        console.log("Available Filters:", collatedFilters);
        
        setAvailableFilters(collatedFilters);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch filters. Please try again.");
        toast.error("Failed to fetch filters. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchAvailableFilters().then(() => {
      setSelectedFiltersFromURL();
    });
  }, []);

  const handleFilterClick = async (filterType) => {
    setLoading(true);
    setError(null);
    setActiveFilter(filterType);
    setOptions([]);
    setSearchText("");

    try {
      const fetchedOptions = availableFilters[filterType] || [];
      if (!fetchedOptions) throw new Error("Data not found");

      setOptions(fetchedOptions);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data. Please try again.");
      toast.error("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionToggle = (filterType, option) => {
    if (filterType === "Location") {
      return setSelectedFilters((prev) => ({
        ...prev,
        [filterType]: [option],
      }));
    }

    setSelectedFilters((prev) => {
      const currentSelections = prev[filterType] || [];
      const isSelected = currentSelections.includes(option);

      if (isSelected) {
        const updatedSelections = currentSelections.filter(
          (item) => item !== option
        );
        if (updatedSelections.length === 0) {
          const { [filterType]: _, ...rest } = prev;
          return rest;
        } else {
          return {
            ...prev,
            [filterType]: updatedSelections,
          };
        }
      } else {
        return {
          ...prev,
          [filterType]: [...currentSelections, option],
        };
      }
    });
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      // Map selectedFilters keys using dataRenames
      const renamedFilters = Object.entries(selectedFilters).reduce(
        (acc, [key, value]) => {
          const renamedKey = filterRenames[key] || key;

          const transformedValue = value.map((item) =>
            item === "Yes" ? true : item === "No" ? false : item
          );


          acc[renamedKey] = transformedValue;
          return acc;
        },
        {}
      );

      const queryString = api.makeQueryString(renamedFilters);

      navigate(`/main${queryString}`);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch hotels. Please try again.");
      toast.error("Failed to fetch hotels. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isOptionSelected = (filterType, option) => {
    return selectedFilters[filterType]?.includes(option);
  };

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-[#3a506b] to-[#1c1c2b] p-6">
      <div className="bg-gray-100 p-8 rounded-xl shadow-md w-full max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-800">
            Choose your Hotel
          </h1>
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <Link to="/profile">
              <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
                <img
                  src={profileIcon}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {Object.keys(MOCK_API_DATA).map((filter) => (
            <button
              key={filter}
              className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                activeFilter === filter
                  ? "bg-[#1a4467] text-white"
                  : "bg-white text-gray-800 hover:bg-gray-200"
              } transition`}
              onClick={() => handleFilterClick(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Options */}
        <div className="border border-dashed border-gray-400 p-6 mb-8 bg-white rounded-md min-h-[150px]">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
            Choose {activeFilter}
          </h2>
          {loading ? (
            <p className="text-md text-gray-600 text-center">
              Loading {activeFilter} options...
            </p>
          ) : error ? (
            <p className="text-md text-red-500 text-center">{error}</p>
          ) : activeFilter === "Location" ? (
            <div className="relative w-full max-w-xs mx-auto">
              <input
                type="text"
                placeholder="Search locations..."
                className="w-full p-2 border border-gray-300 rounded-md text-gray-800"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <div className="absolute top-full left-0 w-full mt-1 border border-gray-300 rounded-md max-h-48 overflow-y-auto bg-white shadow-lg z-10">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => (
                    <div
                      key={option}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-200 ${
                        isOptionSelected("Location", option)
                          ? "bg-[#1a4467] text-white"
                          : "text-gray-800"
                      }`}
                      onClick={() => handleOptionToggle("Location", option)}
                    >
                      {option}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-500 text-sm text-center">
                    No results
                  </div>
                )}
              </div>
            </div>
          ) : activeFilter === "Price Range" ? (
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor="minPrice" className="text-gray-800">
                  Min:
                </label>
                <input
                  id="minPrice"
                  type="number"
                  placeholder="Min Price"
                  className="w-24 p-2 border border-gray-300 rounded-md text-gray-800"
                  value={selectedFilters["Min Price"]?.[0] || ""}
                  onChange={(e) => {
                    const value = Math.max(0, e.target.value); // Prevent negative values
                    setSelectedFilters((prev) => ({
                      ...prev,
                      "Min Price": [
                        value,
                      ],
                    }));
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="maxPrice" className="text-gray-800">
                  Max:
                </label>
                <input
                  id="maxPrice"
                  type="number"
                  placeholder="Max Price"
                  className="w-24 p-2 border border-gray-300 rounded-md text-gray-800"
                  value={selectedFilters["Max Price"]?.[0] || ""}
                  onChange={(e) => {
                    const value = Math.max(0, e.target.value); // Prevent negative values
                    setSelectedFilters((prev) => ({
                      ...prev,
                      "Max Price": [
                        value
                      ],
                    }));
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4 justify-center">
              {options.map((option) => (
                <button
                  key={option}
                  className={`px-4 py-2 rounded-full transition-transform hover:scale-110 ${
                    isOptionSelected(activeFilter, option)
                      ? "bg-[#1a4467] text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                  onClick={() => handleOptionToggle(activeFilter, option)}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Filters */}
        <div className="border border-dashed border-gray-400 p-6 bg-white rounded-md min-h-[150px] mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Selected Filters
            </h2>
            <button
              onClick={() => setSelectedFilters({})}
              className="px-4 py-2 bg-red-400 hover:bg-red-500 text-white rounded-full text-sm transition-transform hover:scale-110"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-4">
            {Object.entries(selectedFilters).map(([filterType, options]) =>
              options.map((option) => (
                <div
                  key={`${filterType}-${option}`}
                  className="px-4 py-2 bg-[#546f85] text-white rounded-xl flex items-center gap-2"
                >
                  <span className="text-sm">
                    {filterType}: {option}
                  </span>
                  <button
                    onClick={() => handleOptionToggle(filterType, option)}
                    className="text-white"
                  >
                    X
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Search Button */}
        <div className="flex justify-center">
          <button
            onClick={handleSearch}
            className="w-40 h-10 bg-[#1a4467] hover:bg-[#163554] text-white rounded-full flex justify-center items-center hover:scale-110 transition-transform duration-300"
          >
            SEARCH
          </button>
        </div>
      </div>
    </div>
  );
}
