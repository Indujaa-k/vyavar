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
  useBreakpointValue,
  Center,
} from "@chakra-ui/react";
import { AiFillStar } from "react-icons/ai";
import HashLoader from "react-spinners/HashLoader";
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

  // FILTER PRODUCTS
  useEffect(() => {
    let filtered = products || [];

    if (selectedCategory === "Top Selling") {
      filtered = filtered.filter((product) => product.sales > 100);
    }

    if (selectedCategory === "Low Selling") {
      filtered = filtered.filter((product) => product.sales <= 10);
    }

    if (selectedCategory === "Out of Stock") {
      filtered = filtered.filter((product) => {
        const totalStock =
          product.productdetails?.stockBySize?.reduce(
            (sum, s) => sum + s.stock,
            0
          ) || 0;

        return totalStock === 0;
      });
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

      {/* FILTER BUTTONS */}
      <Stack direction="row" spacing={4} justify="center" mb={6}>
        <Button onClick={() => setSelectedCategory("Top Selling")}>
          Top Selling
        </Button>
        <Button onClick={() => setSelectedCategory("Low Selling")}>
          Low Selling
        </Button>
        <Button onClick={() => setSelectedCategory("Out of Stock")}>
          Out of Stock
        </Button>
        <Button onClick={() => setSelectedCategory("All")}>
          All Products
        </Button>
      </Stack>

      {/* CONTENT */}
      {loading ? (
        <Center>
          <HashLoader size={40} />
        </Center>
      ) : error ? (
        <Text color="red.500">{error.message}</Text>
      ) : filteredProducts.length === 0 ? (
        <Center>
          <Text fontSize="xl" color="gray.500">
            No Products Available
          </Text>
        </Center>
      ) : (
        <SimpleGrid columns={columnCount} spacing={4}>
          {filteredProducts.map((product) => {
            const totalStock =
              product.productdetails?.stockBySize?.reduce(
                (sum, s) => sum + s.stock,
                0
              ) || 0;

            return (
              <Card
                key={product._id}
                borderWidth="1px"
                borderRadius="md"
                boxShadow="xl"
                p={4}
              >
                <CardBody>
                  <Image
                    src={product.images?.[0]}
                    alt={product.brandname}
                    boxSize="150px"
                    objectFit="cover"
                    mx="auto"
                  />

                  <Heading size="md" textAlign="center" mt={3}>
                    {product.brandname}
                  </Heading>

                  <Text
                    textAlign="center"
                    fontWeight="bold"
                    color="teal.500"
                    mt={2}
                  >
                    ₹{product.price}
                  </Text>

                  <Stack
                    direction="row"
                    align="center"
                    justify="center"
                    mt={2}
                  >
                    <AiFillStar color="gold" />
                    <Text>{product.rating}</Text>
                  </Stack>

                  <Badge
                    colorScheme={totalStock > 0 ? "green" : "red"}
                    display="block"
                    textAlign="center"
                    mt={3}
                  >
                    {totalStock > 0 ? "In Stock" : "Out of Stock"}
                  </Badge>

                  <Link to={`/product/${product._id}`}>
                    <Button
                      colorScheme="blue"
                      size="sm"
                      w="full"
                      mt={4}
                      isDisabled={totalStock === 0}
                    >
                      View Details
                    </Button>
                  </Link>
                </CardBody>
              </Card>
            );
          })}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default ProductOverview;

