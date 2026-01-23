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
            <li>
              <Link to="/contactus">Contact us</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            {/* <li>Track Order</li> */}
          </ul>
        </div>

        <div className="footerCategorie">
          <h1>TopCategories</h1>
          <ul>
            <li>
              <Link to="/?gender">TopWear</Link>
            </li>
            <li>
              <Link to="/?gender">Hoodies</Link>
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
              <Link to="/terms">Terms and Conditions</Link>
            </li>
            <li>
              <Link to="/policy">Privacy Policy</Link>
            </li>
          </ul>
        </div>
      </footer>

      <div className="paragraphFooter">
        <p>
          Copyright © {new Date().getFullYear()} Viyavar | Developed By{" "}
          <a
            href="https://paletteproduction.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#ff4d6d", fontWeight: "600" }}
          >
            PALETTE PRODUCTION
          </a>
        </p>
      </div>

      {/* Social Media Icons */}
      <div className="footerIcons">
        <a
          href="https://www.facebook.com/share/p/17RiMftCXv/?mibextid=qi2Omg"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FiFacebook style={{ color: "black", fontSize: "20px" }} />
        </a>
        <a
          href="https://www.instagram.com/viyavarfashions?igsh=MXd3cXdyYnZkY3IwcA=="
          target="_blank"
          rel="noopener noreferrer"
        >
          <FiInstagram style={{ color: "black", fontSize: "20px" }} />
        </a>
        <a
          href="https://www.youtube.com/@viyavarfashions"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FiYoutube style={{ color: "black", fontSize: "20px" }} />
        </a>
        {/* <a
          href="https://www.linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <AiFillLinkedin style={{ color: "black", fontSize: "20px" }} />
        </a> */}
      </div>
    </div>
  );
};

export default Footer;
