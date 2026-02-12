import { useState } from "react";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Login Data:", form);

    // TODO:
    // connect ke API login backend kamu
  };

  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl">
        <h2 className="mb-6 text-2xl font-bold text-center">Login Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-200"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded-lg focus:ring focus:ring-blue-200"
              required
            />
          </div>

          <button className="w-full py-2 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700">
            Login
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          Belum punya akun?{" "}
          <Link to="/register" className="font-semibold text-blue-600">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
