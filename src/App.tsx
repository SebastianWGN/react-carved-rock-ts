import React, { useState, useEffect } from "react";
import "./App.css";
import Footer from "./Footer";
import Header from "./Header";
import Products from "./Products";
import { Route, Routes } from "react-router-dom";
import Detail from "./Detail";
import Cart from "./Cart";
import Checkout from "./Checkout";


interface CartItm{
  id: string
  sku: string
  quantity: number
}


export default function App() {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) ?? [];
    } catch {
      console.error("The cart could not be parsed into JSON.");   
      return [];
    }
  });

  useEffect(() => localStorage.setItem("cart", JSON.stringify(cart)), [cart]);

  function addToCart(id:number, sku:string) {
    setCart((items:Array<CartItm>) => {
      const itemInCart = items.find((i) => i.sku === sku);
      if (itemInCart) {
        // Return new array with the matching item replaced
        return items.map((i) =>
          i.sku === sku ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        // Return new array with the new item appended
        return [...items, { id, sku, quantity: 1 }];
      }
    });
  }

  function updateQuantity(sku:string, quantity:number) {
    setCart((items:any) => {
      return quantity === 0
        ? items.filter((i:any) => i.sku !== sku)
        : items.map((i:any) => (i.sku === sku ? { ...i, quantity } : i));
    });
  }

  function emptyCart() {
    setCart([]);
  }

  return (
    <>
      <div className="content">
        <Header/>
          <Routes>
            <Route path="/">
              <h1>Welcome to Carved Rock Fitness</h1>
            </Route>
            <Route path="/cart">
              <Cart cart={cart} updateQuantity={updateQuantity}/>
            </Route> 
            <Route
              path="/checkout">
              <Checkout cart={cart} emptyCart={emptyCart} />
            </Route>
            <Route path="/:category/:id">
              <Detail addToCart={addToCart} />
            </Route>
            <Route path="/:category">
              <Products/>
            </Route>
          </Routes>
      </div>
      <Footer />
    </>
  );
}

