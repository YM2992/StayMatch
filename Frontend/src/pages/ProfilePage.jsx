import { Link } from "react-router-dom";
import { useState } from "react";

function ProfilePage() {
  const [activeTab, setActiveTab] = useState("preferences");

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Top Navigation */}
      <div className="flex justify-between items-center mb-8">
        <Link to="/" className="text-blue-600 hover:underline text-lg font-semibold">
          ← Main Page
        </Link>
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
          🧍‍♀️
        </div>
      </div>

      {/* Profile Info */}
      <div className="bg-white rounded-xl shadow-md p-6 max-w-xl mx-auto">
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-4xl">
            👤
          </div>
          <div className="w-full space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="user@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline mt-1 block">
                Forgot password?
              </Link>
            </div>
          </div>
        </div>

        {/* Tabbed Section */}
        <div>
          <div className="flex justify-between border-b mb-4">
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === "preferences"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("preferences")}
            >
              Selected Preferences
            </button>
            <button
              className={`py-2 px-4 font-medium ${
                activeTab === "saved"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("saved")}
            >
              Saved
            </button>
          </div>

          {/* Example Hotel List */}
          <ul className="space-y-3">
            <li className="flex justify-between border p-3 rounded-md shadow-sm">
              <span>Hotel A</span>
              <span>✕</span>
            </li>
            <li className="flex justify-between border p-3 rounded-md shadow-sm">
              <span>Hotel B</span>
              <span>✓</span>
            </li>
            <li className="flex justify-between border p-3 rounded-md shadow-sm">
              <span>Hotel C</span>
              <span>★</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
