import React from "react";
import "./Bestselling.css";
import { useNavigate } from "react-router-dom";
import WImg1 from "../../assets/womenbs1.png";
import WImg2 from "../../assets/womenbs2.png";
import WImg3 from "../../assets/womenbs3.png";
import WImg4 from "../../assets/womenbs4.png";
import MImg1 from "../../assets/menbs1.png";
import MImg2 from "../../assets/menbs2.png";
import MImg3 from "../../assets/menbs3.png";
import MImg4 from "../../assets/menbs4.png";
import WomenVideo from "../../assets/menadvideo.mp4";
import MenVideo from "../../assets/womenadvideo.mp4";

const Bestselling = ({ category }) => {
  const navigate = useNavigate();
  const mencategories = [
    { imgSrc: MImg1, brand: "Nike" },
    { imgSrc: MImg2, brand: "Puma" },
    { imgSrc: MImg3, brand: "Allensolley" },
    { imgSrc: MImg4, brand: "Tommyhilfigher" },
  ];
  const womencategories = [
    { imgSrc: WImg1, brand: "Nike" },
    { imgSrc: WImg2, brand: "Puma" },
    { imgSrc: WImg3, brand: "Allensolley" },
    { imgSrc: WImg4, brand: "Tommyhilfigher" },
  ];

  const selectedCategories =
    category === "Men" ? mencategories : womencategories;

  // Conditional video source
  const videoSrc = category === "Men" ? MenVideo : WomenVideo;
  const handleCardClick = (brand) => {
    navigate(`/products?brandname=${brand}&gender=${category}`);
  };

  return (
    <div className="bestselling">
      <h2 className="bestselling-title">Best Selling Brands</h2>
      <div className="bestselling-container">
        {/* Video on the left side */}
        <div className="bestselling-video">
          <video src={videoSrc} autoPlay muted loop className="video-element" />
        </div>

        {/* Categories on the right side */}
        <div className="bestselling-categories">
          <div className="categories-grid">
            {selectedCategories.map((category, index) => (
              <div
                className="category-card"
                key={index}
                onClick={() => handleCardClick(category.brand)}
              >
                <img
                  src={category.imgSrc}
                  alt={`Category ${index + 1}`}
                  className="category-image"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bestselling;
