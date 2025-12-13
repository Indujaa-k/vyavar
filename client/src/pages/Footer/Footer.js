import React from "react";
import { FiFacebook } from "react-icons/fi";
import { AiOutlineInstagram } from "react-icons/ai";
import { IoLogoYoutube } from "react-icons/io";
import { Input, Stack } from "@chakra-ui/react";
import logo from "../../assets/kids logo.png";
import "./footercss.css";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <div className="footerCmp">
      <footer>
        <div className="footerLogo">
          <img src={logo} alt="Show Some Love" className="logo" />
        </div>

        <div className="fooHelp">
          <h1>Help</h1>
          <ul>
            <li>FAQs</li>
            <li>
              <Link to="/contactus">Contact us</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>Track Order</li>
          </ul>
        </div>

        <div className="footerCategorie">
          <h1>Quick Links</h1>
          <ul>
            <li>
              <Link to="/?gender=Men">Boys</Link>
            </li>
            <li>
              <Link to="/?gender=Women">Girls</Link>
            </li>
          </ul>
        </div>
        <div className="footerCategorie">
          <h1>TopCategories</h1>
          <ul>
            <li>
              <Link to="/?gender">TopWear</Link>
            </li>
            <li>
              <Link to="/?gender">Bottom wear</Link>
            </li>
            <li>
              <Link to="/?gender">Athleisure</Link>
            </li>
            <li>
              <Link to="/?gender">Co-ords</Link>
            </li>
            <li>
              <Link to="/?gender">Dresses</Link>
            </li>
            <li>
              <Link to="/?gender">Sleep Wear</Link>
            </li>
            <li>
              <Link to="/?gender">Inner wear</Link>
            </li>
            <li>
              <Link to="/?gender">Jumpsuits</Link>
            </li>
          </ul>
        </div>

        <div className="fooHelp">
          <h1>About Us</h1>
          <ul>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </div>

        <div className="fooHelp">
          <h1>Policies</h1>
          <ul>
            <li>
              <Link to="/">Terms and Conditions</Link>
            </li>
            <li>
              <Link to="/">Privacy Policy</Link>
            </li>
          </ul>
        </div>
      </footer>
      <div className="paragraphFooter">
        <p>Copyright ©2025 Palette Productions All Rights Reserved</p>
      </div>
    </div>
  );
};

export default Footer;
