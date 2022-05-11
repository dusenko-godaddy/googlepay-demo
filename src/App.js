import { Routes, Route, Link, BrowserRouter as Router } from "react-router-dom";

import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import Details from "./pages/Details/Details";
import Checkout from "./pages/Checkout/Checkout";
import SuccessPage from "./pages/SuccessPage/SuccessPage";

import "./App.css";
import "./lib/collect/bundle";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app"s Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCFkJA6Jkm2jFlTCpxyhIZRVar07psnJw",
  authDomain: "pay-demo-9577e.firebaseapp.com",
  projectId: "pay-demo-9577e",
  storageBucket: "pay-demo-9577e.appspot.com",
  messagingSenderId: "978835034008",
  appId: "1:978835034008:web:83f6245e992c0cc846e5ed"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function App() {
  return (
    <Router>
      <Link to="/" className="header">
        <h1>GD Happy Merchant</h1>
      </Link>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/details/:id" element={<Details />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout /> } />
          <Route path="/success-page" element={<SuccessPage /> } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
