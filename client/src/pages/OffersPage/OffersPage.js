import React from "react";
import "./OffersPage.css";
import { useNavigate } from "react-router-dom";
import Offerimg1 from "../../assets/Offerimg.png";
import Offerimg2 from "../../assets/Offerimg2.png";
import Offerimg3 from "../../assets/Offerimg3.png";
import Offerimg4 from "../../assets/Offerimg4.png";
import womenOfferimg1 from "../../assets/offerf1.webp";
import womenOfferimg2 from "../../assets/offerf2.webp";
import womenOfferimg3 from "../../assets/offerf3.webp";
import womenOfferimg4 from "../../assets/offerf4.webp";

const OffersPage = ({ category }) => {
  const navigate = useNavigate();
  const mencategories = [
    { name: "under 499", imgSrc: Offerimg1, offerfilter: "under499" },
    { name: "under 1499", imgSrc: Offerimg2, offerfilter: "under1499" },
    { name: "upto 50%", imgSrc: Offerimg3, offerfilter: "upto50" },
    { name: "upto 70%", imgSrc: Offerimg4, offerfilter: "upto70" },
  ];
  const womencategories = [
    { name: "under 499", imgSrc: womenOfferimg1, offerfilter: "under499" },
    { name: "under 1499", imgSrc: womenOfferimg2, offerfilter: "under1499" },
    { name: "upto 50%", imgSrc: womenOfferimg3, offerfilter: "upto50" },
    { name: "upto 70%", imgSrc: womenOfferimg4, offerfilter: "upto70" },
  ];
  const selectedCategories =
    category === "Men" ? mencategories : womencategories;
  const handleCardClick = (offerfilter) => {
    navigate(`/products?offerfilter=${offerfilter}&gender=${category}`);
  };

  return (
    <div className="offers">
      <h2>Offers</h2>
      <div className="offers-grid">
        {selectedCategories.map((offer, index) => (
          <div
            className="offerscard"
            key={index}
            onClick={() => handleCardClick(offer.offerfilter)}
          >
            <div className="offersimage">
              <img src={offer.imgSrc} alt={offer.name} />
              <div className="quick-pick-name">{offer.name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OffersPage;
