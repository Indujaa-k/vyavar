import React from "react";
import "./Trendingbrand.css";
import Menimg1 from "../../assets/MTB1.png";
import Menimg2 from "../../assets/MTB2.png";
import Menimg3 from "../../assets/MTB3..png";
import Menimg4 from "../../assets/MTB4.png";
import Womenimg1 from "../../assets/WTB1.png";
import Womenimg2 from "../../assets/WTB2.png";
import Womenimg3 from "../../assets/WTB3.png";
import Womenimg4 from "../../assets/WTB4.png";
import { useNavigate } from "react-router-dom";

const Trendingbrand = ({ category }) => {
  const navigate = useNavigate();
  const mencategories = [
    { imgSrc: Menimg1, discount: "UPTO 70% Off", brand: "Nike" },
    { imgSrc: Menimg2, discount: "UPTO 70% Off", brand: "Puma" },
    { imgSrc: Menimg3, discount: "UPTO 60% Off", brand: "Allensolley" },
    { imgSrc: Menimg4, discount: "UPTO 70% Off", brand: "Tommyhilfigher" },
  ];
  const womencategories = [
    { imgSrc: Womenimg1, discount: "UPTO 70% Off", brand: "Nike" },
    { imgSrc: Womenimg2, discount: "UPTO 70% Off", brand: "Puma" },
    { imgSrc: Womenimg3, discount: "UPTO 60% Off", brand: "Allensolley" },
    { imgSrc: Womenimg4, discount: "UPTO 70% Off", brand: "Tommyhilfigher" },
  ];
  const selectedCategories =
    category === "Men" ? mencategories : womencategories;
  const handleCardClick = (brand) => {
    navigate(`/products?brandname=${brand}&gender=${category}`);
  };

  return (
    <div className="brand">
      <h2>Trending Brands</h2>
      <div className="brand-grid">
        {selectedCategories.map((category, index) => (
          <div
            className="brand-card"
            key={index}
            onClick={() => handleCardClick(category.brand)}
          >
            <div className="brand-image">
              <img src={category.imgSrc} alt={category.name} />
            </div>
            <div className="brand-details">
              <p>{category.discount}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Trendingbrand;
