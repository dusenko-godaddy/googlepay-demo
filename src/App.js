import { Routes, Route, Link, BrowserRouter as Router } from "react-router-dom";

import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import Details from "./pages/Details/Details";
import Checkout from "./pages/Checkout/Checkout";
import SuccessPage from "./pages/SuccessPage/SuccessPage";
import ApplePayTest1 from "./pages/ApplePayTest1/ApplePayTest1";
import ApplePayTest2 from "./pages/ApplePayTest2/ApplePayTest2";

import "./App.css";
// import "./lib/collect/collect";

// window.chargeEndpoint = 'https://5355-91-244-50-230.ngrok-free.app/collect/charge';
// window.chargeEndpoint = 'http://localhost:1347/collect/charge';
// window.logsEndpoint = 'https://975f-78-137-2-160.ngrok-free.app/logs';
// window.logsEndpoint = 'http://localhost:1347/logs';

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
          <Route path="/applepaytest1" element={<ApplePayTest1 /> } />
          <Route path="/applepaytest2" element={<ApplePayTest2 /> } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
