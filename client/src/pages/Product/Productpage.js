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
  const imgs = document.querySelectorAll(".img-select a");
  const imgShowcase = useRef(null);
  const imgBtns = [...imgs];
  let imgId = 1;
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
      (review) => review.user?.toString() === userInfo._id
    );

  const togglePDF = () => setShowPDF((prev) => !prev);
  imgBtns.forEach((imgItem) => {
    imgItem.addEventListener("click", (event) => {
      event.preventDefault();
      imgId = imgItem.dataset.id;
      slideImage();
    });
  });

  function slideImage() {
    const displayWidth = document.querySelector(
      ".img-showcase img:first-child"
    ).clientWidth;
    imgShowcase.current.style.transform = `translateX(${
      -(imgId - 1) * displayWidth
    }px)`;
  }
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
    if (successProductReview) {
      toast({
        title: "Review Submitted",
        description: "Your review is successfully noted!",
        status: "success",
        duration: 4000,
        position: "top-right",
        isClosable: true,
      });

      setrating(0);
      setcomment("");
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
    }

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
        product.variants.map((v) => v.SKU)
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
    if (product?.productGroupId && userInfo?.token) {
      dispatch(listProductsByGroupId(product.productGroupId));
    }
  }, [dispatch, product?.productGroupId, userInfo]);

  const submitHandler = () => {
    if (rating === 0 || comment.trim() === "") {
      toast({
        title: "Missing fields",
        description: "Please provide rating and comment",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    dispatch(createproductReview(id, { rating, comment }));
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

    dispatch(addToCart(product._id, qty, selectedSize));

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
    setIsZoomVisible(true);
    setHoveredImageIndex(index);
  };
  const handleMouseLeave = () => setIsZoomVisible(false);

  const isAllSizesOutOfStock =
    Object.values(sizeStock).length > 0 &&
    Object.values(sizeStock).every((stock) => stock === 0);

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
                    <div className="img-item" key={index}>
                      <a href="#" data-id={index + 1}>
                        <Image
                          objectFit="cover"
                          width="100%"
                          height="100%"
                          src={image}
                          alt={`Thumbnail-${index}`}
                        />
                      </a>
                    </div>
                  ))}
                </div>
                <div
                  className="img-display"
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => handleMouseEnter(hoveredImageIndex)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div ref={imgShowcase} className="img-showcase">
                    {product.images.map((image, index) => (
                      <Image
                        key={index}
                        src={image}
                        alt={`Product-${index}`}
                        onMouseEnter={() => handleMouseEnter(index)}
                      />
                    ))}
                  </div>
                </div>

                {/* Zoomed Image View */}
                {isZoomVisible && (
                  <div
                    className="zoomed-image"
                    style={{
                      backgroundImage: `url(${product.images[hoveredImageIndex]})`,
                      backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      backgroundSize: "200%",
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
                <Text fontSize="20px" fontWeight="bold" mb={1} mt={3}>
                  ₹{product.price}
                  <Text
                    as="span"
                    fontSize="20px"
                    fontWeight="normal"
                    color="#039cc3ff"
                    marginLeft={2}
                    textDecoration="line-through"
                  >
                    MRP: ₹{product.oldPrice}
                  </Text>
                  <Text fontSize="13px" color="#ffb700" mb={3}>
                    (Inclusive of all taxes)
                  </Text>
                </Text>
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
                                src={thumbnail}
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
                          px={6}
                          py={4}
                          minW="60px"
                          minH="60px"
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
        <div className="REVIEWS">
          <h1>Reviews :</h1>

          {/* No Reviews */}
          {product?.reviews?.length === 0 && <h2>NO REVIEWS</h2>}

          {/* Show Approved Reviews */}
          {/* <div>
            {product.reviews &&
              product.reviews
                .filter((review) => review.approved)
                .map((review) => (
                  <div key={review._id} className="review">
                    <h4>{review.name}</h4>

                    <div className="Ratingreview">
                      <Rating value={review.rating} />
                    </div>

                    <p className="commentreview">{review.comment}</p>

                    <p className="datereview">
                      {review.createdAt.substring(0, 10)}
                    </p>
                  </div>
                ))}
          </div> */}
          {product.reviews?.map((review) => {
            return (
              <Box
                key={review._id}
                border="1px solid #e2e8f0"
                borderRadius="xl"
                p={4}
                mb={4}
                bg="white"
                boxShadow="sm"
                w="full"
                _hover={{ boxShadow: "md" }}
                transition="all 0.3s"
              >
                <Flex gap={6} w="full">
                  {/* LEFT COLUMN: Avatar + Name + Verified */}
                  <Flex flex="1" align="flex-start" gap={3}>
                    <Box
                      bgGradient="linear(to-r, blue.400, blue.600)"
                      color="white"
                      borderRadius="full"
                      w="60px"
                      h="60px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontWeight="bold"
                      fontSize="2xl"
                      boxShadow="sm"
                    >
                      {review.user?.name
                        ? review.user.name.charAt(0).toUpperCase()
                        : "U"}
                    </Box>

                    <Box>
                      <Text fontWeight="bold" fontSize="md">
                        {review.user?.name || "Verified User"}
                      </Text>
                      <Flex
                        align="center"
                        gap={1}
                        fontSize="sm"
                        color="green.500"
                      >
                        <MdVerified />
                        Verified Buyer
                      </Flex>
                    </Box>
                  </Flex>

                  {/* RIGHT COLUMN: Comment + Stats */}
                  <Flex flex="3" direction="column" gap={2} w="full">
                    {/* Comment */}
                    <Text
                      fontSize="sm"
                      color="gray.700"
                      pl={2}
                      borderLeft="3px solid #3182ce"
                    >
                      “{review.comment}”
                    </Text>

                    {/* Recommended + Star Rating + Date */}
                    <Flex
                      align="center"
                      gap={4}
                      justify="space-between"
                      flexWrap="wrap"
                    >
                      <Flex align="center" gap={2}>
                        <FaCheckCircle color="green" />
                        <Text fontSize="sm" color="green.600">
                          Recommended
                        </Text>
                        <Rating value={review.rating} />
                      </Flex>

                      {/* Date */}
                      <Text fontSize="xs" color="gray.500">
                        {review.createdAt?.substring(0, 10)}
                      </Text>
                    </Flex>

                    {/* Helpful / Not Helpful */}
                    <Flex gap={4} mt={2}>
                      <Button
                        size="sm"
                        variant="outline"
                        leftIcon={<FaThumbsUp />}
                        onClick={() => handleHelpful(review._id)}
                      >
                        Helpful ({review.helpful ?? 0})
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        leftIcon={<FaThumbsDown />}
                        onClick={() => handleNotHelpful(review._id)}
                      >
                        Not Helpful ({review.notHelpful ?? 0})
                      </Button>
                    </Flex>
                  </Flex>
                </Flex>
              </Box>
            );
          })}

          <div className="createreview">
            <h1>Create New Review :</h1>

            {errorProductReview && <h2>{errorProductReview}</h2>}

            {/* Not logged in */}
            {!userInfo && (
              <p>
                Please <Link to="/login">Sign In</Link> to write a review.
              </p>
            )}

            {/* Already reviewed */}
            {userInfo && hasUserReviewed && (
              <Text color="green.600" fontWeight="bold">
                ✅ You have already reviewed this product
              </Text>
            )}

            {/* Logged in & NOT reviewed yet */}
            {userInfo && !hasUserReviewed && (
              <FormControl>
                <FormLabel>Rating :</FormLabel>
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

                <FormLabel>Comment :</FormLabel>
                <Textarea
                  onChange={(e) => setcomment(e.target.value)}
                  placeholder="Leave Comment here :"
                />

                <Button colorScheme="blue" onClick={submitHandler} mt={3}>
                  Submit
                </Button>
              </FormControl>
            )}
          </div>
        </div>

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
