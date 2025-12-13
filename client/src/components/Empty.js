import React, { useState } from "react";
import { RiArrowRightSLine } from "react-icons/ri";
import { BsArrowBarRight } from "react-icons/bs";
import emptyCart from "../assets/emptyCart.svg";
import "./Empty.css"; // Import updated CSS
import { Link } from "react-router-dom";

const Empty = () => {
  const [arrow, setArrow] = useState(false);

  return (
    <div className="emptycart">
      <img src={emptyCart} alt="Empty Cart" />

      <h2>Oops! Your cart is empty </h2>

      <Link
        to="/"
        className="goshop"
        onMouseOver={() => setArrow(true)}
        onMouseLeave={() => setArrow(false)}
      >
        Go Shop
        {!arrow ? (
          <RiArrowRightSLine className="arrow" />
        ) : (
          <BsArrowBarRight className="arrow" />
        )}
      </Link>
    </div>
  );
};

export default Empty;
