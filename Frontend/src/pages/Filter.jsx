export default function Filter() {
  return (
    <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-[#3a506b] to-[#1c1c2b] p-6">
      <div className="bg-gray-100 p-8 rounded-xl shadow-md w-full max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold text-black">
            Choose your Hotel
          </h1>
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            {/* Profile Icon or Image */}
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

        {/* Filter Preview Area */}
        <div className="border border-dashed border-gray-400 p-6 mb-8 text-center bg-white rounded-md">
          <p className="text-md text-gray-600">Layout your choice</p>
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
