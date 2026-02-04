import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../../actions/productActions";
import {
  Box,
  Text,
  Stack,
  SimpleGrid,
  Card,
  CardBody,
  Image,
  Heading,
  Badge,
  Center,
  useBreakpointValue,
  Flex,
} from "@chakra-ui/react";
import { AiFillStar } from "react-icons/ai";
import HashLoader from "react-spinners/HashLoader";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
const API_URL = process.env.REACT_APP_API_URL;
const AdminProduct = () => {
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);
  useEffect(() => {
    if (products?.length) {
      console.log("product", products[0]);
    }
  }, [products]);

  console.log("Products from backend:", products);

  // Get top 8 most popular products (sorted by reviews)
  const mostPopularProducts = [...(products || [])]
    .sort((a, b) => (b.numReviews || 0) - (a.numReviews || 0))
    .slice(0, 6);

  // Get top 8 best-selling products (sorted by sold count)
  const topSellingProducts = [...(products || [])]
    .sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0))
    .slice(0, 5);
  // Calculate top 5 most popular brands
  const brandReviewCount = products?.reduce((acc, product) => {
    if (product.brandname) {
      acc[product.brandname] =
        (acc[product.brandname] || 0) + (product.numReviews || 0);
    }
    return acc;
  }, {});
  const mostPopularBrands = Object.entries(brandReviewCount || {})
    .sort((a, b) => b[1] - a[1]) // Sort by total reviews
    .slice(0, 5) // Get top 5 brands
    .map(([brandname, totalReviews]) => ({
      brandname,
      totalReviews,
      image:
        products.find((p) => p.brandname === brandname)?.images?.[0] ||
        "/placeholder-image.jpg",
    }));
  return (
    <Box bg="white" p={4} mt={20}>
      <Helmet>
        <title>Admin Dashboard - Products</title>
      </Helmet>

      {loading ? (
        <Center h="50vh">
          <HashLoader color="#3182CE" size={60} />
        </Center>
      ) : error ? (
        <Center>
          <Text color="red.500" fontSize="lg">
            {error}
          </Text>
        </Center>
      ) : (
        <Flex gap={6} flexWrap="wrap" justify="center">
          {/* Most Popular Products */}
          <Box flex="1" maxW="400px" p={4} boxShadow="xl" borderRadius="lg">
            <Heading size="md" mb={4} textAlign="center">
              🎗️ Most Reviewed Products
            </Heading>

            <Stack spacing={4}>
              {mostPopularProducts.map((product) => (
                <Link to={`/product/${product._id}`} key={product._id}>
                  <Card borderWidth="1px" borderRadius="md" p={3}>
                    <Flex align="center" gap={3}>
                      <Image
                        src={
                          product.images?.[0]
                            ? `${API_URL}/${product.images[0]}`
                            : "/placeholder-image.jpg"
                        }
                        alt={product.brandname}
                        borderRadius="md"
                        boxSize="50px"
                        objectFit="cover"
                      />

                      <Box flex="1">
                        <Text fontWeight="bold" noOfLines={1}>
                          {product.brandname}
                        </Text>
                        <Badge colorScheme="purple">
                          <Flex align="center" fontSize="sm" color="gray.600">
                            <AiFillStar color="gold" />
                            <Text ml={1}>
                              {product?.rating
                                ? Number(product.rating).toFixed(1)
                                : "N/A"}{" "}
                              ({product?.numReviews || 0}) Reviews
                            </Text>
                          </Flex>
                        </Badge>
                      </Box>
                    </Flex>
                  </Card>
                </Link>
              ))}
            </Stack>
          </Box>

          {/* Top Selling Products */}
          <Box flex="1" maxW="400px" p={4} boxShadow="xl" borderRadius="lg">
            <Heading size="md" mb={4} textAlign="center">
              🏆 Top Selling Products
            </Heading>
            <Stack spacing={4}>
              {topSellingProducts.map((product) => (
                <Link to={`/product/${product._id}`} key={product._id}>
                  <Card
                    key={product._id}
                    borderWidth="1px"
                    borderRadius="md"
                    p={3}
                  >
                    <Flex align="center" gap={3}>
                      <Image
                        src={
                          product.images?.[0]
                            ? `${API_URL}/${product.images[0]}`
                            : "/placeholder-image.jpg"
                        }
                        alt={product.brandname}
                        borderRadius="md"
                        boxSize="50px"
                      />
                      <Box flex="1">
                        <Text fontWeight="bold" noOfLines={1}>
                          {product.brandname}
                        </Text>
                      </Box>
                      <Badge colorScheme="blue">
                        Sold: {product.soldCount || 0}
                      </Badge>
                    </Flex>
                  </Card>
                </Link>
              ))}
            </Stack>
          </Box>
          {/* Most Popular Brands */}
          <Box flex="1" maxW="400px" p={4} boxShadow="xl" borderRadius="lg">
            <Heading size="md" mb={4} textAlign="center">
              🔥 Most Popular Products
            </Heading>
            <Stack spacing={4}>
              {mostPopularBrands.map((brand) => (
                <Card
                  key={brand.brandname}
                  borderWidth="1px"
                  borderRadius="md"
                  p={3}
                  _hover={{ shadow: "lg" }}
                >
                  <Flex align="center" gap={3}>
                    <Image
                      src={`${API_URL}/${brand.image}`}
                      alt={brand.brandname}
                      borderRadius="md"
                      boxSize="50px"
                    />
                    <Box flex="1">
                      <Text fontWeight="bold" noOfLines={1}>
                        {brand.brandname}
                      </Text>
                    </Box>
                    <Badge colorScheme="purple">
                      Reviews: {brand.totalReviews}
                    </Badge>
                  </Flex>
                </Card>
              ))}
            </Stack>
          </Box>
        </Flex>
      )}
    </Box>
  );
};

export default AdminProduct;
