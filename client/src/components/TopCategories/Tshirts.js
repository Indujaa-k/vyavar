import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, SimpleGrid, Image, Text } from "@chakra-ui/react";
import "./Tshirts.css";
import MenTshirtbanner from "../../assets/Tshirtsmenbanner.png";
import WomenenTshirtbanner from "../../assets/girlstshirt.webp";

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
    Women: {
      img: WomenenTshirtbanner,
      title: "Trendy Tees",
      subtitle: "Stylish & Comfortable",
    },
  };

  const productList = useSelector((state) => state.productList);
  const products = productList?.products || [];

  const tshirts = products
    .filter(
      (product) =>
        product.productdetails?.subcategory === "Shirts" &&
        product.productdetails?.gender === gender
    )
    .slice(0, 5);

  return (
    <div className="categor-container">
      {/* 🔹 Banner */}
      <div className="banner">
        <img
          src={banners[gender].img}
          alt={`${gender} Tshirts`}
          className="banner-img"
        />
      </div>

      {/* 🔹 Product Grid */}
      <SimpleGrid columns={{ base: 1, md: 3, lg: 4 }} spacing={6} p={4}>
        {tshirts.length > 0 ? (
          tshirts.map((product) => (
            <Box
              key={product._id}
              borderRadius="xl"
              overflow="hidden"
              bg="white"
              w="100%"
              maxW="280px"
              mx="auto"
            >
              {/* Image */}
              <Link to={`/product/${product._id}`}>
                <Box
                  h={{ base: "240px", md: "300px", lg: "360px" }}
                  overflow="hidden"
                >
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
                    w="100%"
                    h="100%"
                  />
                </Box>
              </Link>

              {/* Details */}
              <Box p={3}>
                <Link to={`/product/${product._id}`}>
                  <Text
                    fontSize="md"
                    fontWeight="semibold"
                    isTruncated
                    mb={1}
                  >
                    {product.brandname}
                  </Text>

                  <Text fontSize="sm" color="gray.600" noOfLines={2}>
                    {product.description}
                  </Text>
                </Link>

                {/* Price */}
                <Box mt={2}>
                  {product.isSubscriptionApplied &&
                  product.subscriptionPrice ? (
                    <>
                      <Text
                        fontSize="xs"
                        color="gray.500"
                        textDecoration="line-through"
                      >
                        Rs. {product.price}
                      </Text>

                      <Text fontSize="md" fontWeight="bold">
                        Rs. {product.subscriptionPrice}
                      </Text>

                      <Text fontSize="xs" color="green.500" fontWeight="bold">
                        {product.subscriptionDiscountPercent}% OFF with
                        Subscription
                      </Text>
                    </>
                  ) : (
                    <Box display="flex" gap={2} alignItems="center">
                      {product.oldPrice &&
                        product.oldPrice > product.price && (
                          <Text
                            fontSize="xs"
                            color="gray.500"
                            textDecoration="line-through"
                          >
                            Rs. {product.oldPrice}
                          </Text>
                        )}

                      <Text fontSize="md" fontWeight="bold">
                        Rs. {product.price}
                      </Text>
                    </Box>
                  )}
                </Box>
              </Box>
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
