import React from "react";
import "./QuickPicks.css";
import Menimg1 from "../../assets/menimg1.png";
import Menimg2 from "../../assets/menimg2.png";
import Menimg3 from "../../assets/menimg3.png";
import Menimg4 from "../../assets/menimg4.png";
import Menimg5 from "../../assets/menimg5.png";
import Menimg6 from "../../assets/menimg6.png";
import Menimg7 from "../../assets/menimg7.png";
import Menimg8 from "../../assets/menimg8.png";
import Womenimg1 from "../../assets/quickg1.webp";
import Womenimg2 from "../../assets/quickg2.webp";
import Womenimg3 from "../../assets/quickg3.webp";
import Womenimg4 from "../../assets/quickg4.webp";
import Womenimg5 from "../../assets/quickg5.webp";
import Womenimg6 from "../../assets/quickg6.webp";
import Womenimg7 from "../../assets/quickg7.webp";
import Womenimg8 from "../../assets/quickg8.webp";
import { useNavigate } from "react-router-dom";
const QuickPicks = ({ category }) => {
  const navigate = useNavigate();
  const mencategories = [
    { name: "Top Wear", imgSrc: Menimg1, filter: "Topwear" },
    { name: "Bottom Wear", imgSrc: Menimg2, filter: "Bottomwear" },
    { name: "Graphic T-Shirts", imgSrc: Menimg3, filter: "graphic-tshirts" },
    { name: "Shirts", imgSrc: Menimg4, filter: "Shirts" },
    { name: "Hoodies & Jackets", imgSrc: Menimg5, filter: "Hoodies" },
    { name: "Co-ords", imgSrc: Menimg6, filter: "Coords" },
    { name: "Athleisure", imgSrc: Menimg7, filter: "Athleisure" },
    { name: "Innerwear", imgSrc: Menimg8, filter: "Innerwear" },
  ];
  const womencategories = [
    { name: "Top Wear", imgSrc: Womenimg1, filter: "Topwear" },
    { name: "Bottom Wear", imgSrc: Womenimg2, filter: "Bottomwear" },
    { name: "Dresses", imgSrc: Womenimg3, filter: "dresses" },
    { name: "Athleisure", imgSrc: Womenimg4, filter: "Athleisure" },
    { name: "Sleepwear", imgSrc: Womenimg5, filter: "sleepwear" },
    { name: "Innerwear", imgSrc: Womenimg6, filter: "Innerwear" },
    { name: "Co-ords", imgSrc: Womenimg7, filter: "Coords" },
    { name: "jumpsuits", imgSrc: Womenimg8, filter: "jumpsuits" },
  ];
  const selectedCategories =
    category === "Men" ? mencategories : womencategories;
  // const handleCategoryClick = (filter) => {
  //   history.push(/products/${filter}?gender=${category});
  // };
  const handleCategoryClick = (filter) => {
    navigate(`/products?category=${filter}&gender=${category}`); 
  };

  return (
    <div className="quick-picks">
      <h2>QUICK PICKS</h2>
      <div className="quick-picks-grid">
        {selectedCategories.map((item, index) => (
          <div
            className="quick-pick-card"
            key={index}
            onClick={() => handleCategoryClick(item.filter)}
          >
            <div className="quick-pick-image">
              <img src={item.imgSrc} alt={item.name} />
            </div>
            <div className="quick-pick-name">{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickPicks;