import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, SimpleGrid } from "@chakra-ui/react";
import "./Tshirts.css";
import MenTshirtbanner from "../../assets/banner1.jpeg";

const API = process.env.REACT_APP_API_URL;

const ProductCard = ({ product }) => (
  <Box className="product-card">
    <Link to={`/product/${product._id}`}>
      <div className="product-image-wrapper">
        {product.discount > 0 && (
          <div className="discountBadge">
            <span>{product.discount}%</span>
            <span>OFF</span>
          </div>
        )}
        <img src={`${API}/${product.images[0]}`} alt={product.description} />
      </div>
    </Link>

    <div className="product-details">
      <Link to={`/product/${product._id}`}>
        <p className="product-title">{product.brandname}</p>
        <p className="product-description">{product.description}</p>
      </Link>

      <div className="price-row">
        {product.isSubscriptionApplied && product.subscriptionPrice ? (
          <>
            <span className="old-price">Rs. {product.price}</span>
            <span className="product-price">{product.subscriptionPrice}</span>
          </>
        ) : (
          <>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="old-price">Rs. {product.oldPrice}</span>
            )}
            <span className="product-price">{product.price}</span>
          </>
        )}
      </div>

      {product.isSubscriptionApplied && product.subscriptionPrice && (
        <p className="subscription-badge">
          {product.subscriptionDiscountPercent}% OFF with Subscription
        </p>
      )}
    </div>
  </Box>
);

const Tshirts = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const gender = searchParams.get("gender") || "Men";

  const [showcases, setShowcases] = useState([]);

  useEffect(() => {
    axios
      .get(`${API}/api/showcases?gender=${gender}`)
      .then((res) => setShowcases(res.data))
      .catch((err) => console.error(err));
  }, [gender]);

  // ---------- Fallback (old behaviour) ----------
  const productList = useSelector((state) => state.productList);
  const products = productList?.products || [];

  const getFourProducts = (list, startIndex) => {
    const topFour = list.slice(0, 4);
    const selected = list.slice(startIndex, startIndex + 4);
    if (selected.length < 4) {
      return [...selected, ...topFour.slice(0, 4 - selected.length)];
    }
    return selected;
  };

  const fallbackProducts = getFourProducts(products, 0);

  // ---------- Showcases from admin ----------
  if (showcases.length > 0) {
    return (
      <div className="categor-container">
        {showcases.map((s) => {
          const link =
            `/products?gender=${s.gender}&category=${encodeURIComponent(s.category)}` +
            (s.subcategory ? `&subcategory=${encodeURIComponent(s.subcategory)}` : "");

          return (
            <div key={s._id} className="showcase-block">
              <Link to={link}>
                <div className="banner">
                  <img
                    src={`${API}/${s.bannerUrl}`}
                    alt={s.title || s.category}
                    className="banner-img"
                  />
                </div>
              </Link>

              <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={6} p={4}>
                {s.products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </SimpleGrid>
            </div>
          );
        })}
      </div>
    );
  }

  // ---------- Fallback render ----------
  return (
    <div className="categor-container">
      <div className="banner">
        <img src={MenTshirtbanner} alt={`${gender} Tshirts`} className="banner-img" />
      </div>

      <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={6} p={4}>
        {fallbackProducts.length > 0 ? (
          fallbackProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p className="no-products">No Shirts available.</p>
        )}
      </SimpleGrid>
    </div>
  );
};

export default Tshirts;