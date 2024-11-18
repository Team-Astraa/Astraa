import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./Components/Routes/Private";
import Sidebar from "./Components/SideBar";
import NavBar from "./Components/NavBar";
import HomePage from "./Pages/HomePage";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import Dashboard from "./Pages/Dashboard";
import AdminHome from "./Pages/AdminHome";
import Adminverifyuser from "./Pages/Admin-verify-user";
import Adminverifyfish from "./Pages/Admin-verify-fish";
import Admindatauploadusers from "./Pages/Admin-data-upload-users";
import Adminmap from "./Pages/Admin-map";
import FishingMap from "./Pages/Admin-map";
import Loader from "./Components/Loader";
import ResearchMap from "./Pages/Researchmap";
import ResearchStats from "./Pages/ResearchStats";
import Addexcel from "./Pages/Add-excel";

function App() {
  return (
    <Router>
      <div style={styles.container}>
        <Sidebar />
        <div style={styles.content}>
          <NavBar />
          <Routes>
            {/* Public Routes */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Protected Routes */}
            <Route path="/" element={<PrivateRoute element={<HomePage />} />} />
            <Route
              path="/dashboard"
              element={<PrivateRoute element={<Dashboard />} />}
            />

            <Route path="/admin/home" element={<AdminHome />} />
            <Route path="/admin/unverify-user" element={<Adminverifyuser />} />
            <Route
              path="/admin/get-data-upload-user"
              element={<Admindatauploadusers />}
            />
            <Route
              path="/admin/unverify-fish-data/:userId"
              element={<Adminverifyfish />}
            />
            <Route path="/map" element={<FishingMap />} />
            <Route path="/data-upload" element={<Addexcel />} />

            {/* Researcher Routes */}

            <Route path="/Research/Map-data/:id" element={<ResearchMap />} />
            <Route
              path="/Research/statistics/:id"
              element={<ResearchStats />}
            />

            {/* <Route path="/signIn" element={<LoginForm />} /> */}
            {/* admin routes  */}
            {/* <Route path="/admin/home" element={<AdminHome />} />
            <Route path="/admin/unverify-user" element={<Adminverifyuser />} />
            <Route path="/admin/get-data-upload-user" element={<Admindatauploadusers />} />
            <Route path="/admin/unverify-fish-data/:id" element={<Adminverifyfish />} />

            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/map" element={<FishingMap />} /> */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

const styles = {
  container: {
    display: "flex",
  },
  content: {
    padding: "10px",
    marginLeft: "200px",
    width: "calc(100% - 200px)",
    height: "100vh",
    overflowY: "auto",
  },
};

export default App;
