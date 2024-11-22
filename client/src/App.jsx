import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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
import ScientistHome from "./Pages/ScientistHome";
import "./App.css"; // Import the CSS

function AppLayout({ children }) {
  const location = useLocation();

  // List of routes without Sidebar and NavBar
  const noLayoutRoutes = ["/signin", "/signup"];

  const isNoLayoutRoute = noLayoutRoutes.includes(location.pathname);

  return (
    <div className="container2">
      {!isNoLayoutRoute && <Sidebar />}
      <div className="content">
        {!isNoLayoutRoute && <NavBar />}
        {children}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout>
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

          {/* Scientist Routes */}
          <Route path="/scientist/home" element={<ScientistHome />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
