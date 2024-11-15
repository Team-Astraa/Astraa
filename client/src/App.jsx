

import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupForm from "./Pages/SignUp";
import LoginForm from "./Pages/SignIn";
import HomePage from "./Pages/HomePage";
import AdminHome from "./Pages/AdminHome";
import Adminverifyuser from "./Pages/Admin-verify-user";
// import NotFoundPage from "./Pages/NotFoundPage"; // 404 page

function App() {
  return (
    <Router>
      <Routes>
        {/* Define Routes for pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/signIn" element={<LoginForm />} />
        <Route path="/admin/home" element={<AdminHome />} />
        <Route path="/admin/unverify-user" element={<Adminverifyuser />} />

      </Routes>

    </Router>
  );
}

export default App;
