import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import "../Nav.css";

const Categorylist = ({ isMobile, onItemClick }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const gender = searchParams.get("gender") || "Men";
  const API_URL = process.env.REACT_APP_API_URL;
  const [categoryMap, setCategoryMap] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${API_URL}/api/products/categories${gender ? `?gender=${gender}` : ""}`,
        );
        setCategoryMap(data); // ✅ already { cat: [sub1, sub2] } — no client-side processing needed
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [gender]);

  const categories = Object.entries(categoryMap); // [[catName, [sub1, sub2]], ...]

  return (
    <div className="category-contain">
      {loading ? (
        <p className="category-loading">Loading...</p>
      ) : categories.length > 0 ? (
        <div className={`dropdown-menu ${isMobile ? "mobile" : ""}`}>
          <div className="category-contain">
            {categories.map(([catName, subcategories], index) => (
              <div key={index} className="category-column">
                <h4>
                  <NavLink
                    to={`/products?gender=${gender}&category=${encodeURIComponent(catName)}`}
                    onClick={onItemClick}
                  >
                    {catName}
                  </NavLink>
                </h4>
                <ul>
                  {subcategories.length > 0 ? (
                    subcategories.map((sub, subIndex) => (
                      <li key={subIndex}>
                        <NavLink
                          to={`/products?gender=${gender}&category=${encodeURIComponent(
                            catName,
                          )}&subcategory=${encodeURIComponent(sub)}`}
                          onClick={onItemClick}
                        >
                          {sub}
                        </NavLink>
                      </li>
                    ))
                  ) : catName.toLowerCase() === "combo" ? (
                    <li>
                      <NavLink
                        to={`/products?gender=${gender}&category=Combo`}
                        onClick={onItemClick}
                      >
                        View Combos
                      </NavLink>
                    </li>
                  ) : (
                    <li>No subcategories</li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No categories available.</p>
      )}
    </div>
  );
};

export default Categorylist;
