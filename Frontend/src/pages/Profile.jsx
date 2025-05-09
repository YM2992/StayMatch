import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import eyeIcon from "../assets/eye.svg";
import eyeOffIcon from "../assets/eye-off.svg";
import profileIcon from "../assets/profile-icon.svg";
import homeIcon from "../assets/home-icon.svg";
import { useAppContext } from "../context/Context";
import api from "../api";
import { Star } from "lucide-react";

function Profile() {
    const { authDetails, preferences, updatePreferences, clearAuthDetails } = useAppContext();
    const [activeTab, setActiveTab] = useState("saved");
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [hotelInfo, setHotelInfo] = useState([]);

    useEffect(() => {
        if (authDetails) {
            setEmail(authDetails.email || "");
        }
    }, [authDetails]);

    const getHotelInfoFromPreferences = async (preferences) => {
        if (!preferences || preferences.length === 0) {
            return new Error("No preferences found.");
        }

        const validHotelIDs = preferences
            .map((pref) => pref)
            .filter((id) => id); // Filter out empty or falsy Hotel_ID values

        if (validHotelIDs.length === 0) {
            return new Error("No valid Hotel_IDs found in preferences.");
        }

        return api.httpGet(api.paths.getHotels, {
            return_keys: "Hotel_ID,name,location,price,rating",
            Hotel_ID: validHotelIDs.join(",")
        }).then((response) => {
            if (response.status === 200) {
                const hotels = response.data.hotels;
                return hotels;
            } else {
                return new Error("Error fetching hotel info: " + response.data.error);
            }
        }).catch((error) => {
            return new Error("Error fetching hotel info: " + error.message);
        });
    }

    useEffect(() => {
        getHotelInfoFromPreferences(preferences).then((hotels) => {
            console.log("Hotels:", hotels);
            if (!hotels) return;

            setHotelInfo(hotels);
        }).catch((error) => {
            console.error("Error fetching hotel info:", error);
        });
    }, [preferences]);

    return (
        // <div className="flex justify-center items-center h-screen w-full bg-gradient-to-br from-[#3a506b] to-[#1c1c2b]">
        <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#3a506b] to-[#1c1c2b]">
            <div className="bg-gray-100 p-8 rounded-xl shadow-md w-full max-w-4xl">

                {/* Home Button */}
                <div className="flex justify-end">
                    <Link to="/filter">
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
                                {email}
                            </div>
                        </div>
                        <div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <div className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700 shadow-sm flex justify-between items-center">
                                    <span>{showPassword ? "p@ssw0rd" : "••••••••"}</span>
                                    {/* <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="icon-btn ml-2 p-1"
                                    >
                                        <img
                                            src={showPassword ? eyeOffIcon : eyeIcon}
                                            alt={showPassword ? "Hide password" : "Show password"}
                                            className="h-5 w-5"
                                        />
                                    </button> */}
                                </div>
                            </div>
                            <Link onClick={clearAuthDetails()} to="/forgot-password" className="text-sm text-blue-900 hover:underline mt-1 mb-4 block">
                                Change password?
                            </Link>
                        </div>
                    </div>

                    {/* Preferences Section */}
                    <div>
                        <div className="flex justify-between border-b mb-4">
                            {/* <button
                                className={`py-2 px-4 font-medium w-1/2 ${
                                    activeTab === "preferences"
                                        ? "bg-black text-white rounded-tl-md"
                                        : "bg-gray-200 text-gray-700"
                                }`}
                                onClick={() => setActiveTab("preferences")}
                            >
                                Selected Preferences
                            </button> */}
                            <button
                                className={`py-2 px-4 font-medium w-1/1 ${
                                    activeTab === "saved"
                                        ? "bg-black text-white rounded-tr-md"
                                        : "bg-gray-200 text-gray-700"
                                }`}
                                onClick={() => setActiveTab("saved")}
                            >
                                Favourited Hotels
                            </button>
                        </div>

                        <ul className="space-y-3">
                            {(hotelInfo && hotelInfo.length > 0) ? hotelInfo.map((hotel) => (
                                <li key={hotel.Hotel_ID} className="border p-3 rounded-md shadow-sm flex justify-between">
                                    <a 
                                        href={`https://www.google.com/search?q=${encodeURIComponent(hotel.name)}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="flex-1 text-gray-900 font-medium"
                                    >
                                        <div>
                                            <div className="flex items-center">
                                                {hotel.name}
                                                <span className="ml-2 flex">
                                                    {Array.from({ length: 5 }, (_, i) => {
                                                        const starValue = i + 1;
                                                        if (hotel.rating / 2 >= starValue) {
                                                            // Full star
                                                            return (
                                                                <Star
                                                                    key={i}
                                                                    className="h-4 w-4 text-yellow-500 fill-current"
                                                                />
                                                            );
                                                        } else {
                                                            // Empty star
                                                            return (
                                                                <Star
                                                                    key={i}
                                                                    className="h-4 w-4 text-gray-300"
                                                                />
                                                            );
                                                        }
                                                    })}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-500 flex items-center mt-1">
                                                <svg 
                                                    xmlns="http://www.w3.org/2000/svg" 
                                                    className="h-4 w-4 mr-1" 
                                                    fill="none" 
                                                    viewBox="0 0 24 24" 
                                                    stroke="currentColor"
                                                >
                                                    <path 
                                                        strokeLinecap="round" 
                                                        strokeLinejoin="round" 
                                                        strokeWidth={2} 
                                                        d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7zM12 11a2 2 0 110-4 2 2 0 010 4z" 
                                                    />
                                                </svg>
                                                {hotel.location}
                                            </div>
                                            <div className="text-sm text-gray-500 mt-1">
                                                Price: ${hotel.price}
                                            </div>
                                        </div>
                                    </a>
                                    <button 
                                        onClick={() => {
                                            const updatedPreferences = preferences.filter(pref => pref !== hotel.Hotel_ID);
                                            updatePreferences(updatedPreferences);
                                        }} 
                                        className="text-gray-900 font-medium"
                                    >
                                        ✕
                                    </button>
                                </li>
                            )) : (
                                <li className="border p-3 rounded-md shadow-sm flex justify-between">
                                    <span className="text-gray-900 font-medium">No preferences found</span>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
