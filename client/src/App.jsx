

import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupForm from "./Pages/SignUp";
import LoginForm from "./Pages/SignIn";
import Sidebar from "./Components/SideBar";
import Dashboard from "./Pages/Dashboard";
import HomePage from "./Pages/HomePage";
import AdminHome from "./Pages/AdminHome";
import Adminverifyuser from "./Pages/Admin-verify-user";
import SignupformT from "./Pages/SignupformT";
// import NotFoundPage from "./Pages/NotFoundPage"; // 404 page

function App() {
  return (
    <Router>
      {/* <Toaster position="top-right" reverseOrder={false} />
      <h1 className="text-center text-2xl font-bold ">WELCOME TO OUR APP</h1> */}

      <div style={styles.container}>
      <Sidebar/>

        <div style={styles.content}>
          <Routes>
            {/* Define Routes for pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/signUp" element={<SignupForm />} />
            <Route path="/signUpT" element={<SignupformT />} />

            <Route path="/signIn" element={<LoginForm />} />
            <Route path="/admin/home" element={<AdminHome />} />
            <Route path="/admin/unverify-user" element={<Adminverifyuser />} />

            <Route path="/dashboard" element={<Dashboard/>} />
          </Routes>
        </div>
      </div>

    </Router>
  );
}

const styles = {
  container: {
    display: 'flex',
  },
  content: {
    padding: '10px',
    width: '100%',
    height: '100vh'
  },
};

export default App;
