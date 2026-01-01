import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[var(--dark-bg)] text-text-primary">
      {/* Navigation */}
      <nav className="border-b border-[var(--white-border)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-xl font-bold text-blue-500">
            <span className="text-2xl">💰</span>
            ExpenseTracker
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("signin")}
              className="px-4 py-2 text-[var(--text-primary)] hover:text-text-primary transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("signup")}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl text-[var(--text-primary)] md:text-6xl font-bold mb-6 leading-tight">
          Take Control of Your
          <span className="text-blue-500"> Finances</span>
        </h1>
        <p className="text-xl text-[var(--text-primary)] mb-10 max-w-2xl mx-auto">
          Track expenses, manage budgets, and achieve your financial goals with
          our intuitive expense tracking platform.
        </p>
        <button
          onClick={() => navigate("signup")}
          className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white text-lg rounded-lg transition-colors font-semibold inline-flex items-center gap-2"
        >
          Start Free Today
          <span>→</span>
        </button>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl text-[var(--text-primary)] font-bold text-center mb-16">
          Everything You Need to Manage Money
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-dark-card border border-[var(--white-border)] rounded-xl p-8 hover:transform hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 bg-blue-500 bg-opacity-10 rounded-lg flex items-center justify-center text-3xl mb-4">
              📊
            </div>
            <h3 className="text-xl text-[var(--text-primary)] font-semibold mb-3">
              Smart Dashboard
            </h3>
            <p className="text-[var(--text-primary)]">
              Get a complete overview of your financial health with real-time
              insights and visualizations.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-dark-card border border-[var(--white-border)] rounded-xl p-8 hover:transform hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 bg-green-500 bg-opacity-10 rounded-lg flex items-center justify-center text-3xl mb-4">
              💰
            </div>
            <h3 className="text-xl text-[var(--text-primary)] font-semibold mb-3">
              Budget Management
            </h3>
            <p className="text-[var(--text-primary)]">
              Set category budgets and track spending against your limits with
              visual progress indicators.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-dark-card border border-[var(--white-border)] rounded-xl p-8 hover:transform hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 bg-purple-500 bg-opacity-10 rounded-lg flex items-center justify-center text-3xl mb-4">
              📈
            </div>
            <h3 className="text-xl text-[var(--text-primary)] font-semibold mb-3">
              Analytics & Reports
            </h3>
            <p className="text-[var(--text-primary)]">
              Understand spending patterns with detailed analytics and monthly
              trend reports.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="bg-dark-card border border-[var(--white-border)] rounded-2xl p-12">
          <h2 className="text-3xl text-[var(--text-primary)] font-bold mb-4">
            Ready to Start Tracking?
          </h2>
          <p className="text-[var(--text-primary)] text-lg mb-8">
            Join thousands of users who are taking control of their finances.
          </p>
          <button
            onClick={() => navigate("signup")}
            className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white text-lg rounded-lg transition-colors font-semibold"
          >
            Create Your Free Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--white-border)] py-8 text-center text-[var(--text-primary)]">
        <p>© 2024 ExpenseTracker. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
