import { useCart } from "react-use-cart";

import CartIcon from '../../components/CartIcon/CartIcon';
import ProductItem from '../../components/ProductItem/ProductItem';

import { products } from '../../lib/common/data';

import './Home.css';

const Home = () => {
  const { totalItems } = useCart();

  return (
    <div className="page">
      <CartIcon totalItems={totalItems}/>
      <div className="home_main">
        {products.map(product => {
          return <ProductItem product={product} key={product.id} />
        })}
      </div>
      <p id="collect"></p>
    </div>
  );
}

export default Home;