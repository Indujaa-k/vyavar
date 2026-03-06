import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, SimpleGrid } from "@chakra-ui/react";
import "./Tshirts.css";
import MenTshirtbanner from "../../assets/banner1.jpeg";

const Tshirts = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const gender = searchParams.get("gender") || "Men";

  const banners = {
    Men: {
      img: MenTshirtbanner,
      title: "Tshirts",
      subtitle: "Your everyday go-to",
    },
  };

  const productList = useSelector((state) => state.productList);
  const products = productList?.products || [];

  const getFourProducts = (products, startIndex) => {
    const topFour = products.slice(0, 4);
    const selected = products.slice(startIndex, startIndex + 4);
    if (selected.length < 4) {
      const remaining = 4 - selected.length;
      return [...selected, ...topFour.slice(0, remaining)];
    }
    return selected;
  };

  const tshirts = getFourProducts(products, 0);

  return (
    <div className="categor-container">
      {/* Banner */}
      <div className="banner">
        <img
          src={banners[gender].img}
          alt={`${gender} Tshirts`}
          className="banner-img"
        />
      </div>

      {/* Product Grid */}
      <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={6} p={4}>
        {tshirts.length > 0 ? (
          tshirts.map((product) => (
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
                  {product.isSubscriptionApplied &&
                  product.subscriptionPrice ? (
                    <>
                      <span className="old-price">Rs. {product.price}</span>
                      <span className="product-price">
                         {product.subscriptionPrice}
                      </span>
                    </>
                  ) : (
                    <>
                      {product.oldPrice && product.oldPrice > product.price && (
                        <span className="old-price">
                          Rs. {product.oldPrice}
                        </span>
                      )}
                      <span className="product-price"> {product.price}</span>
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
          ))
        ) : (
          <p className="no-products">No Shirts available.</p>
        )}
      </SimpleGrid>
    </div>
  );
};

export default Tshirts;
