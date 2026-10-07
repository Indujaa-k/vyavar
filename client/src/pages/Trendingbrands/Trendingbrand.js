// import React from "react";
// import "./Trendingbrand.css";
// import Menimg1 from "../../assets/trendingbanner1.png";
// import Menimg2 from "../../assets/trendingbanner2.png";
// import Menimg3 from "../../assets/trendingbanner5.png";
// import Menimg4 from "../../assets/trendingbanner3.png";
// import { useNavigate } from "react-router-dom";

// const Trendingbrand = ({ category }) => {
//   const navigate = useNavigate();
//   const mencategories = [
//     { imgSrc: Menimg1, discount: "The Man", brand: "The Man" },
//     { imgSrc: Menimg2, discount: "The Man", brand: "The Man" },
//     { imgSrc: Menimg3, discount: "Rise Up", brand: "Rise Up" },
//     { imgSrc: Menimg4, discount: "Rise Up", brand: "Rise Up" },
//   ];
  
//   const selectedCategories =
//     category === "Men" ? mencategories : womencategories;
//   const handleCardClick = (brand) => {
//     navigate(`/products?brandname=${brand}&gender=${category}`);
//   };

//   return (
//     <div className="brand">
//       <h2>Embroidery Tees</h2>
//       <div className="brand-grid">
//         {selectedCategories.map((category, index) => (
//           <div
//             className="brand-card"
//             key={index}
//             onClick={() => handleCardClick(category.brand)}
//           >
//             <div className="brand-image">
//               <img src={category.imgSrc} alt={category.name} />
//             </div>
//             <div className="brand-details">
//               <p>{category.discount}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Trendingbrand;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Trendingbrand.css";

const Trendingbrand = ({ category }) => {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);

  useEffect(() => {
    axios
      .get(`/api/trending-cards?gender=${category}`)
      .then((res) => setCards(res.data))
      .catch((err) => console.error(err));
  }, [category]);

  return (
    <div className="brand">
      <h2>Embroidery Tees</h2>
      <div className="brand-grid">
        {cards.map((item) => (
          <div
            className="brand-card"
            key={item._id}
            onClick={() => navigate(item.link)}
          >
            <div className="brand-image">
              {item.mediaType === "video" ? (
                <video src={`/${item.mediaUrl}`} autoPlay muted loop playsInline />
              ) : (
                <img src={`/${item.mediaUrl}`} alt={item.title} />
              )}
            </div>
            <div className="brand-details">
              <p>{item.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Trendingbrand;
