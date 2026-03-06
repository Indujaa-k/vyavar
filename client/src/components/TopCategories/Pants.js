import React from "react";
import "./Tshirts.css";
import { Box, SimpleGrid } from "@chakra-ui/react";
import { useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Menpantbanner from "../../assets/banner2.jpeg";

const Pants = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const gender = searchParams.get("gender") || "Men";

  const banners = {
    Men: {
      img: Menpantbanner,
      title: "Pants",
      subtitle: "Style your way",
    },
  };

  const productList = useSelector((state) => state.productList);
  const products = productList?.products || [];

  const getFourProducts = (products, startIndex) => {
    const topFour = products.slice(0, 5);
    const selected = products.slice(startIndex, startIndex + 4);
    if (selected.length < 4) {
      const remaining = 4 - selected.length;
      return [...selected, ...topFour.slice(0, remaining)];
    }
    return selected;
  };

  const denim = getFourProducts(products, 4);

  return (
    <div className="cat-container">
      {/* Banner */}
      <div className="banner">
        <img
          src={banners[gender].img}
          alt={`${gender} Jeans`}
          className="banner-img"
        />
      </div>

      {/* Product Grid */}
      <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={6} p={4}>
        {denim.length > 0 ? (
          denim.map((product) => (
            <Box key={product._id} className="product-card">
              {/* Image */}
              <Link to={`/product/${product._id}`}>
                <div className="product-image-wrapper">
                  {product.discount > 0 && (
                    <div className="discountBadge">
                      <span>{product.discount}%</span>
                      <span>OFF</span>
                    </div>
                  )}
                  <img
                    src={`${process.env.REACT_APP_API_URL}/${product.images[0]}`}
                    alt={product.description}
                  />
                </div>
              </Link>

              {/* Details */}
              <div className="product-details">
                <Link to={`/product/${product._id}`}>
                  <p className="product-title">{product.brandname}</p>
                  <p className="product-description">{product.description}</p>
                </Link>

                <div className="price-row">
                  {product.oldPrice && product.oldPrice > product.price && (
                    <span className="old-price">Rs. {product.oldPrice}</span>
                  )}
                  <span className="product-price">Rs. {product.price}</span>
                </div>
              </div>
            </Box>
          ))
        ) : (
          <p className="no-products">No Products available.</p>
        )}
      </SimpleGrid>
    </div>
  );
};

export default Pants;
