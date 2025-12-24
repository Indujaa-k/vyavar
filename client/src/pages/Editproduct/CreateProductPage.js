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
  useToast,
} from "@chakra-ui/react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Helmet } from "react-helmet";
import "./CreateProduct.css";
import { useNavigate } from "react-router-dom";

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
    sizes: [],
  });
  const disableNumberScroll = (e) => {
    e.target.blur();
  };

  const [newImages, setNewImages] = useState([]);
  const [message, setMessage] = useState(null);
  const [sizeChartFile, setSizeChartFile] = useState("");
  const toast = useToast();
  const showError = (msg) => {
    toast({
      title: "Validation Error",
      description: msg,
      status: "error",
      duration: 3000,
      isClosable: true,
      position: "top-right",
    });
  };
  const dispatch = useDispatch();
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
  const validateImages = (variants) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    const maxSize = 2 * 1024 * 1024; // 2MB

    for (let i = 0; i < variants.length; i++) {
      const images = variants[i].images;

      // 1️⃣ Exactly 3 images
      if (!images || images.length !== 3) {
        return `Upload exactly 3 images for Color ${i + 1}`;
      }

      // 2️⃣ Validate each image
      for (let j = 0; j < images.length; j++) {
        const file = images[j];

        if (!allowedTypes.includes(file.type)) {
          return `Invalid file type for Color ${i + 1}, Image ${j + 1}`;
        }

        if (file.size > maxSize) {
          return `Image ${j + 1} of Color ${i + 1} exceeds 2MB`;
        }
      }
    }

    return null; // ✅ all good
  };

  const addColorVariant = () => {
    setColorVariants((prev) => [
      ...prev,
      {
        color: "",
        sizes: [],
        stockBySize: options.sizes.map((s) => ({ size: s, stock: 0 })),
        images: [],
      },
    ]);
  };
  const removeColorVariant = (removeIndex) => {
    setColorVariants((prev) =>
      prev.filter((_, index) => index !== removeIndex)
    );
  };

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
      toast({
        title: "Product Created",
        description: "Product added successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });

      dispatch(listProducts());
      dispatch({ type: PRODUCT_CREATE_RESET });
      navigate("/admin/productlist");
    }
  }, [dispatch, success, navigate, toast]);

  const [colorVariants, setColorVariants] = useState([
    {
      color: "",
      sizes: [],
      stockBySize: options.sizes.map((s) => ({ size: s, stock: 0 })),
      images: [],
    },
  ]);

  const [stockBySize, setStockBySize] = useState(
    options.sizes.map((size) => ({ size, stock: 0 }))
  );
  const calculatedPrice = () => {
    const op = Number(oldPrice);
    const dis = Number(discount);
    if (!op) return 0;
    return Number((op - (op * dis) / 100).toFixed(2));
  };

  const handleSizeChartUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setSizeChartFile(file);
      console.log("PDF file selected:", file);
    } else {
      showError("Please upload a PDF file");
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();

    // 🔴 VALIDATION
    if (colorVariants.length === 0) {
      showError("Please add at least one color variant");
      return;
    }

    for (let i = 0; i < colorVariants.length; i++) {
      const v = colorVariants[i];
      if (!v.color) {
        showError(`Color name missing for variant ${i + 1}`);
        return;
      }
      const imageError = validateImages(colorVariants);
      if (imageError) {
        showError(imageError);
        return;
      }
    }

    const formData = new FormData();

    // 🔹 BASIC
    formData.append("brandname", brandname);
    formData.append("price", Number(calculatedPrice()));
    formData.append("oldPrice", oldPrice);
    formData.append("discount", discount);
    formData.append("description", description);
    formData.append("SKU", SKU);
    formData.append("isFeatured", isFeatured ? "true" : "false");

    // 🔹 SHIPPING
    formData.append("shippingDetails", JSON.stringify(shippingDetails));

    // 🔥 MAIN CHANGE → SEND VARIANTS
    formData.append(
      "products",
      JSON.stringify(
        colorVariants.map((variant) => ({
          color: variant.color,
          productdetails: {
            gender: productdetails.gender,
            category: productdetails.category,
            subcategory: productdetails.subcategory,
            type: productdetails.type,
            ageRange: productdetails.ageRange,
            fabric: productdetails.fabric,
            color: variant.color,
            sizes: variant.sizes,
            stockBySize: variant.stockBySize.filter((s) =>
              variant.sizes.includes(s.size)
            ),
          },
        }))
      )
    );

    // 🔥 IMAGES PER COLOR
    colorVariants.forEach((variant) => {
      variant.images.forEach((file) => {
        formData.append("images", file);
      });
    });

    // 🔹 SIZE CHART
    if (sizeChartFile) {
      formData.append("sizeChart", sizeChartFile);
    }

    // 🚀 DISPATCH
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
              onWheel={disableNumberScroll}
              value={oldPrice}
              placeholder="Enter old price"
              onChange={(e) => setOldPrice(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Discount (%)</FormLabel>
            <Input
              type="number"
              onWheel={disableNumberScroll}
              value={discount}
              placeholder="Enter discount percentage"
              onChange={(e) => setDiscount(Number(e.target.value))}
            />
          </FormControl>
          <FormControl>
            <FormLabel>New Price</FormLabel>
            <Input
              type="number"
              onWheel={disableNumberScroll}
              value={calculatedPrice()}
              readOnly
            />
          </FormControl>
        </Flex>
        {/* <FormControl isRequired>
          <FormLabel>Stock Count</FormLabel>
          <Input
            type="number"
            value={countInStock}
            placeholder="Enter stock count"
            onChange={(e) => setcountInStock(e.target.value)}
          />
        </FormControl> */}
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
        {colorVariants.map((variant, index) => (
          <Box
            key={index}
            border="1px solid #CBD5E0"
            p={4}
            borderRadius="md"
            mt={4}
            position="relative" // parent for absolute button
          >
            {/* Heading */}
            <Flex mb={3} align="center" justify="space-between">
              <Heading size="sm">Color {index + 1}</Heading>

              <Box
                onClick={() => {
                  if (colorVariants.length > 1) {
                    removeColorVariant(index);
                  }
                }}
                cursor={colorVariants.length <= 1 ? "not-allowed" : "pointer"}
              >
                <FaTrash
                  size={18}
                  color={colorVariants.length <= 1 ? "gray" : "red"}
                />
              </Box>
            </Flex>

            {/* Color Name */}
            <FormControl mb={3}>
              <FormLabel>Color</FormLabel>
              <Input
                value={variant.color}
                placeholder="Enter color name"
                onChange={(e) => {
                  const updated = [...colorVariants];
                  updated[index] = { ...updated[index], color: e.target.value };
                  setColorVariants(updated);
                }}
              />
            </FormControl>

            {/* Sizes */}
            <FormLabel>Sizes</FormLabel>
            <Stack direction="row" mb={3}>
              {options.sizes.map((size) => (
                <Checkbox
                  key={size}
                  isChecked={variant.sizes.includes(size)}
                  onChange={() => {
                    const updated = [...colorVariants];
                    const sizes = updated[index].sizes;
                    updated[index].sizes = sizes.includes(size)
                      ? sizes.filter((s) => s !== size)
                      : [...sizes, size];
                    setColorVariants(updated);
                  }}
                >
                  {size}
                </Checkbox>
              ))}
            </Stack>

            {/* Stock per size */}
            {variant.sizes.map((size) => (
              <Flex key={size} gap={2} mb={2}>
                <Text w="40px">{size}</Text>
                <Input
                  type="number"
                  min={0}
                  placeholder={`Stock for ${size}`}
                  onWheel={disableNumberScroll}
                  onChange={(e) => {
                    const updated = [...colorVariants];
                    updated[index].stockBySize = updated[index].stockBySize.map(
                      (stk) =>
                        stk.size === size
                          ? { ...stk, stock: Number(e.target.value) }
                          : stk
                    );
                    setColorVariants(updated);
                  }}
                />
              </Flex>
            ))}

            {/* Images (3 per color) */}
            <FormControl mt={4}>
              <FormLabel>
                Images for {variant.color || `Color ${index + 1}`}
              </FormLabel>
              <Flex gap={4}>
                {[0, 1, 2].map((imgIndex) => (
                  <Box
                    key={imgIndex}
                    w="100px"
                    h="100px"
                    border="2px dashed #CBD5E0"
                    borderRadius="md"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    cursor="pointer"
                    position="relative"
                    onClick={() =>
                      document
                        .getElementById(`images-${index}-${imgIndex}`)
                        .click()
                    }
                  >
                    {variant.images?.[imgIndex] ? (
                      <img
                        src={URL.createObjectURL(variant.images[imgIndex])}
                        alt="preview"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "6px",
                        }}
                      />
                    ) : (
                      <Text fontSize="xs" color="gray.500" textAlign="center">
                        Upload
                        <br />
                        Image {imgIndex + 1}
                      </Text>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      hidden
                      id={`images-${index}-${imgIndex}`}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const updated = [...colorVariants];
                        const imgs = updated[index].images || [];
                        imgs[imgIndex] = file;
                        updated[index].images = imgs;
                        setColorVariants(updated);
                      }}
                    />
                  </Box>
                ))}
              </Flex>
              <Text fontSize="xs" color="gray.500" mt={2}>
                Upload exactly 3 images for this color
              </Text>
              {index === colorVariants.length - 1 && (
                <Button
                  mt={4}
                  size="sm"
                  colorScheme="teal"
                  variant="outline"
                  onClick={() =>
                    setColorVariants((prev) => [
                      ...prev,
                      {
                        color: "",
                        sizes: [],
                        stockBySize: options.sizes.map((s) => ({
                          size: s,
                          stock: 0,
                        })),
                        images: [],
                      },
                    ])
                  }
                >
                  ➕ Add Another Color
                </Button>
              )}
            </FormControl>
          </Box>
        ))}
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
            setShippingDetails({
              ...shippingDetails,
              weight: Number(e.target.value),
            })
          }
        />{" "}
        <FormLabel>Length</FormLabel>
        <Input
          placeholder="Length (cm)"
          type="number"
          onWheel={disableNumberScroll}
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
          onWheel={disableNumberScroll}
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
          onWheel={disableNumberScroll}
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
