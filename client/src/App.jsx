

import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupForm from "./Pages/SignUp";
import LoginForm from "./Pages/SignIn";
import Sidebar from "./Components/SideBar";
import Dashboard from "./Pages/Dashboard";
import HomePage from "./Pages/HomePage";
import AdminHome from "./Pages/AdminHome";
import Adminverifyuser from "./Pages/Admin-verify-user";
import NavBar from "./Components/NavBar";


function App() {
  return (
    <Router>


      <div style={styles.container}>
        <Sidebar />

        <div style={styles.content}>
          <NavBar />
          <Routes>
            {/* Define Routes for pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/signUp" element={<SignupForm />} />
            <Route path="/signIn" element={<LoginForm />} />
            <Route path="/admin/home" element={<AdminHome />} />
            <Route path="/admin/unverify-user" element={<Adminverifyuser />} />

            <Route path="/dashboard" element={<Dashboard />} />
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
    marginLeft: '200px',
    width: 'calc(100% - 200px)',
    height: '100vh',
    overflowY: 'auto',
    width: '100%',
    height: '100vh'
  },
};

export default App;
