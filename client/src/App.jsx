// import "./App.css";
// // import { Badge } from "flowbite-react";
// import SignupForm from "./Pages/SignUp";
// import { Toaster } from "react-hot-toast";

// function App() {
//   return (
//     <>
//       <Toaster position="top-right" reverseOrder={false} />
//       <h1 className=" text-center text-2xl font-bold">
//         WELCOME TO SIGNUP PAGE
//       </h1>

//       <SignupForm />
//     </>
//   );
// }

// export default App;

import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import SignupForm from "./Pages/SignUp";
import HomePage from "./Pages/Home"; // Example additional page
import Admin from "./Pages/Admin";
import LoginForm from "./Pages/SignIn";
import Sidebar from "./Components/SideBar";
import Dashboard from "./Pages/Dashboard";

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
            <Route path="/signIn" element={<LoginForm />} />
            <Route path="/Admin" element={<Admin />} />

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
