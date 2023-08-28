import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

import "./CartIcon.css";

const CartIcon = ({totalItems}) => {
  return (
    <Link to="/cart" className="cart">
      <FontAwesomeIcon className="fa-lg" icon={faShoppingCart} />
      <span className="cart-basket d-flex align-items-center justify-content-center">
        {totalItems}
      </span>
    </Link>
  );
};

export default CartIcon;
