import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listProductDetails, UpdateProduct } from "../../actions/productActions";
import { PRODUCT_UPDATE_RESET } from "../../constants/productConstants";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import HashLoader from "react-spinners/HashLoader";
import { FaEdit } from "react-icons/fa";
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import "./CreateProduct.css";

const EditProductPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id: productId } = useParams();

  // State
  const [existingImages, setExistingImages] = useState(["", "", ""]);
  const [newImages, setNewImages] = useState([]);
  const [brandname, setbrandName] = useState("");
  const [description, setdescription] = useState("");
  const [oldPrice, setOldPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [isFeatured, setIsFeatured] = useState(false);
  const [SKU, setSKU] = useState("");
  const [sizeChartFile, setSizeChartFile] = useState("");
  const [variantImages, setVariantImages] = useState([null, null, null]);

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
  const [stockBySize, setStockBySize] = useState([]);
  const [shippingDetails, setShippingDetails] = useState({
    weight: "",
    dimensions: { length: "", width: "", height: "" },
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

  //  variant
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [variantData, setVariantData] = useState({
    color: "",
    SKU: "",
    sizes: [],
    stockBySize: [],
  });
  const generateVariantSKU = (productName, color) => {
    const safeProductName = (productName || "")
      .trim()
      .toUpperCase()
      .replace(/\s+/g, "-"); // replace spaces with hyphen

    const safeColor = (color || "").trim().toUpperCase();

    const time = new Date()
      .toISOString()
      .replace(/[-:.TZ]/g, "")
      .slice(0, 14);

    return `${safeProductName}-${safeColor}-${time}`;
  };

  const handleVariantImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const updatedImages = [...variantImages];
    updatedImages[index] = file;
    setVariantImages(updatedImages);
  };
  const handleRemoveVariantImage = (index) => {
    const updatedImages = [...variantImages];
    updatedImages[index] = null; // remove the image
    setVariantImages(updatedImages);
  };

  // Options
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
    fabric: ["Cotton", "Polyester", "Leather"],
    sizes: ["S", "M", "L", "XL", "XXL"],
  };
 const disableNumberScroll = (e) => {
    e.target.blur();
  };
  // Redux
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = productUpdate;

  // Load product details
  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      navigate("/admin/productlist");
    } else {
      if (!product || product._id !== productId) {
        dispatch(listProductDetails(productId));
      } else {
        setbrandName(product.brandname || "");
        setOldPrice(product.oldPrice || 0);
        setDiscount(product.discount || 0);
        setdescription(product.description || "");
        setExistingImages(product.images?.slice(0, 3) || ["", "", ""]);
        setSKU(product.SKU || "");
        setIsFeatured(product.isFeatured || false);

        setProductdetails({
          gender: product.productdetails?.gender || "",
          category: product.productdetails?.category || "",
          subcategory: product.productdetails?.subcategory || "",
          type: product.productdetails?.type || "",
          ageRange: product.productdetails?.ageRange || "",
          color: product.productdetails?.color || "",
          fabric: product.productdetails?.fabric || "",
          sizes: product.productdetails?.sizes || [],
        });

        setStockBySize(
          options.sizes.map((size) => ({
            size,
            stock:
              product.productdetails?.stockBySize?.find((s) => s.size === size)
                ?.stock || 0,
          }))
        );

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
  }, [dispatch, productId, product, successUpdate, navigate]);

  // Price calculation
  const calculatedPrice = () => {
    const oldPriceNum = Number(oldPrice);
    const discountNum = Number(discount);
    return (oldPriceNum - (oldPriceNum * discountNum) / 100).toFixed(2);
  };

  // Handlers
  const handleSizeChange = (size) => {
    setProductdetails((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleStockChange = (size, value) => {
    const num = value === "" ? 0 : Math.max(0, Number(value));
    setStockBySize((prev) =>
      prev.map((s) => (s.size === size ? { ...s, stock: num } : s))
    );
  };

  const handleReplaceImage = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const updatedImages = [...existingImages];
      updatedImages[index] = URL.createObjectURL(file);
      setExistingImages(updatedImages);

      const updatedNewImages = [...newImages];
      updatedNewImages[index] = file;
      setNewImages(updatedNewImages);
    }
  };

  const handleSizeChartUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setSizeChartFile(file);
    } else {
      setMessage("Please upload a PDF file");
    }
  };

  // Submit
  const submitHandler = (e) => {
    e.preventDefault();

    const selectedStock = stockBySize.filter((s) =>
      productdetails.sizes.includes(s.size)
    );
    if (selectedStock.some((s) => s.stock <= 0)) {
      setMessage("Please enter stock greater than 0 for all selected sizes");
      return;
    }

    const formData = new FormData();
    formData.append("brandname", brandname);
    formData.append("price", calculatedPrice());
    formData.append("oldPrice", oldPrice);
    formData.append("discount", discount);
    formData.append("description", description);
    formData.append("SKU", SKU);
    formData.append("isFeatured", isFeatured);
    formData.append(
      "productdetails",
      JSON.stringify({ ...productdetails, stockBySize: selectedStock })
    );
    formData.append("shippingDetails", JSON.stringify(shippingDetails));

    newImages.forEach((file) => {
      if (file) formData.append("images", file);
    });
    if (sizeChartFile) formData.append("sizeChart", sizeChartFile);

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
      {loading || loadingUpdate ? (
        <HashLoader color={"#1e1e2c"} loading={true} size={40} />
      ) : errorUpdate || error ? (
        <Text color="red.500">{errorUpdate || error}</Text>
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
                onChange={(e) => setOldPrice(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Discount (%)</FormLabel>
              <Input
                type="number"
                onWheel={disableNumberScroll}
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
              />
            </FormControl>
            <FormControl>
              <FormLabel>New Price</FormLabel>
              <Input type="number" onWheel={disableNumberScroll} value={calculatedPrice()} readOnly />
            </FormControl>
          </Flex>

          <FormControl mt={4}>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setdescription(e.target.value)}
              placeholder="Type Something about product..."
            />
          </FormControl>

          {/* Product details */}
          {["gender", "category", "subcategory", "type", "ageRange", "color", "fabric"].map((field) => (
            <FormControl key={field} mt={3}>
              <FormLabel>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </FormLabel>
              <select
                value={productdetails[field]}
                onChange={(e) =>
                  setProductdetails({
                    ...productdetails,
                    [field]: e.target.value,
                  })
                }
              >
                <option value="">Select {field}</option>
                {options[field]?.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </FormControl>
          ))}
          <FormControl mt={3}>
            <FormLabel>Color</FormLabel>
            <Input
              type="text"
              placeholder="Enter color"
              value={productdetails.color}
              onChange={(e) =>
                setProductdetails({
                  ...productdetails,
                  color: e.target.value,
                })
              }
            />
          </FormControl>

          {/* Sizes */}
          <FormControl mt={4}>
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

          {/* Stock per size */}
          <FormControl mt={4}>
            <FormLabel>Stock per Size</FormLabel>
            <Stack direction="column" spacing={2}>
              {stockBySize.map(
                (s) =>
                  productdetails.sizes.includes(s.size) && (
                    <Flex key={s.size} gap={2} align="center">
                      <Text w="50px">{s.size}</Text>
                      <Input
                        type="number"
                        onWheel={disableNumberScroll}
                        min={0}
                        value={s.stock}
                        placeholder={`Stock for ${s.size}`}
                        onChange={(e) =>
                          handleStockChange(s.size, e.target.value)
                        }
                      />
                    </Flex>
                  )
              )}
            </Stack>
          </FormControl>
          {/* Images */}
          <FormLabel mt={4}>Product Images (3)</FormLabel>
          <Flex wrap="wrap" gap={4}>
            {existingImages.map((img, index) => (
              <Box key={index} position="relative" w="100px" h="100px">
                <img
                  src={img || "https://via.placeholder.com/100"}
                  alt={`Product ${index}`}
                  style={{
                    cursor: "pointer",
                    borderRadius: "8px",
                    objectFit: "cover",
                    objectFit: "cover",
                  }}
                  onClick={() =>
                    document.getElementById(`imageUpload-${index}`).click()
                  }
                />
                <Input
                  type="file"
                  accept="image/*"
                  id={`imageUpload-${index}`}
                  onChange={(e) => handleReplaceImage(e, index)}
                  hidden
                />
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

          {/* Size Chart */}
          <FormControl mt={10}>
            <FormLabel>Size Chart PDF</FormLabel>
            <Flex align="center" mt={2}>
              <Input
                type="file"
                accept="application/pdf"
                onChange={handleSizeChartUpload}
                hidden
                id="sizeChartUpload"
              />
              <Button
                onClick={() =>
                  document.getElementById("sizeChartUpload").click()
                }
                leftIcon={<FaEdit />}
                colorScheme="teal"
                variant="outline"
              >
                Upload PDF
              </Button>
              {sizeChartFile && (
                <Text ml={3} fontSize="sm">
                  {sizeChartFile.name}
                </Text>
              )}
            </Flex>
          </FormControl>
          <Button mt={6} colorScheme="purple" w="full" onClick={onOpen}>
            ➕ Add Variant
          </Button>
          {/* Shipping details */}
          <Heading size="md" color="teal.600" fontWeight="bold" mt={6} mb={4}>
            🚚 Shipping Details
          </Heading>
          {["weight", "length", "width", "height"].map((field) => (
            <FormControl key={field} mt={2}>
              <FormLabel>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </FormLabel>
              <Input
                type={
                  ["length", "width", "height"].includes(field)
                    ? "number"
                    : "text"
                }
                value={
                  field === "weight"
                    ? shippingDetails.weight
                    : shippingDetails.dimensions[field]
                }
                onChange={(e) => {
                  if (field === "weight")
                    setShippingDetails({
                      ...shippingDetails,
                      weight: e.target.value,
                    });
                  else
                    setShippingDetails({
                      ...shippingDetails,
                      dimensions: {
                        ...shippingDetails.dimensions,
                        [field]: Number(e.target.value),
                      },
                    });
                }}
              />
            </FormControl>
          ))}

          {/* Origin Address */}
          <Heading size="md" color="teal.600" fontWeight="bold" mt={6} mb={4}>📍 Origin Address</Heading>
          {["street1", "street2", "city", "state", "zip", "country"].map(field => (
            <FormControl key={field} mt={2} isRequired>
              <FormLabel>{field.charAt(0).toUpperCase() + field.slice(1)}</FormLabel>
              <Input type="text" value={shippingDetails.originAddress[field]} onChange={e => setShippingDetails({...shippingDetails, originAddress: {...shippingDetails.originAddress, [field]: e.target.value}})} />
            </FormControl>
          ))}


          {/* Submit */}
          <Button type="submit" colorScheme="teal" w="full" mt={6}>
            Update Product
          </Button>
        </form>
      )}
      {message && <Text color="red.500" mt={2}>{message}</Text>}
    </Box>
  );
};

export default EditProductPage;
