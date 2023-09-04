import { Routes, Route, Link, BrowserRouter as Router } from "react-router-dom";

import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import Details from "./pages/Details/Details";
import Checkout from "./pages/Checkout/Checkout";
import SuccessPage from "./pages/SuccessPage/SuccessPage";

import "./App.css";
// import "./lib/collect/collect";

// window.chargeEndpoint = 'https://5355-91-244-50-230.ngrok-free.app/collect/charge';
// window.chargeEndpoint = 'http://localhost:1347/collect/charge';

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
