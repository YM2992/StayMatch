import { useState } from "react";
import { Link } from "react-router-dom";
import eyeIcon from "../assets/eye.svg";
import eyeOffIcon from "../assets/eye-off.svg";
import profileIcon from "../assets/profile-icon.svg";
import homeIcon from "../assets/home-icon.svg";

function Profile() {
    const [activeTab, setActiveTab] = useState("preferences");
    const [showPassword, setShowPassword] = useState(false);

    return (
        // <div className="flex justify-center items-center h-screen w-full bg-gradient-to-br from-[#3a506b] to-[#1c1c2b]">
        <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#3a506b] to-[#1c1c2b]">
            <div className="bg-gray-100 p-8 rounded-xl shadow-md w-full max-w-4xl">

                {/* Home Button */}
                <div className="flex justify-end">
                    <Link to="/">
                        <button className="icon-btn ml-2 p-1">
                            <img
                                src={homeIcon}
                                alt="Home"
                                className="w-5 h-5"/>
                        </button>
                    </Link>
                </div>

                {/* Profile Section */}
                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                        <img 
                            src={profileIcon} 
                            alt="Profile" 
                            className="w-full h-full object-cover"/>
                    </div>
                    <h2 className="text-2xl font-semibold text-black mt-4">
                        Profile Page
                    </h2>
                    <p className="text-sm text-gray-700 mt-2 text-center">
                        View your profile and saved hotel preferences
                    </p>
                </div>

                <div className="gap-8">
                    {/* Profile Info */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <div className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700 shadow-sm">
                                user@example.com
                            </div>
                        </div>
                        <div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <div className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700 shadow-sm flex justify-between items-center">
                                    <span>{showPassword ? "p@ssw0rd" : "••••••••"}</span>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="icon-btn ml-2 p-1"
                                    >
                                        <img
                                            src={showPassword ? eyeOffIcon : eyeIcon}
                                            alt={showPassword ? "Hide password" : "Show password"}
                                            className="h-5 w-5"
                                        />
                                    </button>
                                </div>
                            </div>
                            <Link to="/forgot-password" className="text-sm text-blue-900 hover:underline mt-1 mb-4 block">
                                Change password?
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
                                <span className="text-gray-900 font-medium">Hotel A</span>
                                <span className="text-gray-900 font-medium">✕</span>
                            </li>
                            <li className="border p-3 rounded-md shadow-sm flex justify-between">
                                <span className="text-gray-900 font-medium">Hotel B</span>
                                <span className="text-gray-900 font-medium">✓</span>
                            </li>
                            <li className="border p-3 rounded-md shadow-sm flex justify-between">
                                <span className="text-gray-900 font-medium">Hotel C</span>
                                <span className="text-gray-900 font-medium">★</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
