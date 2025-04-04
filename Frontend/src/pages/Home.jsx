import { useState } from "react";

const Home = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    // Add your login logic here
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#FDFCFB]">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#2C3E50]">
          Welcome Back
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#2C3E50]">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#2C3E50]">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#E67E22] text-white py-2 font-semibold rounded-xl hover:bg-[#cf6a1c] transition duration-300"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
