import React from "react";
import { NavLink } from "react-router-dom";

const activeStyle = {
  color: "purple",
};

const Header = () => {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <NavLink to="/">
              <img alt="Carved Rock Fitness" src="/images/logo.png" />
            </NavLink>
          </li>
          <li>
            <NavLink to="/shoes" activeStyle={activeStyle} >
              Shoes
            </NavLink>
          </li>
          <li>
            <NavLink to="/cart" activeStyle={activeStyle}>
              Cart
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;