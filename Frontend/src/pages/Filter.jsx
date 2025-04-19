export default function Filter() {
  return (
    <div className="min-h-screen bg-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Choose your Hotel</h1>
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
          {/* Replace with actual profile pic or icon */}
          <span className="text-sm">👤</span>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <button className="filter-btn">Location</button>
        <button className="filter-btn">Amenities</button>
        <button className="filter-btn">Price</button>
        <button className="filter-btn">Bed</button>
        <button className="filter-btn">Rooms</button>
      </div>

      {/* Filter summary or layout area */}
      <div className="border border-dashed border-gray-400 p-6 mb-8 text-center">
        <p className="text-lg text-gray-600">Layout your choice</p>
      </div>

      {/* Search Button */}
      <div className="flex justify-center">
        <button className="px-8 py-3 bg-blue-500 text-white text-lg rounded-full hover:bg-blue-600 transition">
          SEARCH
        </button>
      </div>
    </div>
  );
}
