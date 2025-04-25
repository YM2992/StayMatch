import { useState } from "react";
import { Link } from "react-router-dom";
import profileIcon from "../assets/profile-icon.svg";

function ForgotPassword() {
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    return (
        <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#3a506b] to-[#1c1c2b]">
            <div className="bg-gray-100 p-8 rounded-xl shadow-md w-full max-w-xl">

                {/* Avatar + Heading */}
                <div className="flex flex-col items-center">
                    <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                        <img 
                            src={profileIcon} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <h2 className="text-2xl font-semibold text-black mt-4">Change Password</h2>
                    <p className="text-sm text-gray-700 mt-2 text-center">Update your password securely</p>
                </div>

                {/* Form */}
                <form className="mt-8 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            className="mt-1 w-full px-4 py-2 border rounded-md shadow-sm bg-white text-gray-700"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Old Password</label>
                        <div className="mt-1 w-full px-4 py-2 border rounded-md shadow-sm bg-white text-gray-700 flex justify-between items-center">
                            <input
                                type={showOldPassword ? "text" : "password"}
                                className="bg-transparent outline-none w-full"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowOldPassword(!showOldPassword)}
                                className="ml-2 text-sm text-blue-600"
                            >
                                {showOldPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">New Password</label>
                        <div className="mt-1 w-full px-4 py-2 border rounded-md shadow-sm bg-white text-gray-700 flex justify-between items-center">
                            <input
                                type={showNewPassword ? "text" : "password"}
                                className="bg-transparent outline-none w-full"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="ml-2 text-sm text-blue-600"
                            >
                                {showNewPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow"
                    >
                        Change Password
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;
