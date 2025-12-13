import axios from "axios";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  listProductDetails,
  UpdateProduct,
} from "../../actions/productActions";
import HashLoader from "react-spinners/HashLoader";
import { Helmet } from "react-helmet";
import { FaEdit } from "react-icons/fa";
import {
  Box,
  FormControl,
  Stack,
  Textarea,
  Divider,
  Flex,
  Heading,
  InputGroup,
  Text,
  FormLabel,
  Input,
  Button,
  Checkbox,
} from "@chakra-ui/react";
import { PRODUCT_UPDATE_RESET } from "../../constants/productConstants";
import "./CreateProduct.css";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const Editproduct = () => {
  const navigate = useNavigate();
  const [existingImages, setExistingImages] = useState([]);
  const { id: productId } = useParams();
  const [brandname, setbrandName] = useState("");
  const [description, setdescription] = useState("");
  const [price, setprice] = useState(0);
  const [oldPrice, setOldPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [countInStock, setcountInStock] = useState(0);
  const [isFeatured, setIsFeatured] = useState(false);
  const [SKU, setSKU] = useState("");
  const [newImages, setNewImages] = useState([]);
  const [sizeChart, setSizeChart] = useState("");
  const [productdetails, setProductdetails] = useState({
    gender: "",
    category: "",
    subcategory: "",
    type: "",
    ageRange: "",
    color: "",
    fabric: "",
    sizes: [],
  });
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
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);

  const { loading, error, product } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate);

  const {
    loading: lodingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate;
  useEffect(() => {
    console.log("Product from Redux:", product); // ✅ Debugging line
  }, [product]);
  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      navigate("/admin/productlist");
    } else {
      if (!product || product._id !== productId) {
        dispatch(listProductDetails(productId));
      } else if (product._id === productId) {
        setbrandName(product.brandname || "");
        setprice(product.price || 0);
        setOldPrice(product.oldPrice || 0);
        setDiscount(product.discount || 0);
        setcountInStock(product.countInStock || 0);
        setdescription(product.description || "");
        setExistingImages(product.images || []);
        setSKU(product.SKU);
        setIsFeatured(product.isFeatured);
        console.log("Product Details from API:", product.productdetails); // ✅ Debugging

        setProductdetails({
          gender: product.productdetails.gender || "",
          category: product.productdetails?.category || "",
          subcategory: product.productdetails?.subcategory || "",
          type: product.productdetails?.type || "",
          ageRange: product.productdetails?.ageRange || "",
          color: product.productdetails?.color || "",
          fabric: product.productdetails?.fabric || "",
          sizes: product.productdetails?.sizes || [],
        });
        setShippingDetails({
          weight: product.shippingDetails?.weight || "",
          dimensions: {
            length: product.shippingDetails?.dimensions?.length || "",
            width: product.shippingDetails?.dimensions?.width || "",
            height: product.shippingDetails?.dimensions?.height || "",
          },
          originAddress: {
            street1: product.shippingDetails?.originAddress?.street1 || "",
            street2: product.shippingDetails?.originAddress?.street2 || "",
            city: product.shippingDetails?.originAddress?.city || "",
            state: product.shippingDetails?.originAddress?.state || "",
            zip: product.shippingDetails?.originAddress?.zip || "",
            country: product.shippingDetails?.originAddress?.country || "",
          },
        });
      }
    }
  }, [dispatch, productId, navigate, product, successUpdate]);
  const handleReplaceImage = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const updatedImages = [...existingImages];
      updatedImages[index] = URL.createObjectURL(file); // Preview new image
      setExistingImages(updatedImages);

      // Store new image in state to upload later
      const updatedNewImages = [...newImages];
      updatedNewImages[index] = file;
      setNewImages(updatedNewImages);
    }
  };
  const handleSizeChartUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setSizeChart(file);
      console.log("PDF file selected:", file);
    } else {
      setMessage("Please upload a PDF file");
    }
  };
  const handleSizeChange = (size) => {
    setProductdetails((prevDetails) => {
      const newSizes = prevDetails.sizes.includes(size)
        ? prevDetails.sizes.filter((s) => s !== size) // Remove if already selected
        : [...prevDetails.sizes, size]; // Add if not selected

      return { ...prevDetails, sizes: newSizes };
    });
  };
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
    subcategory: ["Shirts", "Jeans", "Pants", "Shorts", "SweatPants"],
    type: ["Casual", "Formal", "Sports"],
    ageRange: ["Kids", "Teen", "Adult"],
    color: ["Red", "Blue", "Black", "White"],
    fabric: ["Cotton", "Polyester", "Leather"],
    sizes: ["S", "M", "L", "XL"],
  };

  const calculatedPrice = () => {
    const oldPriceNum = Number(oldPrice);
    const discountNum = Number(discount);
    const discountedPrice = oldPriceNum - (oldPriceNum * discountNum) / 100;

    return discountedPrice.toFixed(2);
  };
  const submitHandler = (e) => {
    e.preventDefault();
    // Validate productdetails
    const requiredFields = [
      "gender",
      "category",
      "subcategory",
      "type",
      "ageRange",
      "color",
      "fabric",
      "sizes",
    ];
    const missingFields = requiredFields.filter(
      (field) => !productdetails[field]
    );

    if (missingFields.length > 0) {
      setMessage(
        `Please fill in the following fields: ${missingFields.join(", ")}`
      );
      return;
    }
    const formData = new FormData();
    formData.append("brandname", brandname);
    formData.append("price", calculatedPrice());
    formData.append("oldPrice", oldPrice);
    formData.append("discount", discount);
    formData.append("description", description);
    formData.append("productdetails", JSON.stringify(productdetails));
    formData.append("shippingDetails", JSON.stringify(shippingDetails));
    formData.append("countInStock", countInStock);
    formData.append("SKU", SKU);
    formData.append("isFeatured", isFeatured);
    const handleProductDetailsChange = (e) => {
      setProductdetails((prevDetails) => ({
        ...prevDetails,
        [e.target.name]: e.target.value, // Ensure correct field mapping
      }));
    };
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    newImages.forEach((file) => {
      if (file) {
        formData.append("images", file);
      }
    });
    if (sizeChart instanceof File) {
      formData.append("sizeChart", sizeChart);
    }
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    dispatch(UpdateProduct(productId, formData));
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
        🔧 Edit Product
      </Heading>
      {error && <h4>{error}</h4>}
      {/* {successUpdate && <h4>Profile Updated</h4>} */}
      {loading || lodingUpdate ? (
        <div className="loading">
          <HashLoader color={"#1e1e2c"} loading={lodingUpdate} size={40} />
        </div>
      ) : errorUpdate ? (
        <h4>{errorUpdate}</h4>
      ) : (
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
                setProductdetails({
                  ...productdetails,
                  gender: e.target.value,
                })
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
                setProductdetails({
                  ...productdetails,
                  color: e.target.value,
                })
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
                setProductdetails({
                  ...productdetails,
                  fabric: e.target.value,
                })
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
              {["S", "M", "L", "XL", "XXL"].map((size) => (
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
                onClick={() =>
                  document.getElementById("sizeChartUpload").click()
                }
                colorScheme="teal"
                variant="outline"
                leftIcon={<FaEdit />}
              >
                Upload PDF
              </Button>
              {/* Add this button below the PDF upload */}

              {sizeChart && (
                <Text ml={3} fontSize="sm" color="gray.600">
                  {sizeChart.name}
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
            value={shippingDetails.weight}
            onChange={(e) =>
              setShippingDetails({ ...shippingDetails, weight: e.target.value })
            }
          />{" "}
          <FormLabel>Length</FormLabel>
          <Input
            placeholder="Length (cm)"
            type="number"
            value={shippingDetails.dimensions.length}
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
            value={shippingDetails.dimensions.width}
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
            value={shippingDetails.dimensions.height}
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
          <FormLabel>Product Images</FormLabel>
          <Flex wrap="wrap" gap={4}>
            {existingImages.map((img, index) => (
              <Box key={index} position="relative" w="100px" h="100px">
                {/* Clickable Image to Replace */}
                <img
                  src={img}
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

                {/* Edit Icon (Triggers File Upload) */}
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
          <Button type="submit" colorScheme="teal" w="full">
            Update Product
          </Button>
        </form>
      )}
      {message && <Text color="red.500">{message}</Text>}
    </Box>
  );
};

export default Editproduct;
