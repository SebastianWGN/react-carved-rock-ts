import React from "react";
import useFetchAll from "./services/useFetchAll";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";

interface Product{
  id:number
  name:string
  price:number
  image:string
  category:string
  description:string
  skus: Array<Sku>
}

interface Sku{
  sku:string
  size: number
}

interface CartItm{
  id: string
  sku: string
  quantity: number
}

interface CartProps{
   cart : Array<CartItm>, 
   updateQuantity : (sku:any, value: number)=> void
}

export default function Cart(props: CartProps) {
  const navigate = useNavigate();
  const urls = props.cart.map((i: CartItm) => `products/${i.id}`);
  const { data: products, loading, error } = useFetchAll(urls);

  function renderItem(itemInCart: CartItm) {
    const { id, sku, quantity } = itemInCart;
    const prod  = products.find(
      (p: Product) => p.id === parseInt(id)
    );
    const { size } = prod?.skus.find((s: Sku) => s.sku === sku)!;

    return (
      <li key={sku} className="cart-item">
        <img src={`/images/${prod?.image}`} alt={prod?.name} />
        <div>
          <h3>{prod?.name}</h3>
          <p>${prod?.price}</p>
          <p>Size: {size}</p>
          <p>
            <select
              aria-label={`Select quantity for ${prod?.name} size ${size}`}
              onChange={(e) => props.updateQuantity(sku, parseInt(e.target.value))}
              value={quantity}
            >
              <option value="0">Remove</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </p>
        </div>
      </li>
    );
  }

  if (loading) return <Spinner />;
  if (error) throw error;

  const numItemsInCart = props.cart.reduce((total: number, item: CartItm) => total + item.quantity, 0);

  return (
    <section id="cart">
      <h1>
        {numItemsInCart === 0
          ? "Your cart is empty"
          : `${numItemsInCart} Item${numItemsInCart > 1 ? "s" : ""} in My Cart`}
      </h1>
      <ul>{props.cart.map(renderItem)}</ul>
      {props.cart.length > 0 && (
        <button
          className="btn btn-primary"
          onClick={() => navigate("/checkout")}
        >
          Checkout
        </button>
      )}
    </section>
  );
}