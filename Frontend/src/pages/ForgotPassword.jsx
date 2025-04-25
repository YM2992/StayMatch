import Input from "../components/Input";
import { useState } from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [emailError, setEmailError] = useState("");
    const [oldPasswordError, setOldPasswordError] = useState("");
    const [newPasswordError, setNewPasswordError] = useState("");

    const validate = () => {
        let isValid = true;

        if (!/\S+@\S+\.\S+/.test(email)) {
        setEmailError("Please enter a valid email.");
        isValid = false;
        } else {
        setEmailError("");
        }

        if (oldPassword.length < 6) {
        setOldPasswordError("Old password must be at least 6 characters.");
        isValid = false;
        } else {
        setOldPasswordError("");
        }

        if (newPassword.length < 6) {
        setNewPasswordError("New password must be at least 6 characters.");
        isValid = false;
        } else {
        setNewPasswordError("");
        }

        return isValid;
    };

    const handleClick = () => {
        validate(); // frontend-only validation
    };

    return (
        <div className="flex justify-center items-center h-screen w-full bg-gradient-to-br from-[#3a506b] to-[#1c1c2b]">
        <div className="bg-gray-100 p-8 rounded-xl shadow-md w-full max-w-sm relative">
            {/* Logo + Heading */}
            <div className="flex flex-col items-center">
            <div className="absolute -top-16 w-32 h-32 bg-gray-300 rounded-full flex justify-center items-center">
                <img
                src={logo}
                alt="StayMatch"
                className="w-[100%] h-[100%] rounded-full"
                />
            </div>

            <h2 className="text-2xl font-semibold text-black mt-20">
                Change Password
            </h2>
            <p className="text-sm text-gray-700 mt-4 mb-8 text-center">
                Update your password securely
            </p>
            </div>

            {/* Input fields */}
            <div className="flex flex-col w-[17rem] mx-auto justify-items-center">
            <Input type="email" field="Email" value={email} func={setEmail} />
            {emailError && (
                <p className="text-red-600 text-sm -mt-3 mb-2">{emailError}</p>
            )}

            <Input
                type="password"
                field="Old Password"
                value={oldPassword}
                func={setOldPassword}
            />
            {oldPasswordError && (
                <p className="text-red-600 text-sm -mt-3 mb-2">
                {oldPasswordError}
                </p>
            )}

            <Input
                type="password"
                field="New Password"
                value={newPassword}
                func={setNewPassword}
            />
            {newPasswordError && (
                <p className="text-red-600 text-sm -mt-3 mb-2">
                {newPasswordError}
                </p>
            )}
            </div>

            {/* Navigation + Button */}
            <div className="flex justify-center mt-2">
            <Link to="/" className="text-sm text-blue-900">
                Back to Sign In
            </Link>
            </div>

            <button
                onClick={handleClick}
                className="className=px-6 py-2 bg-[#b0cde5] hover:bg-[#99bbdb] text-white rounded-full flex justify-center items-center mx-auto mt-4 mb-4 hover:scale-110 transition-transform duration-300">
                Change Password
            </button>

            <p className="text-center text-sm text-gray-700">
            Having problems?{" "}
            <a href="contact-us" className="text-blue-900">
                Contact us
            </a>
            </p>
        </div>
        </div>
    );
}

export default ForgotPassword;