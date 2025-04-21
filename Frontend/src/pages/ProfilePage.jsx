import { useState } from "react";
import { Link } from "react-router-dom";

function ProfilePage() {
    const [activeTab, setActiveTab] = useState("preferences");

    return (
        // <div className="flex justify-center items-center h-screen w-full bg-gradient-to-br from-[#3a506b] to-[#1c1c2b]">
        <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#3a506b] to-[#1c1c2b]">
            <div className="bg-gray-100 p-8 rounded-xl shadow-md w-full max-w-4xl">
            
                
                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-4xl text-purple-700">
                        👤
                    </div>
                    <h2 className="text-2xl font-semibold text-black mt-4">
                        Profile Page
                    </h2>
                    <p className="text-sm text-gray-700 mt-2 text-center">
                        View your profile and saved hotel preferences
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Profile Info */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="user@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="••••••••"
                            />
                            <Link to="/forgot-password" className="text-sm text-blue-900 hover:underline mt-1 block">
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    {/* Preferences Section */}
                    <div>
                        <div className="flex justify-between border-b mb-4">
                            <button
                                className={`py-2 px-4 font-medium w-1/2 ${
                                    activeTab === "preferences"
                                        ? "bg-black text-white rounded-tl-md"
                                        : "bg-gray-200 text-gray-700"
                                }`}
                                onClick={() => setActiveTab("preferences")}
                            >
                                Selected Preferences
                            </button>
                            <button
                                className={`py-2 px-4 font-medium w-1/2 ${
                                    activeTab === "saved"
                                        ? "bg-black text-white rounded-tr-md"
                                        : "bg-gray-200 text-gray-700"
                                }`}
                                onClick={() => setActiveTab("saved")}
                            >
                                Saved
                            </button>
                        </div>

                        <ul className="space-y-3">
                            <li className="border p-3 rounded-md shadow-sm flex justify-between">
                                <span>Hotel A</span>
                                <span>✕</span>
                            </li>
                            <li className="border p-3 rounded-md shadow-sm flex justify-between">
                                <span>Hotel B</span>
                                <span>✓</span>
                            </li>
                            <li className="border p-3 rounded-md shadow-sm flex justify-between">
                                <span>Hotel C</span>
                                <span>★</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
