import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import "../Nav.css";

const Categorylist = () => {
  // Define Men and Women categories
  const menCategories = [
    
    {
      name: "Topwear",
      subcategories: [ "Regular", "Oversized", "Full Sleeve"],
    },
    { name: "Hoodies", subcategories: ["Hooded Sweatshirts", "Zip Hoodies"] },
    { name: "Combo", subcategories: [] }, // Combo has no subcategories
  ];

  const womenCategories = [
    {
      name: "Clothing",
      subcategories: ["Tops", "Casual Shirts", "Formal Shirts"],
    },
    { name: "Bottomwear", subcategories: ["Pants", "Straight"] },
    { name: "Combo", subcategories: [] }, // Added Combo for women too
  ];

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const gender = searchParams.get("gender") || "Men";

  const categoriesToShow =
    gender === "Men"
      ? menCategories
      : gender === "Women"
      ? womenCategories
      : [];

  return (
    <div className="category-contain">
      {categoriesToShow.length > 0 ? (
      <div className="dropdown-menu">
        {categoriesToShow.map((category, index) => (
          <div key={index} className="category-column">
            <h4>{category.name}</h4>
            <ul>
              {category.subcategories.length > 0 ? (
                category.subcategories.map((sub, subIndex) => (
                  <li key={subIndex}>
                    <NavLink
                      to={`/products?gender=${gender}&category=${encodeURIComponent(
                        category.name
                      )}&subcategory=${encodeURIComponent(sub)}`}
                    >
                      {sub}
                    </NavLink>
                  </li>
                ))
                ) : category.name.toLowerCase() === "combo" ? (
                <li>
                  <NavLink to={`/products?gender=${gender}&category=Combo`}>
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
      ) : (
        <p>No categories available.</p>
      )}
    </div>
  );
};

export default Categorylist;
