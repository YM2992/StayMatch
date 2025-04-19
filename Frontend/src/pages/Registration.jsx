import Input from "../components/Input";
import { useState } from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

function Registration() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [nameError, setNameError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const validate = () => {
    let isValid = true;

    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email.");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!name.trim()) {
      setNameError("Please enter your name.");
      isValid = false;
    } else {
      setNameError("");
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (validate()) {
      console.log("Logging in with:", email, password);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-full bg-gradient-to-br from-[#3a506b] to-[#1c1c2b]">
      <div className="bg-gray-100 p-8 rounded-xl shadow-md w-full max-w-sm relative">
        <div className="flex flex-col items-center">
          <div className="absolute -top-16 w-32 h-32 bg-gray-300 rounded-full flex justify-center items-center">
            <img
              src={logo}
              alt="StayMatch"
              className="w-[100%] h-[100%] rounded-full"
            />
          </div>

          <h2 className="text-2xl font-semibold text-black mt-20">
            Welcome to StayMatch!
          </h2>
          <p className="text-sm text-gray-700 mt-4 mb-8 text-center">
            Become a Member — It’s Free!
          </p>
        </div>

        <div className="flex flex-col w-[17rem] mx-auto justify-items-center">
          <Input type="text" field="Name" value={name} func={setName} />
          {nameError && (
            <p className="text-red-600 text-sm -mt-3 mb-2">{nameError}</p>
          )}

          <Input type="email" field="Email" value={email} func={setEmail} />
          {emailError && (
            <p className="text-red-600 text-sm -mt-3 mb-2">{emailError}</p>
          )}
          <Input
            type="password"
            field="Password"
            value={password}
            func={setPassword}
          />
          {passwordError && (
            <p className="text-red-600 text-sm -mt-3 mb-2">{passwordError}</p>
          )}

          <Input
            type="password"
            field="Confirm Password"
            value={confirmPassword}
            func={setConfirmPassword}
          />
          {confirmPasswordError && (
            <p className="text-red-600 text-sm -mt-3 mb-2">
              {confirmPasswordError}
            </p>
          )}
        </div>

        <div className="flex justify-center mt-2">
          <Link to="/" className="text-sm text-blue-900">
            Existing User?
          </Link>
        </div>

        <button
          onClick={handleSubmit}
          className="w-40 h-10 bg-[#b0cde5] hover:bg-[#99bbdb] text-white rounded-full flex justify-center items-center mx-auto mt-4 mb-4 hover:scale-110 transition-transform duration-300"
        >
          Sign Up
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

export default Registration;
