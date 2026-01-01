import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function SignupForm() {
  const navigate = useNavigate();
  const { signup } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    salary: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    console.log("HI");
    e.preventDefault();
    setError("");

    try {
      await signup(formData); // create user ONLY
      navigate("/signin"); // redirect to login page
    } catch (err) {
      setError(err.message || "Registration failed");
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
        <p className="text-[var(--text-primary)]">Create your account</p>
      </div>

      {/* Signup Card */}
      <div className="bg-dark-card border border-[var(--white-border)] rounded-xl p-8">
        <h2 className="text-2xl font-semibold mb-6">Sign Up</h2>

        <div className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark-bg border border-[var(--white-border)] rounded-lg text-text-primary focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="John Doe"
            />
          </div>

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
              className="w-full px-4 py-3 bg-dark-bg border border-[var(--white-border)] rounded-lg text-text-primary focus:outline-none focus:border-blue-500 transition-colors"
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
              className="w-full px-4 py-3 bg-dark-bg border border-[var(--white-border)] rounded-lg text-text-primary focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark-bg border border-[var(--white-border)] rounded-lg text-text-primary focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="••••••••"
            />
          </div>
          {/* Submit Button */}
          <form onSubmit={handleSubmit}>
            {/* inputs */}

            <button
              type="submit"
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors mt-6"
            >
              Sign Up
            </button>
          </form>
        </div>
        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <span className="text-[var(--text-primary)]">
            Already have an account?{" "}
          </span>
          <button
            onClick={() => navigate("/signin")}
            className="text-blue-500 hover:text-blue-400 font-medium"
          >
            Sign In
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
export default SignupForm;
