import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function LoginForm() {
  const { signin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signin(formData.email, formData.password);
      navigate("/dashboard"); // success → redirect
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };
  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 text-2xl font-bold text-blue-500 mb-2">
          <span className="text-3xl">💰</span>
          ExpenseTracker
        </div>
        <p className="text-[var(--text-primary)]">Welcome back!</p>
      </div>

      {/* Signin Card */}
      <div className="bg-dark-card border border-[var(--white-border)] rounded-xl p-8">
        <h2 className="text-2xl text-[var(--text-primary)] font-semibold mb-6">
          Sign In
        </h2>

        <div className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark-bg border border-[var(--white-border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="john@example.com"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark-bg border border-[var(--white-border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm text-blue-500 hover:text-blue-400"
            >
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <form onSubmit={handleSubmit}>
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors mt-6"
            >
              Sign In
            </button>
          </form>
        </div>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <span className="text-[var(--text-primary)]">
            Don't have an account?{" "}
          </span>
          <button
            onClick={() => navigate("/signup")}
            className="text-blue-500 hover:text-blue-400 font-medium"
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Back to Home */}
      <div className="text-center mt-6">
        <button
          onClick={() => navigate("/")}
          className="text-[var(--text-primary)] hover:text-blue-400 transition-colors"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
export default LoginForm;
