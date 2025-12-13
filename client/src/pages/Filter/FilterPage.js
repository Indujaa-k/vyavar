import React, { useState, useEffect } from "react";
import { useLocation, useHistory, useParams } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  Input,
  Select,
  Text,
  Stack,
  Button,
  Img,
  Checkbox,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Listproductbyfiters } from "../../actions/productActions";
import Filterimg from "../../assets/filtersicon.svg";
import FilterCategory from "./Filtercategory";

const FilterPage = () => {
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.productList); // Get product list from Redux store
  const { products, loading, error } = productList;
  const location = useLocation();
  const navigate = useNavigate();
  const { category } = useParams();

  // Function to get query params
  const getQueryParams = () => {
    return new URLSearchParams(location.search);
  };
  const forcedGender =
    category === "Men" ? "Men" : category === "Women" ? "Women" : "";

  const [filters, setFilters] = useState({
    brandname: getQueryParams().get("brandname") || "",
    gender: forcedGender || getQueryParams().get("gender") || "",
    category: getQueryParams().get("category") || "",
    subcategory: getQueryParams().get("subcategory") || "",
    type: getQueryParams().get("type") || "",
    color: getQueryParams().get("color") || "",
    fabric: getQueryParams().get("fabric") || "",
    sizes: getQueryParams().get("sizes") || "",
    from: getQueryParams().get("from") || "",
    to: getQueryParams().get("to") || "",
    discount: getQueryParams().get("discount") || "",
    rating: getQueryParams().get("rating") || "",
    sortBy: getQueryParams().get("sortBy") || "",
    keyword: getQueryParams().get("keyword") || "",
  });
  useEffect(() => {
    if (forcedGender && filters.gender !== forcedGender) {
      setFilters((prevFilters) => ({ ...prevFilters, gender: forcedGender }));
    }
  }, [category]);

  const handleCheckboxChange = (name, value) => {
    setFilters((prevFilters) => {
      const updatedValues = prevFilters[name].includes(value)
        ? prevFilters[name].filter((v) => v !== value)
        : [...prevFilters[name], value];

      return { ...prevFilters, [name]: updatedValues };
    });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const updateURL = () => {
    const currentParams = new URLSearchParams();

    Object.keys(filters).forEach((key) => {
      if (Array.isArray(filters[key]) && filters[key].length > 0) {
        currentParams.set(key, filters[key].join(","));
      } else if (filters[key]) {
        currentParams.set(key, filters[key]);
      }
    });

    navigate({ search: `?${currentParams.toString()}` });
  };

  const handleSubmit = () => {
    updateURL();
    dispatch(Listproductbyfiters(filters));
  };

  const handleClearFilters = () => {
    setFilters((prevFilters) => {
      const preservedGender = prevFilters.gender || forcedGender; // ✅ Ensure gender is preserved

      return {
        gender: preservedGender, // ✅ Explicitly set gender
        brandname: [],
        category: [],
        subcategory: [],
        type: [],
        color: [],
        fabric: [],
        sizes: [],
        discount: [],
        rating: [],
        from: "",
        to: "",
        sortBy: "",
      };
    });

    // ✅ Ensure gender is always included in the URL
    const searchParams = new URLSearchParams();
    const currentGender = forcedGender || filters.gender;
    if (currentGender) {
      searchParams.set("gender", currentGender);
    }

    navigate({ search: `?${searchParams.toString()}` });
    dispatch(Listproductbyfiters({ gender: currentGender }));
  };
  const renderCheckboxList = (title, name, options) => (
    <FilterCategory title={title} onApplyFilters={handleSubmit}>
      <VStack align="start" spacing={1}>
        {options.map((option) => (
          <Checkbox
            key={option}
            isChecked={filters[name].includes(option)}
            onChange={() => handleCheckboxChange(name, option)}
            colorScheme="cyan"
          >
            {option}
          </Checkbox>
        ))}
      </VStack>
    </FilterCategory>
  );

  return (
    <Flex direction={{ base: "column", md: "row" }}>
      <Box
        bg="white"
        width={{ base: "100%", md: "300px" }}
        borderRight="1px solid "
        borderColor="gray.200"
      >
        <Flex
          justifyContent="space-between"
          alignItems="center"
          p={3}
          bg="white"
          border="1px solid "
          borderColor="gray.200"
          mb={4}
        >
          <Heading size="md" fontWeight="400">
            <Flex alignItems="center">
              <Img src={Filterimg} alt="filterimg" boxSize="24px" />
              Filters
            </Flex>
          </Heading>
          <Text
            cursor="pointer"
            color="red.500"
            fontWeight="600"
            mr={3}
            onClick={handleClearFilters}
          >
            CLEAR ALL
          </Text>
        </Flex>
        <Stack spacing={3}>
          {renderCheckboxList("Brand", "brandname", [
            "Puma",
            "Nike",
            "TommyHilfigher",
            "Allensolley",
          ])}

          <FilterCategory title="Gender">
            <Text fontWeight="bold">{filters.gender}</Text>
          </FilterCategory>

          {renderCheckboxList("Category", "category", ["Shirts", "Pants"])}
          {renderCheckboxList("Subcategory", "subcategory", [
            "Shirts",
            "Jeans",
            "Pants",
            "Shorts",
            "SweatPants",
          ])}
          {renderCheckboxList("Type", "type", ["T-Shirts", "Jeans", "Jackets"])}
          {renderCheckboxList("Color", "color", [
            "Red",
            "Blue",
            "Black",
            "White",
          ])}
          {renderCheckboxList("Fabric", "fabric", [
            "Cotton",
            "Polyester",
            "Leather",
          ])}
          {renderCheckboxList("Size", "sizes", ["S", "M", "L", "XL"])}
          {renderCheckboxList("Minimum Discount", "discount", [
            "10%",
            "20%",
            "30%",
            "40%",
            "50%",
            "60%",
          ])}
          {renderCheckboxList("Minimum Rating", "rating", [
            "1",
            "2",
            "3",
            "4",
            "5",
          ])}
        </Stack>
      </Box>
    </Flex>
  );
};

export default FilterPage;
