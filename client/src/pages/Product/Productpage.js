import React, { useEffect, useState, useRef, Profiler } from "react";
import Rating from "../../components/Rating";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import {
  listProductDetails,
  createproductReview,
  listProductsByGroupId,
  markReviewHelpful,
  markReviewNotHelpful,
} from "../../actions/productActions";
import { IoLogoFacebook } from "react-icons/io";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { addToCart } from "../../actions/cartActions";
import { AiFillShop } from "react-icons/ai";
import ShareButton from "./ShareButton";
import { MdDoNotDisturb } from "react-icons/md";
import { MdVerified } from "react-icons/md";
import axios from "axios";

// import { FaCheckCircle } from "react-icons/fa";
import { FaThumbsUp, FaThumbsDown, FaCheckCircle } from "react-icons/fa";

import {
  Image,
  Select,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  toast,
  Flex,
  useToast,
  Heading,
  HStack,
  Text,
  Divider,
  Box,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  ModalHeader,
  Avatar,
} from "@chakra-ui/react";
import HashLoader from "react-spinners/HashLoader";
import { useParams } from "react-router-dom";
import {
  PRODUCT_CREATE_RESET,
  PRODUCT_CREATE_REVIEW_RESET,
} from "../../constants/productConstants";
import "./product.css";
import { Link } from "react-router-dom";
import { Listproductbyfiters } from "../../actions/productActions";
import CardProduct from "../../components/CardProduct";
import { useNavigate } from "react-router-dom";
import FeaturesSection from "../../components/Trustdetails/FeatureItem";
import Trust from "../../components/Trustdetails/Trust";
import { listMyOrders } from "../../actions/orderActions";
import ProductSpecification from "./ProductSpecification";
import FavoriteButton from "../../pages/Favourites/Favorites";

const Productpage = () => {
  const { id } = useParams();
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZoomVisible, setIsZoomVisible] = useState(false);
  const [hoveredImageIndex, setHoveredImageIndex] = useState(0);

  const relatedProductsList = useSelector((state) => state.productList);
  const { products: relatedProducts, loading: relatedLoading } =
    relatedProductsList;
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const orderListMy = useSelector((state) => state.orderMylist);
  const { orders } = orderListMy;
  const [qty, setQty] = useState(1);
  const [rating, setrating] = useState(0);
  const [comment, setcomment] = useState("");
  const toast = useToast();

  const dispatch = useDispatch();
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const [isPurchased, setIsPurchased] = useState(false);
  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const { success: successProductReview, error: errorProductReview } =
    productReviewCreate;
  const availableSizes = product?.productdetails?.sizes || [];
  const [selectedSize, setSelectedSize] = useState("");
  const [sizeStock, setSizeStock] = useState({});
  const [showPDF, setShowPDF] = useState(false);
  const [reviewPhotos, setReviewPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [activeTab, setActiveTab] = useState("All Reviews"); // default tab
  const [showCreateReview, setShowCreateReview] = useState(false);
  const carouselRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalImage, setModalImage] = useState(null);
  const [images, setImages] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const isDesktop = window.innerWidth >= 1024;
  const openImageModal = (img) => {
    setModalImage(img);
    onOpen();
  };

  const [showAllReviews, setShowAllReviews] = useState(false);
  // const [reviewStats, setReviewStats] = useState([]);
  // const handleHelpful = (reviewId) => {
  //   dispatch(markReviewHelpful(product._id, reviewId));
  // };
  // const handleNotHelpful = (reviewId) => {
  //   dispatch(markReviewNotHelpful(product._id, reviewId));
  // };

  const isDisabled = !selectedSize || sizeStock[selectedSize] === 0;
  // Check if logged-in user already reviewed this product
  const hasUserReviewed =
    userInfo &&
    product?.reviews?.some(
      (review) => review.user?.toString() === userInfo._id,
    );

  const handleHelpful = (reviewId) => {
    if (!userInfo) {
      toast({
        title: "Login Required",
        description: "Please login to mark helpful",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    dispatch(markReviewHelpful(product._id, reviewId));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    if (photos.length + files.length > 3) {
      toast({
        title: "Limit exceeded",
        description: "You can upload maximum 3 images",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    files.forEach((file) => {
      setPhotos((prev) => [...prev, file]);
      setPreviewImages((prev) => [...prev, URL.createObjectURL(file)]);
    });

    e.target.value = "";
  };

  const handleNotHelpful = (reviewId) => {
    if (!userInfo) {
      toast({
        title: "Login Required",
        description: "Please login to mark not helpful",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    dispatch(markReviewNotHelpful(product._id, reviewId));
  };

  // Update the useEffect that checks for purchased products
  useEffect(() => {
    if (!orders || orders.length === 0) return;

    const purchased = orders.some((order) => {
      if (!order?.isDelivered || !order?.orderItems) return false;

      return order.orderItems.some((item) => {
        if (!item || !item.product) return false;

        const productId =
          typeof item.product === "object"
            ? item.product._id?.toString()
            : item.product?.toString();

        return productId === id;
      });
    });

    setIsPurchased(purchased);
  }, [orders, id]);

  useEffect(() => {
    dispatch(listProductDetails(id));

    if (userInfo) {
      dispatch(listMyOrders());
    }

    if (product.category) {
      dispatch(Listproductbyfiters({ category: product.category }));
    }
  }, [dispatch, id, successProductReview, userInfo, product.category]);
  useEffect(() => {
    if (product?._id && product.category) {
      dispatch(Listproductbyfiters({ category: product.category }));
    }
  }, [dispatch, product]);

  useEffect(() => {
    if (product?.variants) {
      console.log("Product:", product.SKU);
      console.log(
        "Variants:",
        product.variants.map((v) => v.SKU),
      );
    }
  }, [product]);
  useEffect(() => {
    if (product?.productdetails?.stockBySize) {
      const stockMap = {};

      product.productdetails.stockBySize.forEach((item) => {
        stockMap[item.size] = item.stock;
      });

      setSizeStock(stockMap);
    }
  }, [product]);

  const productListByGroup = useSelector((state) => state.productListByGroup);
  const {
    loading: loadingVariants,
    products: variants,
    error: errorVariants,
  } = productListByGroup;

  useEffect(() => {
    if (product?.productGroupId) {
      dispatch(listProductsByGroupId(product.productGroupId));
    }
  }, [dispatch, product?.productGroupId, userInfo]);
  const submitHandler = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast({
        title: "Rating required",
        status: "warning",
        duration: 2000,
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        title: "Comment required",
        status: "warning",
        duration: 2000,
      });
      return;
    }

    const formData = new FormData();
    formData.append("rating", rating);
    formData.append("comment", comment);

    photos.forEach((photo) => {
      formData.append("photos", photo);
    });

    setReviewLoading(true); // 🔥 START LOADING

    try {
      await dispatch(createproductReview(id, formData));

      toast({
        title: "Review submitted",
        description: "Thanks for your feedback!",
        status: "success",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });

      // reset UI
      setrating(0);
      setcomment("");
      setPhotos([]);
      setPreviewImages([]);
      setShowCreateReview(false);
    } catch (err) {
      toast({
        title: "Submission failed",
        description: "Please try again",
        status: "error",
        duration: 3000,
      });
    } finally {
      setReviewLoading(false); // 🔥 STOP LOADING
    }
  };

  //Handler of button add to cart
  const addToCartHandler = () => {
    if (!userInfo) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your cart.",
        status: "warning",
        duration: 4000,
        position: "top-right",
        isClosable: true,
      });
      navigate("/login");
      return;
    }

    if (!selectedSize) {
      toast({
        title: "Size Required",
        description: "Please select a size before adding to cart.",
        status: "warning",
        duration: 4000,
        position: "top-right",
        isClosable: true,
      });
      return;
    }

    if (qty > sizeStock[selectedSize]) {
      toast({
        title: "Quantity exceeds stock",
        description: `Only ${sizeStock[selectedSize]} items available`,
        status: "warning",
        duration: 4000,
        position: "top-right",
        isClosable: true,
      });
      return;
    }

    // dispatch(addToCart(product._id, qty, selectedSize));
    dispatch(
      addToCart(product._id, {
        qty: 1,
        size: selectedSize,
        action: "add",
      }),
    );

    navigate("/cart");

    toast({
      title: "Product added to cart",
      description: "View your product in the cart page.",
      status: "success",
      duration: 5000,
      position: "bottom",
      isClosable: true,
    });
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const handleMouseEnter = (index) => {
    if (!isDesktop) return;
    setIsZoomVisible(true);
    setHoveredImageIndex(index);
  };
  const handleMouseLeave = () => {
    if (!isDesktop) return;
    setIsZoomVisible(false);
  };

  const isAllSizesOutOfStock =
    Object.values(sizeStock).length > 0 &&
    Object.values(sizeStock).every((stock) => stock === 0);

  const mrp = product?.oldPrice ?? 0; // Old / MRP
  const sellingPrice = product?.price ?? 0; // Normal price

  const hasSubscriptionDiscount =
    product?.subscriptionDiscountPercent > 0 &&
    product?.subscriptionPrice < sellingPrice;

  const finalPrice = hasSubscriptionDiscount
    ? product.subscriptionPrice
    : sellingPrice;

  // Show strike for BOTH subscribed & non-subscribed
  const showMrpStrike = mrp > finalPrice;
  const normalizeImagePath = (path) => {
    if (!path) return "";

    // Convert backslashes to forward slashes
    let normalized = path.replace(/\\/g, "/");

    // already correct (has /uploads/)
    if (normalized.includes("/uploads/")) return normalized;

    // fix broken path
    normalized = normalized
      .replace("/uploadsproductsimages", "/uploads/products/images/")
      .replace("uploadsproductsimages", "/uploads/products/images/")
      .replace("uploads/products/images/", "/uploads/products/images/"); // ensure leading slash

    // Ensure path starts with /
    if (!normalized.startsWith("/")) {
      normalized = "/" + normalized;
    }

    return normalized;
  };
  return (
    <>
      <Helmet>
        <title>{product?.brandname || "Product"}</title>
      </Helmet>
      <div className="productpage">
        {loading ? (
          <div className="loading-product">
            <HashLoader color={"#1e1e2c"} loading={loading} size={50} />
          </div>
        ) : error ? (
          <h2>{error} </h2>
        ) : (
          <div className="card-wrapper">
            <div className="card">
              <div className="product-imgs">
                <div className="img-select">
                  {product?.images?.map((image, index) => (
                    <div
                      className="img-item"
                      key={index}
                      onClick={() => setHoveredImageIndex(index)}
                    >
                      <Image
                        objectFit="cover"
                        width="100%"
                        height="100%"
                        src={`${API_URL}/${image}`}
                        alt={`Thumbnail-${index}`}
                      />
                    </div>
                  ))}
                </div>

                <div className="img-display">
                  <Image
                    src={`${API_URL}/${product.images[hoveredImageIndex]}`}
                    alt="Main Product"
                    w="100%"
                    h="100%"
                    objectFit="contain"
                    onMouseMove={handleMouseMove}
                    onMouseEnter={() => handleMouseEnter(hoveredImageIndex)}
                    onMouseLeave={handleMouseLeave}
                  />
                </div>

                {/* Zoomed Image View */}
                {isZoomVisible && isDesktop && (
                  <div
                    className="zoomed-image"
                    style={{
                      position: "absolute",
                      top: "120px",
                      left: "40px",
                      width: "650px",
                      height: "950px",
                      border: "2px solid #ddd",
                      backgroundImage: `url(${API_URL}${normalizeImagePath(
                        product.images[hoveredImageIndex],
                      )})`,
                      backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      backgroundSize: "300%",
                      backgroundRepeat: "no-repeat",
                      pointerEvents: "none",
                      zIndex: 999,
                    }}
                  />
                )}
              </div>

              <div className="product-content">
                <Flex
                  justifyContent="space-between"
                  alignItems="center"
                  color="#0000346"
                >
                  <h2 className="product-title">{product.brandname}</h2>
                  <Flex gap={1} mt="2">
                    <FavoriteButton productId={product._id} />
                    <ShareButton url={window.location.href} />
                  </Flex>
                </Flex>
                <p style={{ fontSize: "20px", fontWeight: "bold" }}>
                  {product.description}
                </p>
                <Text fontSize="24px" fontWeight="bold" mt={3}>
                  ₹{finalPrice}
                  {showMrpStrike && (
                    <Text
                      as="span"
                      fontSize="16px"
                      fontWeight="normal"
                      color="gray.500"
                      marginLeft={3}
                      textDecoration="line-through"
                    >
                      MRP: ₹{mrp}
                    </Text>
                  )}
                </Text>
                {hasSubscriptionDiscount && (
                  <Flex align="center" gap={2} mt={1}>
                    <Text fontSize="14px" color="green.600" fontWeight="bold">
                      {product.subscriptionDiscountPercent}% OFF with
                      Subscription
                    </Text>
                    <MdVerified color="green" />
                  </Flex>
                )}
                {/* <Text fontSize="13px" color="#ffb700" mb={3}>
                  (Inclusive of all taxes)
                </Text> */}
                <p
                  style={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    marginBottom: "5px",
                  }}
                >
                  Color: {product.productdetails?.color || "Not Available"}
                </p>
                <>
                  {(variants || []).length > 1 && (
                    <>
                      <Text fontSize="14px" fontWeight="medium" mb={2}>
                        Available Variants:
                      </Text>
                      <Flex gap={2} wrap="wrap" mb={4}>
                        {variants.map((variant) => {
                          const isCurrent = variant._id === product._id;
                          const thumbnail = variant.images[0] || ""; // Use first image as thumbnail

                          return (
                            <Box
                              key={variant._id}
                              onClick={() => {
                                if (!isCurrent)
                                  navigate(`/product/${variant._id}`);
                              }}
                              cursor={isCurrent ? "default" : "pointer"}
                              border="2px solid"
                              borderColor={isCurrent ? "black" : "gray.300"}
                              borderRadius="md"
                              width="60px"
                              height="60px"
                              overflow="hidden"
                              position="relative"
                              _hover={{
                                borderColor: !isCurrent ? "black" : undefined,
                                transform: !isCurrent
                                  ? "translateY(-2px)"
                                  : undefined,
                                boxShadow: !isCurrent ? "md" : undefined,
                              }}
                              transition="all 0.2s ease"
                            >
                              <Image
                                src={`${API_URL}/${thumbnail}`}
                                alt={`Variant-${variant._id}`}
                                objectFit="cover"
                                width="100%"
                                height="100%"
                              />
                              {isCurrent && (
                                <Box
                                  position="absolute"
                                  bottom="-6px"
                                  left="50%"
                                  transform="translateX(-50%)"
                                  w="0"
                                  h="0"
                                  borderLeft="6px solid transparent"
                                  borderRight="6px solid transparent"
                                  borderTop="6px solid black"
                                />
                              )}
                            </Box>
                          );
                        })}
                      </Flex>
                    </>
                  )}

                  <Divider my={3} />
                </>
                <div className="product-detail">
                  <div>
                    <Text fontSize="lg" fontWeight="bold">
                      Size: {selectedSize}
                    </Text>
                    <HStack spacing={2} mt={2}>
                      {availableSizes.map((size) => (
                        <Button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          border="2px solid"
                          borderColor="#039cc3ff"
                          bg={selectedSize === size ? "#039cc3ff" : "white"}
                          color={selectedSize === size ? "white" : "#039cc3ff"}
                          _hover={{
                            bg:
                              selectedSize === size ? "#039cc3ff" : "gray.100",
                          }}
                          px={5}
                          py={3}
                          minW="30px"
                          minH="50px"
                          fontSize="lg"
                          disabled={sizeStock[size] === 0} // 🔹 Disable if out of stock
                        >
                          {size} {sizeStock[size] === 0 && "(Out of Stock)"}
                        </Button>
                      ))}
                    </HStack>
                    <Divider my={3} />

                    <HStack spacing={4} mt="5" mb="5">
                      <Tooltip
                        label="Please select size to buy product"
                        isDisabled={!isDisabled}
                        placement="top"
                        hasArrow
                      >
                        <Button
                          onClick={addToCartHandler}
                          type="button"
                          disabled={
                            !selectedSize || sizeStock[selectedSize] === 0
                          }
                          border="2px solid"
                          borderColor="black"
                          bg="white"
                          color="black"
                          fontWeight="bold"
                          px={8} // Increase padding for width
                          py={5} // Increase padding for height
                          minW="150px" // Ensures buttons are wider
                          minH="60px"
                          borderRadius="md"
                          _hover={{ bg: "gray.100" }}
                        >
                          Buy Now
                        </Button>
                      </Tooltip>
                      <Tooltip
                        label="Please select size to add product"
                        isDisabled={!isDisabled}
                        placement="top"
                        hasArrow
                      >
                        <Button
                          onClick={addToCartHandler}
                          type="button"
                          disabled={
                            !selectedSize || sizeStock[selectedSize] === 0
                          }
                          bg="black"
                          color="white"
                          px={8} // Increase padding for width
                          py={5} // Increase padding for height
                          minW="150px" // Ensures buttons are wider
                          minH="60px"
                          borderRadius="md"
                          _hover={{ bg: "gray.800" }}
                        >
                          Add to Bag
                        </Button>
                      </Tooltip>
                    </HStack>

                    {isAllSizesOutOfStock && (
                      <Text
                        fontSize="lg"
                        fontWeight="bold"
                        color="red.500"
                        mt={3}
                        display="flex"
                        alignItems="center"
                      >
                        <MdDoNotDisturb
                          size="24"
                          style={{ marginRight: "5px" }}
                        />
                        OUT OF STOCK
                      </Text>
                    )}
                  </div>
                  <FeaturesSection />
                  <ProductSpecification product={product} />
                </div>{" "}
              </div>
            </div>
          </div>
        )}

        {/* === REVIEW SECTION === */}
        <Box className="REVIEWS" mt={8}>
          {/* Top Nav / Tabs */}
          <Flex
            mb={4}
            direction={{ base: "column", md: "row" }} // column on mobile, row on desktop
            align={{ base: "stretch", md: "center" }} // stretch full width on mobile
            justify="space-between"
            gap={2}
          >
            {/* Tabs */}
            <Flex
              direction={{ base: "column", md: "row" }} // stack on mobile
              gap={2}
              w={{ base: "100%", md: "auto" }}
            >
              {["All Reviews", "Overall Rating"].map((tab) => (
                <Button
                  key={tab}
                  size="sm"
                  variant={activeTab === tab ? "solid" : "outline"}
                  colorScheme="blue"
                  w={{ base: "100%", md: "auto" }} // full width on mobile
                >
                  {tab} {tab === "All Reviews" && `(${product.numReviews})`}
                </Button>
              ))}
            </Flex>

            {/* Write Review Button */}
            <Button
              mt={{ base: 2, md: 0 }} // spacing on mobile
              w={{ base: "100%", md: "auto" }} // full width on mobile
              colorScheme="blue"
              onClick={() => setShowCreateReview((prev) => !prev)}
            >
              Write a Review
            </Button>
          </Flex>

          {/* === OVERALL RATING SECTION === */}
          <Flex
            direction={{ base: "column", md: "row" }} // column on mobile, row on desktop
            justify="space-between"
            align={{ base: "flex-start", md: "center" }}
            p={4}
            bg="gray.50"
            borderRadius="md"
            mb={6}
            gap={3} // spacing between stacked items on mobile
          >
            <Box>
              <Text fontSize="lg" fontWeight="bold">
                Overall Rating
              </Text>

              <Flex
                direction={{ base: "column", md: "row" }} // stack vertically on mobile
                align={{ base: "flex-start", md: "center" }}
                gap={2} // spacing between number, stars, and review count
                mt={1}
              >
                {/* Rating number */}
                <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold">
                  {product.rating?.toFixed(1)}
                </Text>

                {/* Stars */}
                <Rating value={product.rating} />

                {/* Total reviews */}
                <Text color="gray.500" fontSize={{ base: "sm", md: "md" }}>
                  ({product.numReviews} reviews)
                </Text>
              </Flex>

              {/* Product image + rating (optional) */}
              {product.images?.length > 0 && (
                <Flex
                  mt={2}
                  align="center"
                  gap={2}
                  direction={{ base: "column", md: "row" }} // stack on mobile
                >
                  <Image
                    src={`${process.env.REACT_APP_API_URL}/${product.images[0]}`}
                    alt="Product"
                    boxSize={{ base: "30px", md: "40px" }}
                    objectFit="cover"
                    borderRadius="md"
                  />
                  <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600">
                    Product Rating: {product.rating?.toFixed(1)}
                  </Text>
                </Flex>
              )}
            </Box>
          </Flex>

          {/* Reviews Carousel */}
          <Box position="relative">
            {activeTab === "Overall Rating" ? (
              <Flex align="center" gap={4} p={4} bg="gray.50" borderRadius="md">
                <Text fontSize="2xl" fontWeight="bold">
                  {product.rating?.toFixed(1)}
                </Text>
                <Rating value={product.rating} />
                <Text>({product.numReviews} reviews)</Text>
              </Flex>
            ) : (
              <>
                {/* Left Arrow */}
                {product.reviews.length >= 5 && (
                  <Button
                    display="flex" // always visible
                    position="absolute"
                    left={-2}
                    top="50%"
                    transform="translateY(-50%)"
                    zIndex={10}
                    size="lg"
                    fontSize="2xl"
                    fontWeight="bold"
                    borderRadius="full"
                    bg="whiteAlpha.800"
                    _hover={{ bg: "blue.200" }}
                    onClick={() =>
                      carouselRef.current.scrollBy({
                        left: -320,
                        behavior: "smooth",
                      })
                    }
                  >
                    &lt;
                  </Button>
                )}
                {/* Carousel */}
                <Box
                  ref={carouselRef}
                  display="flex"
                  overflowX="hidden"
                  gap={4}
                  py={2}
                  px={1}
                >
                  {product.reviews
                    .filter((r) => {
                      if (!r.approved) return false;
                      if (activeTab === "All Reviews") return true;
                      if (activeTab === "Images") return r.photos?.length > 0;
                      return true;
                    })
                    .map((review) => (
                      <Box
                        key={review._id}
                        flex="0 0 300px"
                        p={4}
                        bg="white"
                        borderRadius="md"
                        boxShadow="sm"
                      >
                        <Flex gap={3} align="center" mb={2}>
                          <Avatar
                            name={review.user?.name}
                            src={review.user?.profilePicture}
                            size="sm"
                          />

                          <Box>
                            <Text fontWeight="bold">
                              {review.user?.name || "User"}
                            </Text>
                            <Flex
                              align="center"
                              gap={1}
                              fontSize="xs"
                              color="gray.500"
                            >
                              <MdVerified /> Verified Buyer
                            </Flex>
                          </Box>
                        </Flex>

                        <Rating value={review.rating} />
                        <Text mt={2} fontSize="sm" noOfLines={3}>
                          {review.comment}
                        </Text>

                        {review.photos?.length > 0 && (
                          <Flex mt={2} gap={2}>
                            {review.photos?.map((photo, idx) => (
                              <Image
                                key={idx}
                                src={`${API_URL}/${photo}`}
                                boxSize="60px"
                                objectFit="cover"
                                borderRadius="md"
                                cursor="pointer"
                                onClick={() => openImageModal(photo)} // <-- open modal now
                              />
                            ))}
                          </Flex>
                        )}

                        <Text fontSize="xs" color="gray.400" mt={2}>
                          {review.createdAt?.substring(0, 10)}
                        </Text>

                        <Flex gap={3} mt={2} align="center">
                          <Button
                            size="xs"
                            leftIcon={<FaThumbsUp />}
                            variant="ghost"
                            onClick={() => handleHelpful(review._id)}
                          >
                            Helpful {review.helpful ?? 0}
                          </Button>

                          <Button
                            size="xs"
                            leftIcon={<FaThumbsDown />}
                            variant="ghost"
                            onClick={() => handleNotHelpful(review._id)}
                          >
                            Not Helpful {review.notHelpful ?? 0}
                          </Button>
                        </Flex>
                      </Box>
                    ))}
                </Box>

                {/* Right Arrow */}
                {product.reviews.length >= 5 && (
                  <Button
                    display="flex" // always visible
                    position="absolute"
                    right={-2}
                    top="50%"
                    transform="translateY(-50%)"
                    zIndex={10}
                    size="lg"
                    fontSize="2xl"
                    fontWeight="bold"
                    borderRadius="full"
                    bg="whiteAlpha.800"
                    _hover={{ bg: "blue.200" }}
                    onClick={() =>
                      carouselRef.current.scrollBy({
                        left: 320,
                        behavior: "smooth",
                      })
                    }
                  >
                    &gt;
                  </Button>
                )}
              </>
            )}
          </Box>
          <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
            <ModalOverlay />
            <ModalContent bg="transparent" boxShadow="none">
              <ModalCloseButton color="white" />
              <ModalBody p={0}>
                <Image
                  src={`${API_URL}/${modalImage}`}
                  alt="Preview"
                  w="100%"
                  h="auto"
                  borderRadius="md"
                />
              </ModalBody>
            </ModalContent>
          </Modal>

          {/* === WRITE REVIEW MODAL === */}
          <Modal
            isOpen={showCreateReview}
            onClose={() => setShowCreateReview(false)}
            isCentered
            size="lg"
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Write a Review</ModalHeader>
              <ModalCloseButton />

              <ModalBody pb={6}>
                {!userInfo ? (
                  <Text>
                    Please <Link to="/login">Sign In</Link> to write a review.
                  </Text>
                ) : hasUserReviewed ? (
                  <Text color="green.600" fontWeight="bold">
                    ✅ You have already reviewed this product
                  </Text>
                ) : (
                  <FormControl>
                    <FormLabel>Rating</FormLabel>

                    <HStack spacing={1} mb={3}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Box
                          key={star}
                          cursor="pointer"
                          onClick={() => setrating(star)}
                        >
                          {rating >= star ? (
                            <AiFillStar size={28} color="#FFD700" />
                          ) : (
                            <AiOutlineStar size={28} color="#CBD5E0" />
                          )}
                        </Box>
                      ))}
                    </HStack>

                    <FormLabel>Comment</FormLabel>
                    <Textarea
                      value={comment}
                      onChange={(e) => setcomment(e.target.value)}
                      placeholder="Share your experience"
                    />

                    <FormLabel mt={3}>
                      Upload Photos{" "}
                      <Text as="span" fontSize="sm" color="gray.500">
                        (optional, max 3)
                      </Text>
                    </FormLabel>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      multiple
                    />

                    {previewImages.length > 0 && (
                      <Flex mt={3} gap={3}>
                        {previewImages.map((img, index) => (
                          <Image
                            key={index}
                            src={img}
                            boxSize="80px"
                            borderRadius="md"
                            objectFit="cover"
                          />
                        ))}
                      </Flex>
                    )}

                    <Button
                      mt={4}
                      w="100%"
                      colorScheme="blue"
                      onClick={submitHandler}
                      isLoading={reviewLoading}
                      loadingText="Submitting..."
                    >
                      Submit Review
                    </Button>
                  </FormControl>
                )}
              </ModalBody>
            </ModalContent>
          </Modal>
        </Box>

        {/* Related Products Section */}
        <div
          className="related-products-section"
          px={{ base: 4, md: 12 }}
          my={8}
        >
          <Heading as="h3" size="sm" mb={4} ml={20}>
            RECOMMENDED
          </Heading>
          {relatedLoading ? (
            <HashLoader color={"#36D7B7"} />
          ) : (
            <div className="related-products-container">
              {relatedProducts
                .filter((p) => p._id !== product._id) // Exclude current product
                .slice(0, 6) // Show only 6 related products
                .map((relatedProduct) => (
                  <CardProduct
                    key={relatedProduct._id}
                    product={relatedProduct}
                  />
                ))}
            </div>
          )}
        </div>
      </div>
      <Trust />
    </>
  );
};

export default Productpage;
