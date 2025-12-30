import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ExpensePage from "./pages/ExpensesPage";
import CategoriesPage from "./pages/CategoriesPage";
import Layout from "./components/layout/Layout";
import Analytics from "./pages/AnalyticsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/expenses" element={<ExpensePage />} />
          <Route path="/categories" element={<CategoriesPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
