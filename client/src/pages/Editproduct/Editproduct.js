import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  listProductDetails,
  UpdateProduct,
} from "../../actions/productActions";
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
  Heading,
  Flex,
  Divider,
  Image,
} from "@chakra-ui/react";
import "./CreateProduct.css";

const API = process.env.REACT_APP_API_URL;

const CATEGORY_DATA = [
  {
    name: "Topwear",
    subcategories: [
      "Regular",
      "Oversized",
      "Full Sleeve",
      "Shirts",
      "Graphic T-Shirts",
      "Regular Tees",
      "Plain Tees",
      "Embroidery Tees",
    ],
  },
  { name: "Hoodies", subcategories: ["Hooded Sweatshirts", "Zip Hoodies"] },
  { name: "Bottomwear", subcategories: ["Pants", "Shorts", "Tracks"] },
  { name: "Innerwear", subcategories: ["Vests", "Bottom Wear"] },
  { name: "Gym Wears", subcategories: ["T-Shirts", "Tracks", "Shorts"] },
];

const options = {
  gender: ["Men", "Women", "Unisex"],
  type: ["Casual", "Formal", "Sports"],
  ageRange: ["Kids", "Teen", "Adult"],
  fabric: ["Cotton", "Polyester", "Leather"],
  sizes: ["S", "M", "L", "XL", "XXL"],
};

const EditProductPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id: productId } = useParams();

  // ── image state ──
  // displayImages: what user sees (blob URL or existing URL)
  // replacedImages: { [index]: File } — only changed slots
  const [displayImages, setDisplayImages] = useState(["", "", ""]);
  const [replacedImages, setReplacedImages] = useState({});

  const [brandname, setBrandname] = useState("");
  const [description, setDescription] = useState("");
  const [oldPrice, setOldPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [isFeatured, setIsFeatured] = useState(false);
  const [SKU, setSKU] = useState("");
  const [sizeChartFile, setSizeChartFile] = useState(null);
  const [message, setMessage] = useState(null);

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
    originAddress: { street1: "", city: "", state: "", zip: "", country: "" },
  });

  // Redux
  const productDetails = useSelector((s) => s.productDetails);
  const { loading, error, product } = productDetails;

  const productUpdate = useSelector((s) => s.productUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate;

  const disableNumberScroll = (e) => e.target.blur();

  // ── Load product ──
  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      navigate("/admin/productlist");
    } else {
      if (!product || product._id !== productId) {
        dispatch(listProductDetails(productId));
      } else {
        setBrandname(product.brandname || "");
        setOldPrice(product.oldPrice || 0);
        setDiscount(product.discount || 0);
        setDescription(product.description || "");
        setSKU(product.SKU || "");
        setIsFeatured(product.isFeatured || false);

        // Show all existing images (up to 5)
        const imgs = product.images || [];
        setDisplayImages(imgs.length ? imgs : ["", "", ""]);
        setReplacedImages({});

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
          })),
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
            city: product.shippingDetails?.originAddress?.city || "",
            state: product.shippingDetails?.originAddress?.state || "",
            zip: product.shippingDetails?.originAddress?.zip || "",
            country: product.shippingDetails?.originAddress?.country || "",
          },
        });
      }
    }
  }, [dispatch, productId, product, successUpdate, navigate]);

  const calculatedPrice = () => {
    const op = Number(oldPrice);
    const d = Number(discount);
    return (op - (op * d) / 100).toFixed(2);
  };

  // ── Replace a single image slot ──
  const handleReplaceImage = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    const blobUrl = URL.createObjectURL(file);

    setDisplayImages((prev) => {
      const updated = [...prev];
      updated[index] = blobUrl;
      return updated;
    });

    setReplacedImages((prev) => ({ ...prev, [index]: file }));
  };

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
      prev.map((s) => (s.size === size ? { ...s, stock: num } : s)),
    );
  };

  // ── Submit ──
  const submitHandler = (e) => {
    e.preventDefault();

    const selectedStock = stockBySize.filter((s) =>
      productdetails.sizes.includes(s.size),
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
      JSON.stringify({ ...productdetails, stockBySize: selectedStock }),
    );
    formData.append("shippingDetails", JSON.stringify(shippingDetails));

    // ✅ Only send changed images + their slot indexes
    // Backend will splice them into the correct position
    Object.entries(replacedImages).forEach(([index, file]) => {
      formData.append("images", file);
      formData.append("imageIndexes", index);
    });

    if (sizeChartFile) formData.append("sizeChart", sizeChartFile);

    dispatch(UpdateProduct(productId, formData));
  };

  // ── Render ──
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
        <HashLoader color="#1e1e2c" loading size={40} />
      ) : errorUpdate || error ? (
        <Text color="red.500">{errorUpdate || error}</Text>
      ) : (
        <form
          onSubmit={submitHandler}
          encType="multipart/form-data"
          className="form-container"
        >
          {/* ── Basic ── */}
          <FormControl isRequired>
            <FormLabel>Brand Name</FormLabel>
            <Input
              value={brandname}
              onChange={(e) => setBrandname(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired mt={3}>
            <FormLabel>SKU</FormLabel>
            <Input value={SKU} onChange={(e) => setSKU(e.target.value)} />
          </FormControl>

          <Checkbox
            mt={3}
            isChecked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
          >
            Mark as Featured Product
          </Checkbox>
          <Divider my={4} />

          {/* ── Pricing ── */}
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
              <Input type="number" value={calculatedPrice()} readOnly />
            </FormControl>
          </Flex>

          {/* ── Description ── */}
          <FormControl mt={4}>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Type something about the product..."
            />
          </FormControl>

          {/* ── Product Details ── */}
          <FormControl mt={3}>
            <FormLabel>Gender</FormLabel>
            <select
              value={productdetails.gender}
              onChange={(e) =>
                setProductdetails({ ...productdetails, gender: e.target.value })
              }
            >
              <option value="">Select Gender</option>
              {options.gender.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </FormControl>

          <FormControl mt={3}>
            <FormLabel>Category</FormLabel>
            <select
              value={productdetails.category}
              onChange={(e) =>
                setProductdetails({
                  ...productdetails,
                  category: e.target.value,
                  subcategory: "",
                })
              }
            >
              <option value="">Select Category</option>
              {CATEGORY_DATA.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </FormControl>

          <FormControl mt={3}>
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
              {CATEGORY_DATA.find(
                (c) => c.name === productdetails.category,
              )?.subcategories.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </FormControl>

          {["type", "ageRange", "fabric"].map((field) => (
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
                setProductdetails({ ...productdetails, color: e.target.value })
              }
            />
          </FormControl>

          {/* ── Sizes ── */}
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

          <FormControl mt={4}>
            <FormLabel>Stock per Size</FormLabel>
            <Stack spacing={2}>
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
                        onChange={(e) =>
                          handleStockChange(s.size, e.target.value)
                        }
                      />
                    </Flex>
                  ),
              )}
            </Stack>
          </FormControl>

          {/* ── Images ── */}
          <FormLabel mt={6}>
            Product Images — click any image to replace it
          </FormLabel>
          <Flex wrap="wrap" gap={4}>
            {displayImages.map((img, index) => (
              <Box key={index} position="relative" w="100px" h="100px">
                <Image
                  src={
                    img
                      ? img.startsWith("blob:")
                        ? img
                        : `${API}/${img.replace(/\\/g, "/")}`
                      : "https://via.placeholder.com/100"
                  }
                  boxSize="100px"
                  objectFit="cover"
                  borderRadius="md"
                  cursor="pointer"
                  onClick={() =>
                    document.getElementById(`imgInput-${index}`).click()
                  }
                  border={
                    replacedImages[index]
                      ? "2px solid #48BB78"
                      : "1px solid #E2E8F0"
                  }
                />
                <Input
                  type="file"
                  accept="image/*"
                  id={`imgInput-${index}`}
                  onChange={(e) => handleReplaceImage(e, index)}
                  hidden
                />
                <Button
                  size="xs"
                  colorScheme="blue"
                  position="absolute"
                  bottom="4px"
                  right="4px"
                  onClick={() =>
                    document.getElementById(`imgInput-${index}`).click()
                  }
                >
                  <FaEdit />
                </Button>
                {replacedImages[index] && (
                  <Box
                    position="absolute"
                    top="4px"
                    left="4px"
                    bg="green.400"
                    color="white"
                    fontSize="9px"
                    px={1}
                    borderRadius="sm"
                  >
                    NEW
                  </Box>
                )}
              </Box>
            ))}
          </Flex>

          {/* ── Size Chart ── */}
          <FormControl mt={6}>
            <FormLabel>Size Chart PDF</FormLabel>
            <Flex align="center" gap={3}>
              <Input
                type="file"
                accept="application/pdf"
                onChange={(e) => setSizeChartFile(e.target.files[0])}
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
                {sizeChartFile ? "Change PDF" : "Upload PDF"}
              </Button>
              {sizeChartFile && <Text fontSize="sm">{sizeChartFile.name}</Text>}
            </Flex>
          </FormControl>

          {/* ── Shipping ── */}
          <Heading size="md" color="teal.600" fontWeight="bold" mt={8} mb={4}>
            🚚 Shipping Details
          </Heading>

          <FormControl>
            <FormLabel>Weight (kg)</FormLabel>
            <Input
              type="number"
              onWheel={disableNumberScroll}
              value={shippingDetails.weight}
              onChange={(e) =>
                setShippingDetails({
                  ...shippingDetails,
                  weight: e.target.value,
                })
              }
            />
          </FormControl>

          {["length", "width", "height"].map((field) => (
            <FormControl key={field} mt={2}>
              <FormLabel>
                {field.charAt(0).toUpperCase() + field.slice(1)} (cm)
              </FormLabel>
              <Input
                type="number"
                onWheel={disableNumberScroll}
                value={shippingDetails.dimensions[field]}
                onChange={(e) =>
                  setShippingDetails({
                    ...shippingDetails,
                    dimensions: {
                      ...shippingDetails.dimensions,
                      [field]: Number(e.target.value),
                    },
                  })
                }
              />
            </FormControl>
          ))}

          <Heading size="md" color="teal.600" fontWeight="bold" mt={6} mb={4}>
            📍 Origin Address
          </Heading>
          {["street1", "city", "state", "zip", "country"].map((field) => (
            <FormControl key={field} mt={2} isRequired>
              <FormLabel>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </FormLabel>
              <Input
                value={shippingDetails.originAddress[field]}
                onChange={(e) =>
                  setShippingDetails({
                    ...shippingDetails,
                    originAddress: {
                      ...shippingDetails.originAddress,
                      [field]: e.target.value,
                    },
                  })
                }
              />
            </FormControl>
          ))}

          {message && (
            <Text color="red.500" mt={3}>
              {message}
            </Text>
          )}

          <Button type="submit" colorScheme="teal" w="full" mt={8}>
            Update Product
          </Button>
        </form>
      )}
    </Box>
  );
};

export default EditProductPage;
