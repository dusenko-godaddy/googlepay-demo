import { useCart } from "react-use-cart";

import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import "./ProductTable.css";

const ProductsTable = () => {
  const { items, cartTotal, removeItem } = useCart();

  return (
   <div className="products-table">
    <h2>Your order:</h2>
    <table>
      <thead>
        <tr className="products-table_headers">
          <th className="left">Name</th>
          <th className="left">Description</th>
          <th className="center">Price</th>
          <th className="center">Count</th>
          <th className="center bold">Total price</th>
          <th className="right">Actions</th>
        </tr>
      </thead>
      <tbody className="products-table_items">
        {items.map(item => {
          return (
            <tr className="products-table_item" key={item.id}>
              <td className="left">{item.name}</td>
              <td className="left">{item.description}</td>
              <td className="center">{item.price}$</td>
              <td className="center">{item.quantity}</td>
              <td className="center bold">{item.itemTotal}$</td>
              <td className="right action">
                <FontAwesomeIcon 
                  onClick={() => removeItem(item.id)} 
                  className="fa-lg" 
                  icon={faTimes} 
                />
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
    <p className="products-table_total">Subtotal: <span>{cartTotal}$</span></p>
   </div>
  );
}

export default ProductsTable;
