import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import { Listproductbyfiters } from "../../actions/productActions";
import CardProduct from "../../components/CardProduct";
import FilterPage from "../Filter/FilterPage";
import HashLoader from "react-spinners/HashLoader";
import { Flex, Box, Text, Select, Button } from "@chakra-ui/react";
import "./ProductsListPage.css";
import { useNavigate } from "react-router-dom";
import Trust from "../../components/Trustdetails/Trust";

const ProductsListPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get("category");
  const subcategory = searchParams.get("subcategory");
  const gender = searchParams.get("gender"); // Get gender from URL
  const keyword = searchParams.get("keyword"); // Get gender from URL
  const Bestselling = searchParams.get("brand");
  const Offerfilter = searchParams.get("offerfilter");
  const brandname = searchParams.get("brandname");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy"));

  console.log("Dispatching with:", {
    gender,
    category,
    subcategory,
    Offerfilter,
    keyword,
    brandname,
    sortBy,
  });
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;
  // Maintain selected filters in state
  const [selectedFilters, setSelectedFilters] = useState(() => {
    const filters = [];
    if (gender) filters.push({ name: "Gender", value: gender });
    if (category) filters.push({ name: "Category", value: category });
    if (subcategory) filters.push({ name: "Subcategory", value: subcategory });
    if (brandname) filters.push({ name: "Brand", value: brandname });
    return filters;
  });

  useEffect(() => {
    dispatch(
      Listproductbyfiters({
        gender,
        category,
        subcategory,
        Offerfilter,
        keyword,
        brandname,
        sortBy,
      })
    );
  }, [
    dispatch,
    category,
    gender,
    subcategory,
    Offerfilter,
    keyword,
    brandname,
    sortBy,
  ]);
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };
  const handleRemoveFilter = (filterValue) => {
    const updatedFilters = selectedFilters.filter(
      (filter) => filter.value !== filterValue
    );
    setSelectedFilters(updatedFilters);

    const updatedParams = new URLSearchParams(location.search);
    for (const [key, value] of updatedParams.entries()) {
      if (value === filterValue) {
        updatedParams.delete(key);
      }
    }
    navigate({ search: `?${updatedParams.toString()}` });

    dispatch(Listproductbyfiters(Object.fromEntries(searchParams.entries())));
  };
  return (
    <Box bg="white">
      <Flex direction={{ base: "column", md: "row" }}>
        {/* Left Side - Filter Section */}
        <Box mt={20} width={{ base: "100%", md: "25%" }}>
          <FilterPage />
        </Box>
        <Box flex="1" mt={20}>
          {/* Right Side - Product List */}
          <Flex
            justify="space-between"
            alignItems="center"
            mb={4}
            flexWrap="wrap" // Ensures responsiveness if there are too many tags
          >
            <Flex wrap="wrap" mb={4} alignItems="center">
              {selectedFilters
                .filter((filter) => filter.name !== "Gender") // Exclude gender filters
                .map((filter) => (
                  <Box
                    key={filter.value}
                    bg="gray.200"
                    borderRadius="20px"
                    px={3}
                    py={1}
                    mr={2}
                    mb={2}
                    display="flex"
                    alignItems="center"
                  >
                    <Text fontSize="sm" mr={2}>
                      {filter.value}
                    </Text>
                    <Button
                      size="xs"
                      bg="transparent"
                      color="black"
                      _hover={{ bg: "gray.300" }}
                      onClick={() => handleRemoveFilter(filter.value)}
                    >
                      ✖
                    </Button>
                  </Box>
                ))}
            </Flex>
            <Select
              value={sortBy}
              onChange={handleSortChange}
              width="200px"
              border="1px solid #ccc"
              borderRadius="4px"
              p={2}
              bg="gray.100"
            >
              <option value="">Sort By: Newest</option>
              <option value="Rating">Highest Rated</option>
              <option value="date">Newest</option>
              <option value="highprice">Price: High to Low</option>
              <option value="lowprice">Price: Low to High</option>
            </Select>
          </Flex>

          {loading ? (
            <Flex justify="center" align="center" height="100vh">
              <HashLoader color="#36D7B7" />
            </Flex>
          ) : error ? (
            <Text color="red.500">
              An error occurred while fetching products.
            </Text>
          ) : products.length > 0 ? (
            <Flex wrap="wrap" gap={3}>
              {products.map((product) => (
                <Box
                  key={product._id}
                  width={{ base: "100%", sm: "48%", md: "24%" }} // Ensures 4 cards per row on medium+ screens
                >
                  <CardProduct product={product} />
                </Box>
              ))}
            </Flex>
          ) : (
            <Text>No products found.</Text>
          )}
        </Box>
      </Flex>
      <Trust />
    </Box>
  );
};

export default ProductsListPage;
