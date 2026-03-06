import React from "react";
import "./QuickPicks.css";
import Menimg1 from "../../assets/categorybanner1.png";
import Menimg2 from "../../assets/categorybanner2.png";
import Menimg4 from "../../assets/categorybanner9.png";
import Menimg5 from "../../assets/categorybanner4.png";
import Menimg6 from "../../assets/categorybanner6.png";
import Menimg7 from "../../assets/categorybanner7.png";
import Menimg8 from "../../assets/categorybanner8.png";
import { useNavigate } from "react-router-dom";
const QuickPicks = ({ category }) => {
  const navigate = useNavigate();
  const mencategories = [
    { name: "Stand Tall", imgSrc: Menimg1, filter: "Stand Tall" },
    { name: "Explorer", imgSrc: Menimg2, filter: "Explorer" },
    { name: "Stay Stronger", imgSrc: Menimg4, filter: "Stay Stronger" },
    { name: "Explorer", imgSrc: Menimg5, filter: "Explorer" },
    { name: "Stay Stronger", imgSrc: Menimg6, filter: "Stay Stronger" },
    { name: "Stand Tall", imgSrc: Menimg7, filter: "Stand Tall" },
    { name: "Stand Tall", imgSrc: Menimg8, filter: "Stand Tall" },
  ];

  const selectedCategories = category === "Men" ? mencategories : [];
  // const handleCategoryClick = (filter) => {
  //   history.push(/products/${filter}?gender=${category});
  // };
  const handleCategoryClick = (filter) => {
    navigate(
      `/products?keyword=${encodeURIComponent(filter)}&gender=${encodeURIComponent(category)}`,
    );
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

export default QuickPicks;
