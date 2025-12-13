import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Brandlist.css";

const Brandlist = () => {
  // Define the brands for Men and Women
  const menBrands = [
    "Nike",
    "Allensolley",
    "Bewakoof",
    "B For Bottoms",
    "Bharat Vibez",
  ];

  const womenBrands = [
    "TommyHilfigher",
    "Puma",
    "Beeglee",
    "Bharat Vibez",
    "Allensolley",
  ];
  // Get the query parameters using the location hook
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const gender = searchParams.get("gender") || "Men"; // Retrieve gender query param

  // Show categories based on the gender value
  const BrandsToShow =
    gender === "Men" ? menBrands : gender === "Women" ? womenBrands : [];

  return (
    <div className="brandlist-container">
      {/* Search input */}
      <div className="brand-search">
        <input
          type="text"
          placeholder="Search for Brands"
          className="search-input"
        />
      </div>

      {/* Alphabetized brands */}
      <div className="brand-alphabetized-list">
        <ul>
          {BrandsToShow.map((brandname, index) => (
            <li key={index}>
              <NavLink
                to={`/products?gender=${gender}&brandname=${encodeURIComponent(
                  brandname
                )}`}
                className="brand-link"
              >
                {brandname}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Brandlist;
