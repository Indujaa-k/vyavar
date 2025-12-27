import React from "react";
import { FiFacebook, FiInstagram, FiYoutube } from "react-icons/fi";
import { AiOutlineTwitter, AiFillLinkedin } from "react-icons/ai";
import logo from "../../assets/vyavarlogo.jpg";
import "./footercss.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footerCmp">
      <footer>
        <div className="footerLogo">
          <img src={logo} alt="Show Some Love" className="logo" />
          <p className="logoTagline">Men’s Wear – T-Shirts & Shirts</p>
          <p className="logoQuote">“Style meets Comfort, Every Day”</p>
        </div>

        <div className="fooHelp">
          <h1>Help</h1>
          <ul>
            <li>FAQs</li>
            <li><Link to="/contactus">Contact us</Link></li>
            <li><Link to="/about">About</Link></li>
            <li>Track Order</li>
          </ul>
        </div>

        <div className="footerCategorie">
          <h1>TopCategories</h1>
          <ul>
            <li><Link to="/?gender">TopWear</Link></li>
            <li><Link to="/?gender">Bottom wear</Link></li>
            <li><Link to="/?gender">Athleisure</Link></li>
            <li><Link to="/?gender">Co-ords</Link></li>
            <li><Link to="/?gender">Dresses</Link></li>
            <li><Link to="/?gender">Sleep Wear</Link></li>
            <li><Link to="/?gender">Inner wear</Link></li>
            <li><Link to="/?gender">Jumpsuits</Link></li>
          </ul>
        </div>

        <div className="fooHelp">
          <h1>About Us</h1>
          <ul><li><Link to="/about">About</Link></li></ul>
        </div>

        <div className="fooHelp">
          <h1>Policies</h1>
          <ul>
            <li><Link to="/">Terms and Conditions</Link></li>
            <li><Link to="/">Privacy Policy</Link></li>
          </ul>
        </div>
      </footer>

      <div className="paragraphFooter">
        <p>Copyright ©2025 Palette Productions All Rights Reserved</p>
      </div>

      {/* Social Media Icons */}
      <div className="footerIcons">
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"><FiFacebook style={{ color: "black", fontSize: "20px" }} /></a>
        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"><AiOutlineTwitter style={{ color: "black", fontSize: "20px" }} /></a>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"><FiInstagram style={{ color: "black", fontSize: "20px" }} /></a>
        <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer"><FiYoutube style={{ color: "black", fontSize: "20px" }} /></a>
        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer"><AiFillLinkedin style={{ color: "black", fontSize: "20px" }} /></a>
      </div>
    </div>
  );
};

export default Footer;
