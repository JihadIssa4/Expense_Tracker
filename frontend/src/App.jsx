import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ExpensePage from './pages/ExpensesPage';
import CategoriesPage from './pages/CategoriesPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/expenses" element={<ExpensePage />} />
        <Route path="/categories" element={<CategoriesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
