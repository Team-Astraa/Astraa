

import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import SignupForm from "./Pages/SignUp";
import SignupformT from "./Pages/SignupformT";
import HomePage from "./Pages/Home"; // Example additional page
import Admin from "./Pages/Admin";
import LoginForm from "./Pages/SignIn";
// import NotFoundPage from "./Pages/NotFoundPage"; // 404 page

function App() {
  return (
    <div className=" h-screen w-full">
      <Router>
        {/* <Toaster position="top-right" reverseOrder={false} /> */}

        <Routes>
          {/* Define Routes for pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/signUp" element={<SignupForm />} />
          <Route path="/signUp2" element={<SignupformT />} />

          <Route path="/signIn" element={<LoginForm />} />
          <Route path="/Admin" element={<Admin />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
