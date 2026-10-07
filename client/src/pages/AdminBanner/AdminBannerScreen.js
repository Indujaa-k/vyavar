import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Image,
  VStack,
  HStack,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Heading,
  Select,
  Text,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  listBanners,
  addBanner,
  updateBanner,
  deleteBanner,
} from "../../actions/bannerActions";

const API_URL = process.env.REACT_APP_API_URL;

const FONT_OPTIONS = [
  "Poppins, sans-serif",
  "Arial, sans-serif",
  "Georgia, serif",
  "'Playfair Display', serif",
  "'Courier New', monospace",
];

const AdminBannerScreen = () => {
  const [imageFile, setImageFile] = useState(null);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [productId, setProductId] = useState("");
  const [gender, setGender] = useState("male");
  const [fontFamily, setFontFamily] = useState(FONT_OPTIONS[0]);
  const [fontSize, setFontSize] = useState("28px");
  const [fontColor, setFontColor] = useState("#ffffff");
  const [editingId, setEditingId] = useState(null);

  // button + click link
  const [buttonText, setButtonText] = useState("");
  const [buttonPosition, setButtonPosition] = useState("bottom-left");
  const [linkType, setLinkType] = useState("product"); // product | category | custom
  const [customUrl, setCustomUrl] = useState("");
  const [categoryMap, setCategoryMap] = useState({});
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");

  const dispatch = useDispatch();

  const bannerList = useSelector((state) => state.bannerList);
  const { loading, error, banners } = bannerList;

  const bannerAdd = useSelector((state) => state.bannerAdd);
  const { success: successAdd } = bannerAdd;

  const bannerUpdate = useSelector((state) => state.bannerUpdate);
  const { success: successUpdate } = bannerUpdate;

  const bannerDelete = useSelector((state) => state.bannerDelete);
  const { success: successDelete } = bannerDelete;

  const genderLabel = gender === "male" ? "Men" : "Women";

  useEffect(() => {
    dispatch(listBanners());
  }, [dispatch, successAdd, successUpdate, successDelete]);

  useEffect(() => {
    if (successUpdate) {
      resetForm();
    }
    // eslint-disable-next-line
  }, [successUpdate]);

  // categories for the chosen gender
  useEffect(() => {
    axios
      .get(`${API_URL}/api/products/categories?gender=${genderLabel}`)
      .then((res) => setCategoryMap(res.data))
      .catch((err) => console.error(err));
  }, [genderLabel]);

  const hasText = !!(title.trim() || subtitle.trim());

  const buildLinkUrl = () => {
    if (linkType === "category" && category) {
      return (
        `/products?gender=${genderLabel}&category=${encodeURIComponent(category)}` +
        (subcategory ? `&subcategory=${encodeURIComponent(subcategory)}` : "")
      );
    }
    if (linkType === "custom") return customUrl.trim();
    return ""; // empty = go to the product page
  };

  const resetForm = () => {
    setEditingId(null);
    setImageFile(null);
    setTitle("");
    setSubtitle("");
    setProductId("");
    setGender("male");
    setFontFamily(FONT_OPTIONS[0]);
    setFontSize("28px");
    setFontColor("#ffffff");
    setButtonText("");
    setButtonPosition("bottom-left");
    setLinkType("product");
    setCustomUrl("");
    setCategory("");
    setSubcategory("");
  };

  const handleEditClick = (banner) => {
    setEditingId(banner._id);
    setImageFile(null);
    setTitle(banner.title || "");
    setSubtitle(banner.subtitle || "");
    setProductId(banner.productId || "");
    setGender(banner.gender || "male");
    setFontFamily(banner.fontFamily || FONT_OPTIONS[0]);
    setFontSize(banner.fontSize || "28px");
    setFontColor(banner.fontColor || "#ffffff");
    setButtonText(banner.buttonText || "");
    setButtonPosition(banner.buttonPosition || "bottom-left");

    setCustomUrl("");
    setCategory("");
    setSubcategory("");

    if (banner.linkUrl?.startsWith("/products?")) {
      const q = new URLSearchParams(banner.linkUrl.split("?")[1]);
      setLinkType("category");
      setCategory(q.get("category") || "");
      setSubcategory(q.get("subcategory") || "");
    } else if (banner.linkUrl) {
      setLinkType("custom");
      setCustomUrl(banner.linkUrl);
    } else {
      setLinkType("product");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const buildFormData = () => {
    const formData = new FormData();
    if (imageFile) formData.append("image", imageFile);
    formData.append("title", title);
    formData.append("subtitle", subtitle);
    formData.append("gender", gender);
    formData.append("buttonText", buttonText);
    formData.append("buttonPosition", buttonPosition);
    formData.append("linkUrl", buildLinkUrl());
    if (!editingId) formData.append("productId", productId);
    if (hasText) {
      formData.append("fontFamily", fontFamily);
      formData.append("fontSize", fontSize);
      formData.append("fontColor", fontColor);
    }
    return formData;
  };

  const handleSubmit = () => {
    if (!productId || !gender) {
      alert("Product ID and Gender are required.");
      return;
    }
    if (!editingId && !imageFile) {
      alert("Desktop image is required.");
      return;
    }
    if (linkType === "category" && !category) {
      alert("Please select a category for the link.");
      return;
    }
    if (linkType === "custom" && !customUrl.trim()) {
      alert("Please enter the custom URL.");
      return;
    }

    if (editingId) {
      dispatch(updateBanner(editingId, buildFormData()));
    } else {
      dispatch(addBanner(buildFormData()));
      resetForm();
    }
  };

  const handleDeleteBanner = (id) => {
    dispatch(deleteBanner(id));
  };

  const renderBannerList = (genderValue, heading) => (
    <>
      <Heading size="md" mb={4} mt={6}>
        {heading}
      </Heading>
      <VStack spacing={6} align="stretch">
        {banners
          .filter((banner) => banner.gender === genderValue)
          .map((banner) => (
            <Box
              key={banner._id}
              p={4}
              bg="white"
              borderRadius="md"
              boxShadow="md"
              border="1px solid"
              borderColor="gray.200"
            >
              <HStack spacing={4} align="center">
                <Image
                  src={`${API_URL}${banner.image}`}
                  alt={banner.title || "Banner"}
                  boxSize="100px"
                  objectFit="cover"
                  borderRadius="md"
                />
                <Box flex={1}>
                  {banner.title && (
                    <Heading
                      size="sm"
                      style={{
                        fontFamily: banner.fontFamily || undefined,
                        color: banner.fontColor || undefined,
                      }}
                    >
                      {banner.title}
                    </Heading>
                  )}
                  {banner.subtitle && (
                    <Text fontSize="sm" color="gray.600">
                      {banner.subtitle}
                    </Text>
                  )}
                  {!banner.title && !banner.subtitle && (
                    <Text fontSize="sm" color="gray.400" fontStyle="italic">
                      Image-only banner
                    </Text>
                  )}
                  {banner.buttonText && (
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      Button: "{banner.buttonText}" ({banner.buttonPosition})
                    </Text>
                  )}
                  <Text fontSize="xs" color="gray.500">
                    Click goes to: {banner.linkUrl || "product page"}
                  </Text>
                </Box>
                <Button
                  colorScheme="yellow"
                  onClick={() => handleEditClick(banner)}
                >
                  Edit
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => handleDeleteBanner(banner._id)}
                >
                  Delete
                </Button>
              </HStack>
            </Box>
          ))}
      </VStack>
    </>
  );

  return (
    <Box p={14} bg="white">
      <h1 className="titlepanel">Image Banners</h1>

      <Box bg="gray.50" p={6} borderRadius="md" boxShadow="md" mb={8}>
        <Heading size="md" mb={4}>
          {editingId ? "Edit Banner" : "Add New Banner"}
        </Heading>
        <VStack spacing={4} align="stretch">
          <FormControl id="image" isRequired={!editingId}>
            <FormLabel>
              Banner Image {editingId ? "(leave blank to keep current)" : ""}
            </FormLabel>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
            <Box
              bg="blue.50"
              border="1px solid"
              borderColor="blue.200"
              borderRadius="md"
              p={3}
              mt={2}
            >
              <Text fontSize="sm" fontWeight="semibold" color="blue.800">
                Recommended: 1400 × 680 px
              </Text>
              <Text fontSize="xs" color="blue.700" mt={1}>
                Same size for every banner. Keep text and logos in the middle 80%.
                JPG or PNG, under 2 MB. Tablet and mobile sizes are made
                automatically.
              </Text>
            </Box>
          </FormControl>

          <FormControl id="title">
            <FormLabel>Title (optional)</FormLabel>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Leave blank for an image-only banner"
            />
          </FormControl>

          <FormControl id="subtitle">
            <FormLabel>Subtitle (optional)</FormLabel>
            <Input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Leave blank for an image-only banner"
            />
          </FormControl>

          {hasText && (
            <Box
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              p={4}
            >
              <Text fontSize="sm" fontWeight="medium" mb={3}>
                Text Style
              </Text>
              <VStack spacing={3} align="stretch">
                <FormControl id="fontFamily">
                  <FormLabel fontSize="sm">Font</FormLabel>
                  <Select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                  >
                    {FONT_OPTIONS.map((font) => (
                      <option key={font} value={font}>
                        {font.split(",")[0].replace(/'/g, "")}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl id="fontSize">
                  <FormLabel fontSize="sm">Title Font Size</FormLabel>
                  <Select
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                  >
                    <option value="20px">Small (20px)</option>
                    <option value="28px">Medium (28px)</option>
                    <option value="36px">Large (36px)</option>
                    <option value="48px">Extra Large (48px)</option>
                  </Select>
                </FormControl>

                <FormControl id="fontColor">
                  <FormLabel fontSize="sm">Text Color</FormLabel>
                  <HStack>
                    <Input
                      type="color"
                      value={fontColor}
                      onChange={(e) => setFontColor(e.target.value)}
                      w="60px"
                      p={1}
                    />
                    <Text fontSize="sm" color="gray.600">
                      {fontColor}
                    </Text>
                  </HStack>
                </FormControl>
              </VStack>
            </Box>
          )}

          <FormControl id="gender" isRequired>
            <FormLabel>Gender</FormLabel>
            <Select
              value={gender}
              onChange={(e) => {
                setGender(e.target.value);
                setCategory("");
                setSubcategory("");
              }}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </Select>
          </FormControl>

          <FormControl id="productId" isRequired isDisabled={!!editingId}>
            <FormLabel>Product ID</FormLabel>
            <Input
              type="text"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="Enter associated product ID"
            />
            <Text fontSize="xs" color="gray.500" mt={1}>
              {editingId
                ? "Product ID can't be changed on an existing banner."
                : "The banner is stored on this product (max 3 banners per product). It is also the default click target."}
            </Text>
          </FormControl>

          <FormControl id="linkType">
            <FormLabel>When the banner is clicked, go to</FormLabel>
            <Select
              value={linkType}
              onChange={(e) => setLinkType(e.target.value)}
            >
              <option value="product">The product page (default)</option>
              <option value="category">A category / subcategory</option>
              <option value="custom">Custom URL</option>
            </Select>
          </FormControl>

          {linkType === "category" && (
            <>
              <FormControl id="linkCategory">
                <FormLabel>Category</FormLabel>
                <Select
                  value={category}
                  placeholder="Select category"
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setSubcategory("");
                  }}
                >
                  {Object.keys(categoryMap).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl id="linkSubcategory">
                <FormLabel>Subcategory (optional)</FormLabel>
                <Select
                  value={subcategory}
                  placeholder={`All ${category}`}
                  isDisabled={!category}
                  onChange={(e) => setSubcategory(e.target.value)}
                >
                  {(categoryMap[category] || []).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </>
          )}

          {linkType === "custom" && (
            <FormControl id="customUrl">
              <FormLabel>Custom URL</FormLabel>
              <Input
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="/products?brandname=Rise Up&gender=Men"
              />
            </FormControl>
          )}

          <Box
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            p={4}
          >
            <Text fontSize="sm" fontWeight="medium" mb={3}>
              Button (optional)
            </Text>
            <FormControl id="buttonText" mb={3}>
              <FormLabel fontSize="sm">Button Text</FormLabel>
              <Input
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                placeholder="Shop Now (leave blank for no button)"
              />
            </FormControl>
            <FormControl id="buttonPosition">
              <FormLabel fontSize="sm">Button Position</FormLabel>
              <Select
                value={buttonPosition}
                onChange={(e) => setButtonPosition(e.target.value)}
              >
                <option value="top-left">Top Left</option>
                <option value="top-center">Top Center</option>
                <option value="top-right">Top Right</option>
                <option value="center">Center</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="bottom-center">Bottom Center</option>
                <option value="bottom-right">Bottom Right</option>
              </Select>
            </FormControl>
          </Box>

          <HStack w="full">
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              w="full"
              type="submit"
            >
              {editingId ? "Save Changes" : "Add Banner"}
            </Button>
            {editingId && (
              <Button variant="outline" onClick={resetForm} w="full">
                Cancel
              </Button>
            )}
          </HStack>
        </VStack>
      </Box>

      {loading ? (
        <Spinner size="xl" color="blue.500" />
      ) : error ? (
        <Alert status="error" borderRadius="md" mb={6}>
          <AlertIcon />
          <AlertTitle>Error:</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <>
          {renderBannerList("male", "Male Banners")}
          {renderBannerList("female", "Female Banners")}
        </>
      )}
    </Box>
  );
};

export default AdminBannerScreen;
