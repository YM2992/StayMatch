import Input from "../components/Input";
import { useState } from "react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");

  const [emailError, setEmailError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");

  const validate = () => {
    let isValid = true;

    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email.");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (securityQuestion.trim() === "") {
      alert("Please select your security question.");
      isValid = false;
    }

    if (securityAnswer.trim() === "") {
      alert("Please provide your security answer.");
      isValid = false;
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
    if (validate()) {
      alert("Verification successful! Password changed.");
    }
  };

  return (
    <div className="flex justify-center min-h-screen w-full bg-gradient-to-br from-[#3a506b] to-[#1c1c2b] py-20">
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
            Reset Password
          </h2>
          <p className="text-sm text-gray-700 mt-4 mb-8 text-center">
            Verify your account to reset your password
          </p>
        </div>

        {/* Input Fields */}
        <div className="flex flex-col w-[17rem] mx-auto justify-items-center">
          <Input type="email" field="Email" value={email} func={setEmail} />
          {emailError && (
            <p className="text-red-600 text-sm -mt-3 mb-2">{emailError}</p>
          )}

          {/* Security Question Dropdown */}
          <div className="flex flex-col mb-4">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Security Question
            </label>
            <select
              value={securityQuestion}
              onChange={(e) => setSecurityQuestion(e.target.value)}
              className="w-full h-10 px-4 py-2 border rounded-md shadow-sm bg-white text-gray-700"
            >
              <option value="">Select a question...</option>
              <option value="What was your first pet's name?">What was your first pet's name?</option>
              <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
              <option value="What was the name of your primary school?">What was the name of your primary school?</option>
              <option value="What is your favourite food?">What is your favourite food?</option>
              <option value="In what city were you born?">In what city were you born?</option>
            </select>
          </div>

          {/* Security Answer Input */}
          <Input
            type="text"
            field="Security Answer"
            value={securityAnswer}
            func={setSecurityAnswer}
          />

          {/* New Password */}
          <Input
            type="password"
            field="New Password"
            value={newPassword}
            func={setNewPassword}
          />
          {newPasswordError && (
            <p className="text-red-600 text-sm -mt-3 mb-2">{newPasswordError}</p>
          )}
        </div>

        <div className="flex justify-center mt-2">
          <Link to="/" className="text-sm text-blue-900">
            Back to Sign In
          </Link>
        </div>

        <button
          onClick={handleClick}
          className="px-6 py-2 bg-[#b0cde5] hover:bg-[#99bbdb] text-white rounded-full flex justify-center items-center mx-auto mt-4 mb-4 hover:scale-110 transition-transform duration-300"
        >
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