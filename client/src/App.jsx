import "./App.css";
import { Badge } from "flowbite-react";
import SignupForm from "./Pages/Signup/SignUp";

function App() {
  return (
    <>
      <h1 className="t text-center text-lg">hii babe</h1>
      <Badge color="info">Default</Badge>
      <SignupForm />
    </>
  );
}

export default App;
