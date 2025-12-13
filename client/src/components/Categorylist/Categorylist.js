import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import "../Nav.css";
const Categorylist = () => {
  // Define Men and Women categories
  const menCategories = [
    {
      name: "Topwear",
      subcategories: ["T-Shirts", "Shirts", "Sweatshirts", "Jackets"],
    },
    { name: "Bottomwear", subcategories: ["Jeans", "Pants", "Shorts"] },
    { name: "Hoodies", subcategories: ["Hooded Sweatshirts", "Zip Hoodies"] },
    { name: "Innerwear", subcategories: ["Boxers", "Briefs", "Vests"] },
    { name: "Shirts", subcategories: ["Shirts", "Briefs", "Vests"] },
  ];

  const womenCategories = [
    {
      name: "Clothing",
      subcategories: ["Tops", "Casual Shirts", "Formal Shirts"],
    },
    { name: "Bottomwear", subcategories: ["Pants", "Pants", "Straight"] },
    { name: "Pants", subcategories: ["Shorts", "Pants", "Cargo Pants"] },
    { name: "Shorts", subcategories: ["Denim Shorts", "Cotton Shorts"] },
    { name: "Innerwear", subcategories: ["Cotton", "Fleece"] },
  ];

  // Get the query parameters using the location hook
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const gender = searchParams.get("gender") || "Men"; // Retrieve gender query param

  // Show categories based on the gender value
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
                {category.subcategories.map((sub, subIndex) => (
                  <li key={subIndex}>
                    <NavLink
                      to={`/products?gender=${gender}&category=${encodeURIComponent(
                        category.name
                      )}&subcategory=${encodeURIComponent(sub)}`}
                    >
                      {sub}
                    </NavLink>
                  </li>
                ))}
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
