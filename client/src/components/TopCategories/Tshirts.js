import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, SimpleGrid, Image, Text, IconButton } from "@chakra-ui/react";
import "./Tshirts.css";
import MenTshirtbanner from "../../assets/Tshirtsmenbanner.png";
import WomenenTshirtbanner from "../../assets/girlstshirt.webp";

const Tshirts = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const gender = searchParams.get("gender") || "Men"; // Get gender from URL
  const banners = {
    Men: {
      img: MenTshirtbanner,
      title: "Tshirts",
      subtitle: "Your everyday go-to",
    },
    Women: {
      img: WomenenTshirtbanner,
      title: "Trendy Tees",
      subtitle: "Stylish & Comfortable",
    },
  };

  // Get product list from Redux state (Assuming product list is stored in Redux)
  const productList = useSelector((state) => state.productList);
  // const { products } = productList;
  const products = productList?.products || [];


  // Filter only T-Shirts from the product list (Show only 4)
  const tshirts = products
    .filter(
      (product) =>
        product.productdetails?.subcategory === "Shirts" &&
        product.productdetails?.gender === gender
    )
    .slice(0, 5);

  return (
    <div className="categor-container">
      {/* 📌 Banner Section */}
      <div className="banner">
        <img
          src={banners[gender].img}
          alt={`${gender} Shirts`}
          className="banner-img"
        />
      </div>
      {/* 📌 Product List */}

      <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={10} p={4}>
        {tshirts.length > 0 ? (
          tshirts.map((product) => {
            return (
              <Box
                key={product._id}
                borderRadius="xl"
                overflow="hidden"
                color="black"
                width="270px"
                height="490px"
                position="relative"
              >
                {/* Product Image */}
                <Link to={`/product/${product._id}`}>
                  <Box height="380px" width="100%" overflow="hidden">
                    {/* Discount Badge on Top-Left */}
                    {product.discount > 0 && (
                      <div className="discountBadge">
                        <span>{product.discount}%</span>
                        <span>OFF</span>
                      </div>
                    )}
                    <Image
                      src={product.images[0]}
                      alt={product.description}
                      objectFit="cover"
                      width="100%"
                      height="100%"
                      borderRadius="xl"
                    />
                  </Box>
                </Link>

                {/* Product Details */}
                <Box p={4} color="white">
                  <Link to={`/product/${product._id}`}>
                    <Text
                      fontSize="lg"
                      fontWeight="80px"
                      color="black"
                      textTransform="uppercase"
                      mb={2}
                    >
                      {product.brandname}
                    </Text>
                    <Text
                      fontSize="lg"
                      fontWeight="medium"
                      color="black"
                      mb={2}
                    >
                      {product.description}
                    </Text>
                  </Link>

                  {/* Price Section */}
                  <Box display="flex" alignItems="center" mt={2}>
                    {product.oldPrice && product.oldPrice > product.price && (
                      <Text
                        as="span"
                        fontSize="sm"
                        color="gray.500"
                        textDecoration="line-through"
                        mr={2}
                      >
                        Rs. {product.oldPrice}
                      </Text>
                    )}
                    <Text
                      as="span"
                      fontSize="lg"
                      fontWeight="medium"
                      color="black"
                    >
                      Rs. {product.price}
                    </Text>
                  </Box>
                </Box>
              </Box>
            );
          })
        ) : (
          <p className="no-products">No Shirts available.</p>
        )}
      </SimpleGrid>
    </div>
  );
};

export default Tshirts;
