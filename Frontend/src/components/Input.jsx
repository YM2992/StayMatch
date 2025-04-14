import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Input({ field, func, value, type = "text" }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  const inputType = isPassword ? (show ? "text" : "password") : type;

  return (
    <div className="flex items-center border border-gray-300 rounded-lg px-4 mb-4 bg-white">
      <input
        value={value}
        placeholder={field}
        type={inputType}
        className="w-full py-2 focus:outline-none text-black"
        onChange={(e) => func(e.target.value)}
        required
      />
      {isPassword && (
        <span
          onClick={() => setShow(!show)}
          className="cursor-pointer text-gray-600"
        >
          {show ? <FaEyeSlash /> : <FaEye />}
        </span>
      )}
    </div>
  );
}

export default Input;
