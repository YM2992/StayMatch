import Input from "../components/Input";
import { useState } from "react";

function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {};

  return (
    <div className="flex justify-center items-center h-screen w-full bg-gradient-to-b from-[#e1edf8] to-[#85d2f8]">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm relative">
        <div className="flex flex-col items-center">
          <div className="absolute -top-16 w-32 h-32 bg-gray-300 rounded-full flex justify-center items-center">
            <img
              src="/assets/StayMatch_Logo.png"
              alt="StayMatch"
              className="w-[95%] h-[95%] rounded-full object-cover filter brightness-0 -translate-y-1"
            />
          </div>

          <h2 className="text-2xl font-semibold text-black mt-20">Welcome!</h2>
          <p className="text-sm text-gray-700 mt-4 mb-8 text-center">
            Please sign in to your account below
          </p>
        </div>

        <div className="flex flex-col w-[17rem] mx-auto justify-items-center ">
          <Input
            type="email"
            field="Email"
            value={email}
            func={setEmail}
            required
          />
          <Input
            type="password"
            field="Password"
            value={password}
            func={setPassword}
          />
        </div>

        <div className="flex justify-center mt-4">
          <a href="#" className="text-sm text-blue-900">
            Forgot Password?
          </a>
        </div>

        <button
          onClick={handleSubmit}
          className="w-40 h-10 bg-[#7bc3ff] text-white rounded-full flex justify-center items-center mx-auto mt-4 mb-4 hover:bg-blue-600 hover:scale-110 transition-transform duration-300"
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
