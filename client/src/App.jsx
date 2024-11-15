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
import SignupForm from "./Pages/SignUp";
import HomePage from "./Pages/HomePage"; // Example additional page
import AdminHome from "./Pages/AdminHome";
import Adminverifyuser from "./Pages/Admin-verify-user";

function App() {
  return (
    <Router>
      <Routes>
        {/* Define Routes for pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/admin/home" element={<AdminHome />} />
        <Route path="/admin/unverify-user" element={<Adminverifyuser />} />
      </Routes>
    </Router>
  );
}

export default App;
