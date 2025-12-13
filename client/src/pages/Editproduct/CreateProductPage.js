import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CreateProduct, listProducts } from "../../actions/productActions";
import { PRODUCT_CREATE_RESET } from "../../constants/productConstants";
import {
  Box,
  Button,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  Text,
  Stack,
  Checkbox,
  InputGroup,
  Heading,
  Flex,
  Divider,
} from "@chakra-ui/react";
import { Helmet } from "react-helmet";
import "./CreateProduct.css";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";

const CreateProductPage = () => {
  const navigate = useNavigate();
  const [existingImages, setExistingImages] = useState(["", "", ""]);
  const [brandname, setbrandName] = useState("");
  const [description, setdescription] = useState("");
  const [price, setPrice] = useState(0);
  const [oldPrice, setOldPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [isFeatured, setIsFeatured] = useState(false);
  const [SKU, setSKU] = useState("");
  const [productdetails, setProductdetails] = useState({
    gender: "",
    category: "",
    subcategory: "",
    type: "",
    ageRange: "",
    color: "",
    fabric: "",
    sizes: "",
  });
  const [countInStock, setcountInStock] = useState(0);
  const [newImages, setNewImages] = useState([]);
  const [message, setMessage] = useState(null);
  const [sizeChartFile, setSizeChartFile] = useState("");
  const dispatch = useDispatch();

  const productCreate = useSelector((state) => state.productCreate);
  const { loading, error, success } = productCreate;
  // Shipping Details State
  const [shippingDetails, setShippingDetails] = useState({
    weight: "",
    dimensions: {
      length: "",
      width: "",
      height: "",
    },
    originAddress: {
      street1: "",
      street2: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    },
  });
  useEffect(() => {
    if (success) {
      dispatch(listProducts());
      dispatch({ type: PRODUCT_CREATE_RESET });
      navigate("/admin/productlist");
    }
  }, [dispatch, success, navigate]);

  const options = {
    gender: ["Men", "Women", "Unisex"],
    category: [
      "Clothing",
      "Topwear",
      "Bottomwear",
      "Shirts",
      "Hoodies",
      "Innerwear",
      "Footwear",
      "Accessories",
    ],
    subcategory: ["Shirts", "Jeans", "Pants", "Shorts", "SweatPants", "Sets"],
    type: ["Casual", "Formal", "Sports"],
    ageRange: ["Kids", "Teen", "Adult"],
    color: ["Red", "Blue", "Black", "White"],
    fabric: ["Cotton", "Polyester", "Leather"],
    sizes: ["S", "M", "L", "XL", "XXL"],
  };

  const calculatedPrice = () => {
    const oldPriceNum = Number(oldPrice);
    const discountNum = Number(discount);
    const discountedPrice = oldPriceNum - (oldPriceNum * discountNum) / 100;
    return discountedPrice.toFixed(2);
  };
  const handleSizeChartUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setSizeChartFile(file);
      console.log("PDF file selected:", file);
    } else {
      setMessage("Please upload a PDF file");
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("brandname", brandname);
    formData.append("price", calculatedPrice());
    formData.append("oldPrice", oldPrice);
    formData.append("discount", discount);
    formData.append("description", description);
    formData.append("countInStock", countInStock);
    formData.append("productdetails", JSON.stringify(productdetails));
    formData.append("isFeatured", isFeatured);
    formData.append("shippingDetails", JSON.stringify(shippingDetails));
    formData.append("SKU", SKU);

    if (sizeChartFile) {
      formData.append("sizeChart", sizeChartFile);
    }

    newImages.forEach((file) => {
      if (file) {
        formData.append("images", file);
      }
    });
    dispatch(CreateProduct(formData));
  };
  const handleReplaceImage = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const updatedImages = [...existingImages];
      updatedImages[index] = URL.createObjectURL(file); // ✅ Show preview
      setExistingImages(updatedImages);

      // Store new image in `newImages` to upload later
      const updatedNewImages = [...newImages];
      updatedNewImages[index] = file;
      setNewImages(updatedNewImages);
    }
  };
  const handleSizeChange = (size) => {
    setProductdetails((prevDetails) => {
      const newSizes = prevDetails.sizes.includes(size)
        ? prevDetails.sizes.filter((s) => s !== size)
        : [...prevDetails.sizes, size];

      return { ...prevDetails, sizes: newSizes };
    });
  };
  return (
    <Box
      maxW="container.md"
      mx="auto"
      p={4}
      mt="20"
      boxShadow="md"
      borderRadius="md"
      className="create-product-container"
    >
      <Heading as="h2" size="lg" mb={6} textAlign="center">
        🛍️ Create Product
      </Heading>
      {error && <Text color="red.500">{error}</Text>}
      <form
        onSubmit={submitHandler}
        encType="multipart/form-data"
        className="form-container"
      >
        <FormControl isRequired>
          <FormLabel>Brand Name</FormLabel>
          <Input
            type="text"
            value={brandname}
            placeholder="Enter Brand name"
            onChange={(e) => setbrandName(e.target.value)}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>SKU</FormLabel>
          <Input
            type="text"
            value={SKU}
            onChange={(e) => setSKU(e.target.value)}
          />
        </FormControl>
        <Checkbox
          isChecked={isFeatured}
          onChange={(e) => setIsFeatured(e.target.checked)}
        >
          Mark as Featured Product
        </Checkbox>
        <Divider my={4} />
        <Flex justify="space-between" gap={4}>
          <FormControl isRequired>
            <FormLabel>Old Price</FormLabel>
            <Input
              type="number"
              value={oldPrice}
              placeholder="Enter old price"
              onChange={(e) => setOldPrice(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Discount (%)</FormLabel>
            <Input
              type="number"
              value={discount}
              placeholder="Enter discount percentage"
              onChange={(e) => setDiscount(Number(e.target.value))}
            />
          </FormControl>
          <FormControl>
            <FormLabel>New Price</FormLabel>
            <Input type="number" value={calculatedPrice()} readOnly />
          </FormControl>
        </Flex>
        <FormControl isRequired>
          <FormLabel>Stock Count</FormLabel>
          <Input
            type="number"
            value={countInStock}
            placeholder="Enter stock count"
            onChange={(e) => setcountInStock(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Description</FormLabel>
          <Stack direction="column" spacing={4}>
            <InputGroup>
              <Textarea
                size="sm"
                value={description}
                placeholder="Type Something about product.."
                onChange={(e) => setdescription(e.target.value)}
              />
            </InputGroup>
          </Stack>
        </FormControl>
        <FormControl>
          <FormLabel>Gender</FormLabel>
          <select
            value={productdetails.gender}
            onChange={(e) =>
              setProductdetails({ ...productdetails, gender: e.target.value })
            }
          >
            <option value="">Select Gender</option>
            {options.gender.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FormControl>
        <FormControl>
          <FormLabel>Category</FormLabel>
          <select
            value={productdetails.category}
            onChange={(e) =>
              setProductdetails({
                ...productdetails,
                category: e.target.value,
              })
            }
          >
            <option value="">Select Category</option>
            {options.category.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FormControl>
        <FormControl>
          <FormLabel>Subcategory</FormLabel>
          <select
            value={productdetails.subcategory}
            onChange={(e) =>
              setProductdetails({
                ...productdetails,
                subcategory: e.target.value,
              })
            }
          >
            <option value="">Select Subcategory</option>
            {options.subcategory.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FormControl>
        <FormControl>
          <FormLabel>Type</FormLabel>
          <select
            value={productdetails.type}
            onChange={(e) =>
              setProductdetails({ ...productdetails, type: e.target.value })
            }
          >
            <option value="">Select Type</option>
            {options.type.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FormControl>
        <FormControl>
          <FormLabel>Age Range</FormLabel>
          <select
            value={productdetails.ageRange}
            onChange={(e) =>
              setProductdetails({
                ...productdetails,
                ageRange: e.target.value,
              })
            }
          >
            <option value="">Select Age Range</option>
            {options.ageRange.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FormControl>
        <FormControl>
          <FormLabel>Color</FormLabel>
          <select
            value={productdetails.color}
            onChange={(e) =>
              setProductdetails({ ...productdetails, color: e.target.value })
            }
          >
            <option value="">Select Color</option>
            {options.color.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FormControl>
        <FormControl>
          <FormLabel>Fabric</FormLabel>
          <select
            value={productdetails.fabric}
            onChange={(e) =>
              setProductdetails({ ...productdetails, fabric: e.target.value })
            }
          >
            <option value="">Select Fabric</option>
            {options.fabric.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FormControl>
        <FormControl>
          <FormLabel>Sizes</FormLabel>
          <Stack direction="row" wrap="wrap">
            {options.sizes.map((size) => (
              <Checkbox
                key={size}
                isChecked={productdetails.sizes.includes(size)}
                onChange={() => handleSizeChange(size)}
              >
                {size}
              </Checkbox>
            ))}
          </Stack>
        </FormControl>
        {/* Size Chart PDF Upload */}
        <FormControl mt={4}>
          <FormLabel>Size Chart PDF</FormLabel>
          <Flex align="center" mt={2}>
            <Input
              type="file"
              name="sizeChart"
              accept="application/pdf"
              onChange={handleSizeChartUpload}
              border="none"
              p={1}
              w="auto"
              id="sizeChartUpload"
              hidden
            />
            <Button
              onClick={() => document.getElementById("sizeChartUpload").click()}
              colorScheme="teal"
              variant="outline"
              leftIcon={<FaEdit />}
            >
              Upload PDF
            </Button>
            {sizeChartFile && (
              <Text ml={3} fontSize="sm" color="gray.600">
                {sizeChartFile.name}
              </Text>
            )}
          </Flex>
          <Text fontSize="sm" color="gray.500" mt={1}>
            Upload size chart documentation (PDF only)
          </Text>
        </FormControl>
        <Heading size="md" color="teal.600" fontWeight="bold" mb={4}>
          🚚 Shipping Details
        </Heading>
        <FormLabel>Weight</FormLabel>
        <Input
          placeholder="Weight (kg)"
          onChange={(e) =>
            setShippingDetails({ ...shippingDetails, weight: e.target.value })
          }
        />{" "}
        <FormLabel>Length</FormLabel>
        <Input
          placeholder="Length (cm)"
          type="number"
          onChange={(e) =>
            setShippingDetails({
              ...shippingDetails,
              dimensions: {
                ...shippingDetails.dimensions,
                length: Number(e.target.value), // ✅ Ensure it's a number
              },
            })
          }
        />{" "}
        <FormLabel>Width</FormLabel>
        <Input
          placeholder="Width (cm)"
          type="number"
          onChange={(e) =>
            setShippingDetails({
              ...shippingDetails,
              dimensions: {
                ...shippingDetails.dimensions,
                width: Number(e.target.value), // ✅ Convert to number
              },
            })
          }
        />{" "}
        <FormLabel>Height</FormLabel>
        <Input
          placeholder="Height (cm)"
          type="number"
          onChange={(e) =>
            setShippingDetails({
              ...shippingDetails,
              dimensions: {
                ...shippingDetails.dimensions,
                height: Number(e.target.value), // ✅ Convert to number
              },
            })
          }
        />
        <Divider my={4} />
        <Heading size="md" color="teal.600" fontWeight="bold" mb={4}>
          📍 Origin Address
        </Heading>
        <FormControl isRequired>
          <FormLabel>Street Address</FormLabel>
          <Input
            type="text"
            value={shippingDetails.originAddress.street1}
            placeholder="Enter street address"
            onChange={(e) =>
              setShippingDetails({
                ...shippingDetails,
                originAddress: {
                  ...shippingDetails.originAddress,
                  street1: e.target.value,
                },
              })
            }
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>City</FormLabel>
          <Input
            type="text"
            value={shippingDetails.originAddress.city}
            placeholder="Enter city"
            onChange={(e) =>
              setShippingDetails({
                ...shippingDetails,
                originAddress: {
                  ...shippingDetails.originAddress,
                  city: e.target.value,
                },
              })
            }
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>State</FormLabel>
          <Input
            type="text"
            value={shippingDetails.originAddress.state}
            placeholder="Enter state"
            onChange={(e) =>
              setShippingDetails({
                ...shippingDetails,
                originAddress: {
                  ...shippingDetails.originAddress,
                  state: e.target.value,
                },
              })
            }
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>ZIP Code</FormLabel>
          <Input
            type="text"
            value={shippingDetails.originAddress.zip}
            placeholder="Enter ZIP code"
            onChange={(e) =>
              setShippingDetails({
                ...shippingDetails,
                originAddress: {
                  ...shippingDetails.originAddress,
                  zip: e.target.value,
                },
              })
            }
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Country</FormLabel>
          <Input
            type="text"
            value={shippingDetails.originAddress.country}
            placeholder="Enter country"
            onChange={(e) =>
              setShippingDetails({
                ...shippingDetails,
                originAddress: {
                  ...shippingDetails.originAddress,
                  country: e.target.value,
                },
              })
            }
          />
        </FormControl>
        {/* Upload Images */}
        <FormLabel>Product Images (Upload 3 Images)</FormLabel>
        <Flex wrap="wrap" gap={4}>
          {existingImages.map((img, index) => (
            <Box key={index} position="relative" w="100px" h="100px">
              <img
                src={img || "https://via.placeholder.com/100"}
                alt={`Product ${index}`}
                width="100px"
                height="100px"
                style={{
                  cursor: "pointer",
                  borderRadius: "8px",
                  objectFit: "cover",
                }}
                onClick={() =>
                  document.getElementById(`imageUpload-${index}`).click()
                }
              />

              {/* Hidden File Input */}
              <Input
                type="file"
                accept="image/*"
                id={`imageUpload-${index}`}
                onChange={(e) => handleReplaceImage(e, index)}
                hidden
              />

              {/* Upload/Edit Button */}
              <Button
                size="xs"
                colorScheme="blue"
                position="absolute"
                bottom="5px"
                right="5px"
                onClick={() =>
                  document.getElementById(`imageUpload-${index}`).click()
                }
              >
                <FaEdit />
              </Button>
            </Box>
          ))}
        </Flex>
        {/* Submit Button */}
        <Button
          type="submit"
          colorScheme="teal"
          isLoading={loading}
          loadingText="Creating..."
          w="full"
        >
          Create Product
        </Button>
      </form>
    </Box>
  );
};

export default CreateProductPage;
