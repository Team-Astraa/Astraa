import { useState,useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
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
import DataTable from "./Pages/User-DataLogs";

// function AppLayout({ children }) {
//   const location = useLocation();
//   const [login, setlogin] = useState(false);
//   const user = localStorage.getItem("aquaUser");
//   if (user) {
//     setlogin(true);
//   }
//   // List of routes without Sidebar and NavBar
//   const noLayoutRoutes = ["/signin", "/signup"];

//   const isNoLayoutRoute = noLayoutRoutes.includes(
//     location.pathname.toLowerCase()
//   );
//   console.log(isNoLayoutRoute);

//   return (
//     <div className="container2">
//       {/* if path is sigin or signup && if logedin then only show sidebar */}
//       {!isNoLayoutRoute && <Sidebar />}&&{login && <Sidebar />}
//       <div
//         className={`${isNoLayoutRoute ? "" : "content"}`}
//         style={{ borderRadius: "2rem 0 0 2rem" }}
//       >
//         {!isNoLayoutRoute && <NavBar />}
//         {children}
//       </div>
//     </div>
//   );
// }

function AppLayout({ children }) {
  const location = useLocation();
  const [login, setLogin] = useState(false);
  const user = localStorage.getItem("aquaUser");

  useEffect(() => {
    if (user) {
      setLogin(true);
    } else {
      setLogin(false);
    }
  }, [user]);

  // List of routes without Sidebar and NavBar
  const noLayoutRoutes = ["/signin", "/signup"];
  const isNoLayoutRoute = noLayoutRoutes.includes(
    location.pathname.toLowerCase()
  );

  return (
    <div className="container2">
      {/* Render Sidebar only if user is logged in and not on a no-layout route */}
      {login && !isNoLayoutRoute && <Sidebar />}

      <div
        className={`${isNoLayoutRoute ? "" : "content"}`}
        style={{ borderRadius: "2rem 0 0 2rem" }}
      >
        {/* Render NavBar only if not on a no-layout route */}
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
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          {/* <Route path="/scientist/home" element={<ScientistHome />} /> */}

          {/* Protected Routes */}
          {/* <Route path="/" element={<PrivateRoute element={<HomePage />} />} /> */}
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
            path="/admin/unverify-fish-data/:userId/:dataId"
            element={<Adminverifyfish />}
          />
          <Route path="/map" element={<FishingMap />} />
          <Route path="/data-upload" element={<Addexcel />} />

          {/* Researcher Routes */}
          <Route path="/Research/Map-data/:id" element={<ResearchMap />} />
          <Route path="/Research/statistics/:id" element={<ResearchStats />} />
          <Route path="/data-logs" element={<DataTable />} />

          {/* Scientist Routes */}
          <Route path="/scientist/home" element={<ScientistHome />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
