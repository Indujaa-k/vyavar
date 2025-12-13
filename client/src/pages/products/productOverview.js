import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listProducts } from "../../actions/productActions";
import {
  Box,
  Button,
  Text,
  Stack,
  SimpleGrid,
  Card,
  CardBody,
  Image,
  Heading,
  Badge,
  IconButton,
  useBreakpointValue,
  Center,
} from "@chakra-ui/react";
import { AiFillStar } from "react-icons/ai";
import HashLoader from "react-spinners/HashLoader";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

const ProductOverview = () => {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);

  useEffect(() => {
    let filtered;
    if (selectedCategory === "Top Selling") {
      filtered = products.filter((product) => product.sales > 100); // Example filter for top-selling
    } else if (selectedCategory === "Low Selling") {
      filtered = products.filter((product) => product.sales <= 10); // Example filter for low-selling
    } else if (selectedCategory === "Out of Stock") {
      filtered = products.filter((product) => product.countInStock < 5); // Example filter for out of stock
    } else {
      filtered = products; // Show all products if no filter is selected
    }
    setFilteredProducts(filtered);
  }, [selectedCategory, products]);

  const columnCount = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 4 });

  return (
    <Box bg="white" p={4} mt={20}>
      <h1 className="titlepanel">Products</h1>

      <Heading as="h2" size="lg" textAlign="center" mb={6}>
        {selectedCategory} Products
      </Heading>

      <Stack direction="row" spacing={4} justify="center" mb={6}>
        <Button
          onClick={() => setSelectedCategory("Top Selling")}
          colorScheme="teal"
          variant="outline"
          _hover={{ bg: "teal.500", color: "white" }}
        >
          Top Selling
        </Button>
        <Button
          onClick={() => setSelectedCategory("Low Selling")}
          colorScheme="red"
          variant="outline"
          _hover={{ bg: "red.500", color: "white" }}
        >
          Low Selling
        </Button>
        <Button
          onClick={() => setSelectedCategory("Out of Stock")}
          colorScheme="orange"
          variant="outline"
          _hover={{ bg: "orange.500", color: "white" }}
        >
          Out of Stock
        </Button>
        <Button
          onClick={() => setSelectedCategory("All")}
          colorScheme="blue"
          variant="outline"
          _hover={{ bg: "blue.500", color: "white" }}
        >
          All Products
        </Button>
      </Stack>

      {loading ? (
        <div className="loading">
          <HashLoader color={"#1e1e2c"} size={40} />
        </div>
      ) : error ? (
        <Text color="red.500">
          {error.message || "An unknown error occurred"}
        </Text>
      ) : filteredProducts.length === 0 ? (
        <Center>
          <Text fontSize="xl" color="gray.500">
            No Products Available
          </Text>
        </Center>
      ) : (
        <SimpleGrid columns={columnCount} spacing={4}>
          {filteredProducts.map((product) => (
            <Card
              key={product._id}
              borderWidth="1px"
              borderRadius="md"
              boxShadow="xl"
              p={4}
              _hover={{ boxShadow: "2xl", cursor: "pointer" }}
            >
              <CardBody>
                <Image
                  src={product.images[0] || "/placeholder-image.jpg"}
                  alt={product.brandname}
                  borderRadius="md"
                  mb={4}
                  objectFit="cover"
                  boxSize="150px"
                  mx="auto"
                />
                <Heading as="h4" size="md" mb={2} textAlign="center">
                  {product.brandname}
                </Heading>
                <Text
                  mb={4}
                  fontWeight="bold"
                  color="teal.500"
                  textAlign="center"
                >
                  ${product.price}
                </Text>
                <Stack
                  direction="row"
                  align="center"
                  spacing={2}
                  mb={4}
                  justify="center"
                >
                  <AiFillStar color="gold" />
                  <Text>{product.rating}</Text>
                </Stack>
                <Badge
                  colorScheme="green"
                  mb={2}
                  display="block"
                  textAlign="center"
                >
                  {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                </Badge>
                <Link to={`/product/${product._id}`}>
                  <Button colorScheme="blue" size="sm" mt={4} w="full">
                    View Details
                  </Button>
                </Link>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default ProductOverview;
