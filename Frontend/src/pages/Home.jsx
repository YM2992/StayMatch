import Input from "../components/Input";
import { useState } from "react";
import logo from "../assets/logo.png";

function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validate = () => {
    let isValid = true;

    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email.");
      isValid = false;
    } else {
      setEmailError("");
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

          <h2 className="text-2xl font-semibold text-black mt-20">Welcome!</h2>
          <p className="text-sm text-gray-700 mt-4 mb-8 text-center">
            Please sign in to your account below
          </p>
        </div>

        <div className="flex flex-col w-[17rem] mx-auto justify-items-center">
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
        </div>

        <div className="flex justify-center mt-2">
          <a href="#" className="text-sm text-blue-900">
            Forgot Password?
          </a>
        </div>

        <button
          onClick={handleSubmit}
          className="w-40 h-10 bg-[#b0cde5] hover:bg-[#99bbdb] text-white rounded-full flex justify-center items-center mx-auto mt-4 mb-4 hover:scale-110 transition-transform duration-300"
        >
          Sign in
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

export default Home;
