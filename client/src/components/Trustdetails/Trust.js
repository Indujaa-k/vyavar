import React from "react";
import "./Trust.css";
import lockIcon from "../../assets/trustimg1.svg";
import checkIcon from "../../assets/trustimg2.svg";
import tryBuyIcon from "../../assets/trustimg3.svg";
import heartIcon from "../../assets/trustimg4.svg";
import instaIcon from "../../assets/trustimg5.png";

const Trust = () => {
  return (
    <div className="Trust-details">
      <div className="trust-item">
        <img src={lockIcon} alt="Secure Payments" className="trust-image" />
        <span>Secure Payments</span>
      </div>
      <div className="trust-item">
        <img src={checkIcon} alt="Genuine Products" className="trust-image" />
        <span>Genuine Products</span>
      </div>
      <div className="trust-item">
        <img src={tryBuyIcon} alt="Try & Buy" className="trust-image" />
        <span>Try & Buy</span>
      </div>
      <div className="trust-item">
        <img src={heartIcon} alt="Show Some Love" className="trust-image" />
        <span>7 Day Return</span>
      </div>
      <div className="trust-item">
        <img src={instaIcon} alt="Show Some Love" className="insta-image" />
        <span>Show us some ❤️ on our social media</span>
      </div>
    </div>
  );
};

export default Trust;
