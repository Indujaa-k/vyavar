import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  Box,
  Flex,
  Heading,
  Text,
  Stack,
  Img,
  Checkbox,
  VStack,
  Spinner,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Listproductbyfiters } from "../../actions/productActions";
import Filterimg from "../../assets/filtersicon.svg";
import FilterCategory from "./Filtercategory";
import axios from "axios";

const FilterPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { category } = useParams();

  const forcedGender =
    category === "Men" ? "Men" : category === "Women" ? "Women" : "";

  const getQueryParams = () => new URLSearchParams(location.search);
  const getArrayParam = (key) => {
    const value = getQueryParams().get(key);
    return value ? value.split(",") : [];
  };

  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    subcategoryMap: {},
    loading: false,
  });

  const [filters, setFilters] = useState({
    category: getArrayParam("category"),
    subcategory: getArrayParam("subcategory"),
    sizes: getArrayParam("sizes"),
    discount: getArrayParam("discount"),
    rating: getArrayParam("rating"),
  });

  // ✅ Use lean /categories endpoint — no longer fetches all product data
  useEffect(() => {
    const fetchFilterOptions = async () => {
      setFilterOptions((prev) => ({ ...prev, loading: true }));
      try {
        const { data } = await axios.get(
          `/api/products/categories${forcedGender ? `?gender=${forcedGender}` : ""}`,
        );
        // data shape: { "Topwear": ["T-Shirts", "Oversized"], "Hoodies": [...] }
        setFilterOptions({
          categories: Object.keys(data),
          subcategoryMap: data,
          loading: false,
        });
      } catch (err) {
        console.error("Failed to fetch filter options:", err);
        setFilterOptions((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchFilterOptions();
  }, [forcedGender]);

  // ✅ Available subcategories based on selected categories
  const availableSubcategories =
    filters.category.length > 0
      ? filters.category.flatMap(
          (cat) => filterOptions.subcategoryMap?.[cat] || [],
        )
      : Object.values(filterOptions.subcategoryMap || {}).flat();

  // ✅ Remove invalid subcategories when category changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      subcategory: prev.subcategory.filter((sub) =>
        availableSubcategories.includes(sub),
      ),
    }));
  }, [filters.category]);

  useEffect(() => {
    if (forcedGender && filters.gender !== forcedGender) {
      setFilters((prev) => ({ ...prev, gender: forcedGender }));
    }
  }, [category]);

  const handleCheckboxChange = (name, value) => {
    setFilters((prev) => {
      const updatedValues = prev[name].includes(value)
        ? prev[name].filter((v) => v !== value)
        : [...prev[name], value];
      return { ...prev, [name]: updatedValues };
    });
  };

  const updateURL = () => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach((key) => {
      if (Array.isArray(filters[key]) && filters[key].length > 0) {
        params.set(key, filters[key].join(","));
      }
    });
    navigate({ search: `?${params.toString()}` });
  };

  const handleSubmit = () => {
    updateURL();
    dispatch(Listproductbyfiters(filters));
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      gender: forcedGender,
      category: [],
      subcategory: [],
      sizes: [],
      discount: [],
      rating: [],
      from: "",
      to: "",
      sortBy: "",
    };
    setFilters(clearedFilters);

    const searchParams = new URLSearchParams();
    if (forcedGender) searchParams.set("gender", forcedGender);
    navigate({ search: `?${searchParams.toString()}` });
    dispatch(Listproductbyfiters({ gender: forcedGender }));
  };

  const renderCheckboxList = (title, name, options) => (
    <FilterCategory title={title} onApplyFilters={handleSubmit}>
      {filterOptions.loading ? (
        <Spinner size="sm" color="cyan.500" />
      ) : options.length === 0 ? (
        <Text fontSize="sm" color="gray.400">
          No options available
        </Text>
      ) : (
        <VStack align="start" spacing={1}>
          {options.map((option) => (
            <Checkbox
              key={option}
              isChecked={filters[name]?.includes(option)}
              onChange={() => handleCheckboxChange(name, option)}
              colorScheme="cyan"
            >
              {option}
            </Checkbox>
          ))}
        </VStack>
      )}
    </FilterCategory>
  );

  return (
    <Flex direction={{ base: "column", md: "row" }}>
      <Box
        bg="white"
        m="0"
        width={{ base: "100%", md: "300px" }}
        borderRight="1px solid"
        borderColor="gray.200"
      >
        <Flex
          justifyContent="space-between"
          alignItems="center"
          p={0}
          bg="white"
          border="1px solid"
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
            mr={3}
            onClick={handleClearFilters}
          >
            Clear All
          </Text>
        </Flex>

        <Stack spacing={3}>
          {renderCheckboxList("Category", "category", filterOptions.categories)}
          {renderCheckboxList(
            "Subcategory",
            "subcategory",
            availableSubcategories,
          )}
          {renderCheckboxList("Size", "sizes", ["S", "M", "L", "XL"])}
          {renderCheckboxList("Minimum Discount", "discount", [
            "10",
            "20",
            "30",
            "40",
            "50",
            "60",
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
