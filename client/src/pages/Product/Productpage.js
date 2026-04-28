import React, { useEffect, useState, useRef } from "react";
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
import WashCareDisplay from "../../components/WashCareDisplay";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { addToCart } from "../../actions/cartActions";
import ShareButton from "./ShareButton";
import { MdDoNotDisturb, MdVerified } from "react-icons/md";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import {
  Image,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  useToast,
  Heading,
  HStack,
  Text,
  Divider,
  Box,
  Flex,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  ModalHeader,
  Avatar,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import HashLoader from "react-spinners/HashLoader";
import { useParams } from "react-router-dom";
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

// ── Shimmer skeleton for image slots ────────────────────────────────────────
const ImageSkeleton = ({ w, h, borderRadius = "md" }) => (
  <Skeleton
    w={w}
    h={h}
    borderRadius={borderRadius}
    startColor="gray.100"
    endColor="gray.300"
    style={{ flexShrink: 0 }}
  />
);

// ── Single image with loading state ─────────────────────────────────────────
const LoadableImage = ({
  src,
  alt,
  skeletonW,
  skeletonH,
  borderRadius = "md",
  style = {},
  objectFit = "cover",
  ...rest
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setError(false);
  }, [src]);

  return (
    <Box
      position="relative"
      w={skeletonW}
      h={skeletonH}
      style={style}
      {...rest}
    >
      {!loaded && !error && (
        <Skeleton
          position="absolute"
          inset={0}
          borderRadius={borderRadius}
          startColor="gray.100"
          endColor="gray.300"
        />
      )}

      <Image
        src={src}
        alt={alt}
        w="100%"
        h="100%"
        objectFit={objectFit}
        borderRadius={borderRadius}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setLoaded(true);
          setError(true);
        }}
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.3s ease",
          display: "block",
        }}
      />

      {error && (
        <Flex
          position="absolute"
          inset={0}
          align="center"
          justify="center"
          bg="gray.100"
          borderRadius={borderRadius}
        >
          <Text fontSize="xs" color="gray.400">
            No image
          </Text>
        </Flex>
      )}
    </Box>
  );
};

// ── Inline review photos (flat grid, no swiper) ───────────────────────────
const ReviewPhotoGrid = ({ photos, apiUrl, onOpenModal }) => {
  return (
    <Flex mt={2} gap={2} flexWrap="wrap">
      {photos.map((photo, idx) => (
        <Box
          key={idx}
          w="90px"
          h="90px"
          borderRadius="md"
          overflow="hidden"
          bg="gray.50"
          cursor="pointer"
          border="1px solid"
          borderColor="gray.200"
          flexShrink={0}
          onClick={() => onOpenModal(photos, idx)}
          _hover={{ opacity: 0.85 }}
          transition="opacity 0.15s"
        >
          <Image
            src={`${apiUrl}/${photo}`}
            alt={`Review photo ${idx + 1}`}
            w="100%"
            h="100%"
            objectFit="cover"
          />
        </Box>
      ))}
    </Flex>
  );
};

// ── Pinch zoom hook for mobile ────────────────────────────────────────────
const usePinchZoom = () => {
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const lastDist = useRef(null);
  const lastTranslate = useRef({ x: 0, y: 0 });
  const lastTouchMid = useRef({ x: 0, y: 0 });

  const reset = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  };

  const onTouchStart = (e) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastDist.current = Math.hypot(dx, dy);
      lastTouchMid.current = {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
      };
      lastTranslate.current = translate;
    }
  };

  const onTouchMove = (e) => {
    if (e.touches.length === 2 && lastDist.current) {
      e.preventDefault(); // stop page scroll during pinch
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const ratio = dist / lastDist.current;
      setScale((prev) => Math.min(Math.max(prev * ratio, 1), 4));
      lastDist.current = dist;
    }
  };

  const onTouchEnd = (e) => {
    if (e.touches.length < 2) lastDist.current = null;
  };

  return { scale, translate, reset, onTouchStart, onTouchMove, onTouchEnd };
};

const Productpage = () => {
  const { id } = useParams();
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZoomVisible, setIsZoomVisible] = useState(false);
  const [hoveredImageIndex, setHoveredImageIndex] = useState(0);
  const [isZoomClosing, setIsZoomClosing] = useState(false);
  const [reviewImageModal, setReviewImageModal] = useState({
    isOpen: false,
    photos: [],
    currentIndex: 0,
  });
  const [loadedImages, setLoadedImages] = useState({});
  const [mainImgLoaded, setMainImgLoaded] = useState(false);
  const pinch = usePinchZoom();
  const relatedProductsList = useSelector((state) => state.productList);
  const { products: relatedProducts = [], loading: relatedLoading } =
    relatedProductsList || {};
  const cart = useSelector((state) => state.cart);
  const { cartItems = [] } = cart || {};
  const orderListMy = useSelector((state) => state.orderMylist);
  const { orders = [] } = orderListMy || {};
  const [qty, setQty] = useState(1);
  const [rating, setrating] = useState(0);
  const [comment, setcomment] = useState("");
  const toast = useToast();
  const imgDisplayRef = useRef(null);
  const [zoomPanelPos, setZoomPanelPos] = useState({ top: 0, left: 0 });
  const dispatch = useDispatch();
  const productDetails = useSelector((state) => state.productDetails);
  const { loading = false, error, product = {} } = productDetails || {};
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin || {};
  const [isPurchased, setIsPurchased] = useState(false);
  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const { success: successProductReview = false, error: errorProductReview } =
    productReviewCreate || {};
  const availableSizes = product?.productdetails?.sizes || [];
  const [selectedSize, setSelectedSize] = useState("");
  const [sizeStock, setSizeStock] = useState({});
  const [showPDF, setShowPDF] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [activeTab, setActiveTab] = useState("All Reviews");
  const [showCreateReview, setShowCreateReview] = useState(false);
  const carouselRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalIndex, setModalIndex] = useState(0);
  const [reviewLoading, setReviewLoading] = useState(false);

  // Check if window is available (SSR safety)
  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;

  // Touch refs — shared between slider and modal
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  // Review image modal touch refs
  const reviewModalTouchStartX = useRef(null);
  const reviewModalTouchEndX = useRef(null);

  // Modal swipe handlers refs
  const modalTouchStartX = useRef(null);
  const modalTouchEndX = useRef(null);

  useEffect(() => {
    setLoadedImages({});
    setMainImgLoaded(false);
    setHoveredImageIndex(0);
  }, [product?._id]);

  useEffect(() => {
    setMainImgLoaded(false);
  }, [hoveredImageIndex]);

  const openImageModal = (index) => {
    setModalIndex(index);
    onOpen();
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    const totalImages = product?.images?.length || 0;
    if (Math.abs(diff) > 40) {
      if (diff > 0) setHoveredImageIndex((prev) => (prev + 1) % totalImages);
      else
        setHoveredImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleModalTouchStart = (e) => {
    modalTouchStartX.current = e.targetTouches[0].clientX;
  };

  const handleModalTouchMove = (e) => {
    modalTouchEndX.current = e.targetTouches[0].clientX;
  };

  const handleModalTouchEnd = () => {
    if (modalTouchStartX.current === null || modalTouchEndX.current === null)
      return;
    const diff = modalTouchStartX.current - modalTouchEndX.current;
    const totalImages = product?.images?.length || 0;
    if (diff > 0) {
      setModalIndex((prev) => (prev + 1) % totalImages);
      pinch.reset();
    } else {
      setModalIndex((prev) => (prev - 1 + totalImages) % totalImages);
      pinch.reset();
    }

    modalTouchStartX.current = null;
    modalTouchEndX.current = null;
  };

  // Review image modal touch handlers
  const handleReviewModalTouchStart = (e) => {
    reviewModalTouchStartX.current = e.targetTouches[0].clientX;
  };

  const handleReviewModalTouchMove = (e) => {
    reviewModalTouchEndX.current = e.targetTouches[0].clientX;
  };

  const handleReviewModalTouchEnd = () => {
    if (
      reviewModalTouchStartX.current === null ||
      reviewModalTouchEndX.current === null
    )
      return;
    const diff = reviewModalTouchStartX.current - reviewModalTouchEndX.current;
    const total = reviewImageModal.photos.length;
    if (Math.abs(diff) > 40) {
      setReviewImageModal((prev) => ({
        ...prev,
        currentIndex:
          diff > 0
            ? (prev.currentIndex + 1) % total
            : (prev.currentIndex - 1 + total) % total,
      }));
    }
    reviewModalTouchStartX.current = null;
    reviewModalTouchEndX.current = null;
  };

  // Open review photo modal helper
  const openReviewPhotoModal = (photos, startIndex) => {
    setReviewImageModal({ isOpen: true, photos, currentIndex: startIndex });
  };

  const isDisabled = !selectedSize || sizeStock[selectedSize] === 0;

  const hasUserReviewed =
    userInfo &&
    product?.reviews?.some((r) => r.user?.toString() === userInfo._id);

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
    const files = Array.from(e.target.files || []);
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
    if (userInfo) dispatch(listMyOrders());
    if (product.category)
      dispatch(Listproductbyfiters({ category: product.category }));
  }, [dispatch, id, successProductReview, userInfo, product.category]);

  useEffect(() => {
    if (product?.productGroupId)
      dispatch(listProductsByGroupId(product.productGroupId));
  }, [dispatch, product?.productGroupId]);

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
    loading: loadingVariants = false,
    products: variants = [],
    error: errorVariants,
  } = productListByGroup || {};

  const submitHandler = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast({ title: "Rating required", status: "warning", duration: 2000 });
      return;
    }
    if (!comment.trim()) {
      toast({ title: "Comment required", status: "warning", duration: 2000 });
      return;
    }

    const formData = new FormData();
    formData.append("rating", rating);
    formData.append("comment", comment);
    photos.forEach((photo) => formData.append("photos", photo));

    setReviewLoading(true);
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
      setReviewLoading(false);
    }
  };

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
    dispatch(
      addToCart(product._id, { qty: 1, size: selectedSize, action: "add" }),
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
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const handleMouseEnter = (index) => {
    if (!isDesktop) return;
    setHoveredImageIndex(index);
    if (imgDisplayRef.current) {
      const rect = imgDisplayRef.current.getBoundingClientRect();
      setZoomPanelPos({ top: rect.top, left: rect.right + 20 });
    }
    setIsZoomVisible(true);
  };

  const handleMouseLeave = () => {
    if (!isDesktop) return;
    setIsZoomClosing(true);
    setTimeout(() => {
      setIsZoomVisible(false);
      setIsZoomClosing(false);
    }, 200);
  };

  const isAllSizesOutOfStock =
    Object.values(sizeStock).length > 0 &&
    Object.values(sizeStock).every((s) => s === 0);

  const mrp = product?.oldPrice ?? 0;
  const sellingPrice = product?.price ?? 0;
  const hasSubscriptionDiscount =
    product?.subscriptionDiscountPercent > 0 &&
    product?.subscriptionPrice < sellingPrice;
  const finalPrice = hasSubscriptionDiscount
    ? product.subscriptionPrice
    : sellingPrice;
  const showMrpStrike = mrp > finalPrice;

  const normalizeImagePath = (path) => {
    if (!path) return "";
    let normalized = path.replace(/\\/g, "/");
    if (normalized.includes("/uploads/")) return normalized;
    normalized = normalized
      .replace("/uploadsproductsimages", "/uploads/products/images/")
      .replace("uploadsproductsimages", "/uploads/products/images/")
      .replace("uploads/products/images/", "/uploads/products/images/");
    if (!normalized.startsWith("/")) normalized = "/" + normalized;
    return normalized;
  };

  const totalImages = product?.images?.length || 0;
  const THUMB_SKELETON_COUNT = 4;

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
          <h2>{error}</h2>
        ) : (
          <div className="card-wrapper">
            <div className="card">
              <div
                className="product-imgs"
                style={{ position: "relative", overflow: "visible" }}
              >
                {/* ── DESKTOP: vertical thumbnail strip ── */}
                <div className="img-select img-select--desktop">
                  {loading
                    ? Array.from({ length: THUMB_SKELETON_COUNT }).map(
                        (_, i) => (
                          <div className="img-item" key={`skel-${i}`}>
                            <Skeleton
                              w="100%"
                              h="100%"
                              borderRadius="md"
                              startColor="gray.100"
                              endColor="gray.300"
                            />
                          </div>
                        ),
                      )
                    : product?.images?.map((image, index) => (
                        <div
                          className="img-item"
                          key={index}
                          onClick={() => setHoveredImageIndex(index)}
                          style={{
                            outline:
                              hoveredImageIndex === index
                                ? "2px solid #039cc3"
                                : "none",
                            borderRadius: 6,
                            overflow: "hidden",
                          }}
                        >
                          <Box position="relative" w="100%" h="100%">
                            {!loadedImages[index] && (
                              <Skeleton
                                position="absolute"
                                inset={0}
                                startColor="gray.100"
                                endColor="gray.300"
                                borderRadius="md"
                              />
                            )}
                            <Image
                              objectFit="cover"
                              width="100%"
                              height="100%"
                              src={`${API_URL}/${image}`}
                              alt={`Thumbnail-${index}`}
                              onLoad={() =>
                                setLoadedImages((prev) => ({
                                  ...prev,
                                  [index]: true,
                                }))
                              }
                              style={{
                                opacity: loadedImages[index] ? 1 : 0,
                                transition: "opacity 0.25s ease",
                              }}
                            />
                          </Box>
                        </div>
                      ))}
                </div>

                {/* ── MOBILE / TABLET: thumbnail strip + swipe slider ── */}
                <div className="mobile-img-wrapper">
                  <div className="mobile-thumb-strip">
                    {loading
                      ? Array.from({ length: THUMB_SKELETON_COUNT }).map(
                          (_, i) => (
                            <div
                              key={`mskel-${i}`}
                              className="mobile-thumb-item"
                            >
                              <Skeleton
                                w="100%"
                                h="100%"
                                borderRadius="md"
                                startColor="gray.100"
                                endColor="gray.300"
                              />
                            </div>
                          ),
                        )
                      : product?.images?.map((image, index) => (
                          <div
                            key={index}
                            className={`mobile-thumb-item${hoveredImageIndex === index ? " mobile-thumb-item--active" : ""}`}
                            onClick={() => setHoveredImageIndex(index)}
                          >
                            <Box position="relative" w="100%" h="100%">
                              {!loadedImages[`mob-${index}`] && (
                                <Skeleton
                                  position="absolute"
                                  inset={0}
                                  startColor="gray.100"
                                  endColor="gray.300"
                                  borderRadius="md"
                                />
                              )}
                              <Image
                                src={`${API_URL}/${image}`}
                                alt={`Thumb-${index}`}
                                objectFit="cover"
                                w="100%"
                                h="100%"
                                onLoad={() =>
                                  setLoadedImages((prev) => ({
                                    ...prev,
                                    [`mob-${index}`]: true,
                                  }))
                                }
                                style={{
                                  opacity: loadedImages[`mob-${index}`] ? 1 : 0,
                                  transition: "opacity 0.25s ease",
                                }}
                              />
                            </Box>
                          </div>
                        ))}
                  </div>

                  {/* Right: swipe slider */}
                  <div
                    className="mobile-slider"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    <div
                      className="mobile-slider__track"
                      style={{
                        transform: `translateX(-${hoveredImageIndex * 100}%)`,
                      }}
                    >
                      {loading
                        ? Array.from({ length: THUMB_SKELETON_COUNT }).map(
                            (_, i) => (
                              <div
                                className="mobile-slider__slide"
                                key={`slide-skel-${i}`}
                              >
                                <Skeleton
                                  w="100%"
                                  h="100%"
                                  startColor="gray.100"
                                  endColor="gray.300"
                                />
                              </div>
                            ),
                          )
                        : product?.images?.map((image, index) => (
                            <div className="mobile-slider__slide" key={index}>
                              <Box position="relative" w="100%" h="100%">
                                {!loadedImages[`slide-${index}`] && (
                                  <Skeleton
                                    position="absolute"
                                    inset={0}
                                    startColor="gray.100"
                                    endColor="gray.300"
                                  />
                                )}
                                <Image
                                  src={`${API_URL}/${image}`}
                                  alt={`Product-${index}`}
                                  objectFit="contain"
                                  w="100%"
                                  h="100%"
                                  cursor="pointer"
                                  onClick={() => openImageModal(index)}
                                  onLoad={() =>
                                    setLoadedImages((prev) => ({
                                      ...prev,
                                      [`slide-${index}`]: true,
                                    }))
                                  }
                                  style={{
                                    opacity: loadedImages[`slide-${index}`]
                                      ? 1
                                      : 0,
                                    transition: "opacity 0.25s ease",
                                  }}
                                />
                              </Box>
                            </div>
                          ))}
                    </div>

                    {/* Prev / Next arrows */}
                    {totalImages > 1 && (
                      <>
                        <button
                          className="mobile-slider__arrow mobile-slider__arrow--prev"
                          onClick={() =>
                            setHoveredImageIndex(
                              (prev) => (prev - 1 + totalImages) % totalImages,
                            )
                          }
                          aria-label="Previous image"
                        >
                          &#8249;
                        </button>
                        <button
                          className="mobile-slider__arrow mobile-slider__arrow--next"
                          onClick={() =>
                            setHoveredImageIndex(
                              (prev) => (prev + 1) % totalImages,
                            )
                          }
                          aria-label="Next image"
                        >
                          &#8250;
                        </button>
                      </>
                    )}

                    {/* Dot indicators */}
                    {totalImages > 1 && (
                      <div className="mobile-slider__dots">
                        {product.images.map((_, index) => (
                          <button
                            key={index}
                            className={`mobile-slider__dot${hoveredImageIndex === index ? " mobile-slider__dot--active" : ""}`}
                            onClick={() => setHoveredImageIndex(index)}
                            aria-label={`Go to image ${index + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* ── DESKTOP: main image with zoom ── */}
                <div
                  className="img-display img-display--desktop"
                  ref={imgDisplayRef}
                  style={{
                    position: "relative",
                    overflow: "visible",
                    cursor: "crosshair",
                  }}
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => handleMouseEnter(hoveredImageIndex)}
                  onMouseLeave={handleMouseLeave}
                >
                  {!mainImgLoaded && (
                    <Skeleton
                      position="absolute"
                      inset={0}
                      startColor="gray.100"
                      endColor="gray.300"
                      borderRadius="md"
                      zIndex={1}
                    />
                  )}

                  <Image
                    src={`${API_URL}/${product.images?.[hoveredImageIndex] || ""}`}
                    alt="Main Product"
                    w="100%"
                    h="100%"
                    objectFit="contain"
                    onLoad={() => setMainImgLoaded(true)}
                    onError={() => setMainImgLoaded(true)}
                    style={{
                      display: "block",
                      pointerEvents: "none",
                      opacity: mainImgLoaded ? 1 : 0,
                      transition: "opacity 0.3s ease",
                    }}
                  />

                  {isZoomVisible &&
                    !isZoomClosing &&
                    isDesktop &&
                    mainImgLoaded && (
                      <div
                        style={{
                          position: "absolute",
                          width: "130px",
                          height: "130px",
                          border: "2px solid rgba(255,255,255,0.9)",
                          borderRadius: "4px",
                          backgroundColor: "rgba(255,255,255,0.15)",
                          backdropFilter: "blur(1px)",
                          pointerEvents: "none",
                          transform: "translate(-50%, -50%)",
                          left: `${zoomPosition.x}%`,
                          top: `${zoomPosition.y}%`,
                          zIndex: 10,
                          boxShadow:
                            "0 0 0 1px rgba(0,0,0,0.15), 0 2px 12px rgba(0,0,0,0.2)",
                        }}
                      />
                    )}
                </div>

                {(isZoomVisible || isZoomClosing) &&
                  isDesktop &&
                  mainImgLoaded && (
                    <div
                      style={{
                        position: "fixed",
                        top: `${zoomPanelPos.top}px`,
                        left: `${zoomPanelPos.left}px`,
                        width: "420px",
                        height: "450px",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        backgroundImage: `url(${API_URL}${normalizeImagePath(product.images?.[hoveredImageIndex] || "")})`,
                        backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        backgroundSize: "280%",
                        backgroundRepeat: "no-repeat",
                        pointerEvents: "none",
                        zIndex: 999,
                        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                        backgroundColor: "#fff",
                        overflow: "hidden",
                        animation: isZoomClosing
                          ? "zoomPanelClose 0.2s cubic-bezier(0.36, 0, 0.66, -0.56) forwards"
                          : "zoomPanelPop 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
                      }}
                    />
                  )}
              </div>

              {/* ── Product content ── */}
              <div className="product-content">
                <Flex justifyContent="space-between" alignItems="center">
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
                          const thumbnail = variant.images?.[0] || "";
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
                              <LoadableImage
                                src={`${API_URL}/${thumbnail}`}
                                alt={`Variant-${variant._id}`}
                                skeletonW="60px"
                                skeletonH="60px"
                                objectFit="cover"
                                borderRadius="md"
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
                      Size: {selectedSize || "Not selected"}
                    </Text>
                    <HStack spacing={2} mt={2}>
                      {availableSizes.map((size) => (
                        <Button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          position="relative"
                          border="2px solid"
                          borderColor="#039cc3ff"
                          bg={selectedSize === size ? "#039cc3ff" : "white"}
                          color={selectedSize === size ? "white" : "#039cc3ff"}
                          px={5}
                          py={3}
                          minW="30px"
                          minH="50px"
                          fontSize="lg"
                          disabled={sizeStock[size] === 0}
                        >
                          {size}
                          {sizeStock[size] === 0 && (
                            <Text
                              as="span"
                              display={{ base: "none", lg: "inline" }}
                              ml={1}
                              fontSize="sm"
                            >
                              (Out of Stock)
                            </Text>
                          )}
                          {sizeStock[size] === 0 && (
                            <Box
                              position="absolute"
                              top="50%"
                              left="5px"
                              right="5px"
                              height="2px"
                              bg="gray.500"
                              display={{ base: "block", lg: "none" }}
                              transform="translateY(-50%)"
                              pointerEvents="none"
                            />
                          )}
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
                          disabled={
                            !selectedSize || sizeStock[selectedSize] === 0
                          }
                          border="2px solid"
                          borderColor="black"
                          bg="white"
                          color="black"
                          fontWeight="bold"
                          px={8}
                          py={5}
                          minW="150px"
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
                          disabled={
                            !selectedSize || sizeStock[selectedSize] === 0
                          }
                          bg="black"
                          color="white"
                          px={8}
                          py={5}
                          minW="150px"
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
                </div>
              </div>
            </div>
          </div>
        )}
        <WashCareDisplay washCare={product.washCare} />
        {/* === REVIEW SECTION === */}
        <Box className="REVIEWS" mt={8}>
          <Flex
            mb={4}
            direction={{ base: "column", md: "row" }}
            align={{ base: "stretch", md: "center" }}
            justify="space-between"
            gap={2}
          >
            <Flex
              direction={{ base: "column", md: "row" }}
              gap={2}
              w={{ base: "100%", md: "auto" }}
            >
              {["All Reviews", "Overall Rating"].map((tab) => (
                <Button
                  key={tab}
                  size="sm"
                  variant={activeTab === tab ? "solid" : "outline"}
                  colorScheme="blue"
                  w={{ base: "100%", md: "auto" }}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}{" "}
                  {tab === "All Reviews" && `(${product.numReviews || 0})`}
                </Button>
              ))}
            </Flex>
            <Button
              mt={{ base: 2, md: 0 }}
              w={{ base: "100%", md: "auto" }}
              colorScheme="blue"
              onClick={() => setShowCreateReview((prev) => !prev)}
            >
              Write a Review
            </Button>
          </Flex>

          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align={{ base: "flex-start", md: "center" }}
            p={4}
            bg="gray.50"
            borderRadius="md"
            mb={6}
            gap={3}
          >
            <Box>
              <Text fontSize="lg" fontWeight="bold">
                Overall Rating
              </Text>
              <Flex
                direction={{ base: "column", md: "row" }}
                align={{ base: "flex-start", md: "center" }}
                gap={2}
                mt={1}
              >
                <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold">
                  {product.rating?.toFixed(1) || "N/A"}
                </Text>
                <Rating value={product.rating || 0} />
                <Text color="gray.500" fontSize={{ base: "sm", md: "md" }}>
                  ({product.numReviews || 0} reviews)
                </Text>
              </Flex>
              {product.images?.length > 0 && (
                <Flex
                  mt={2}
                  align="center"
                  gap={2}
                  direction={{ base: "column", md: "row" }}
                >
                  <Box
                    position="relative"
                    boxSize={{ base: "30px", md: "40px" }}
                  >
                    <LoadableImage
                      src={`${process.env.REACT_APP_API_URL}/${product.images[0]}`}
                      alt="Product"
                      skeletonW="100%"
                      skeletonH="100%"
                      borderRadius="md"
                      objectFit="cover"
                    />
                  </Box>
                  <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600">
                    Product Rating: {product.rating?.toFixed(1) || "N/A"}
                  </Text>
                </Flex>
              )}
            </Box>
          </Flex>

          <Box position="relative">
            {activeTab === "Overall Rating" ? (
              <Flex align="center" gap={4} p={4} bg="gray.50" borderRadius="md">
                <Text fontSize="2xl" fontWeight="bold">
                  {product.rating?.toFixed(1) || "N/A"}
                </Text>
                <Rating value={product.rating || 0} />
                <Text>({product.numReviews || 0} reviews)</Text>
              </Flex>
            ) : (
              <>
                {product.reviews && product.reviews.length >= 5 && (
                  <Button
                    display="flex"
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
                      carouselRef.current?.scrollBy({
                        left: -320,
                        behavior: "smooth",
                      })
                    }
                  >
                    &lt;
                  </Button>
                )}

                <Box
                  ref={carouselRef}
                  display="flex"
                  overflowX="hidden"
                  gap={4}
                  py={2}
                  px={1}
                >
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews
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
                            <ReviewPhotoGrid
                              photos={review.photos}
                              apiUrl={API_URL}
                              onOpenModal={openReviewPhotoModal}
                            />
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
                      ))
                  ) : (
                    <Text>No reviews yet</Text>
                  )}
                </Box>

                {product.reviews && product.reviews.length >= 5 && (
                  <Button
                    display="flex"
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
                      carouselRef.current?.scrollBy({
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

          {/* ── Review Image Swiper Modal ── */}
          <Modal
            isOpen={reviewImageModal.isOpen}
            onClose={() =>
              setReviewImageModal({
                isOpen: false,
                photos: [],
                currentIndex: 0,
              })
            }
            isCentered
            size="xl"
          >
            <ModalOverlay bg="blackAlpha.800" />
            <ModalContent bg="white" borderRadius="xl" overflow="hidden" mx={4}>
              <ModalCloseButton
                zIndex={20}
                color="gray.600"
                bg="white"
                borderRadius="full"
                boxShadow="md"
                top={3}
                right={3}
                _hover={{ bg: "gray.100", color: "gray.800" }}
              />
              <ModalBody p={6} pt={10}>
                {/* Swipeable area */}
                <Box
                  position="relative"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  onTouchStart={handleReviewModalTouchStart}
                  onTouchMove={handleReviewModalTouchMove}
                  onTouchEnd={handleReviewModalTouchEnd}
                  userSelect="none"
                >
                  {/* Left Arrow */}
                  {reviewImageModal.photos.length > 1 && (
                    <Box
                      as="button"
                      position="absolute"
                      left="-16px"
                      top="50%"
                      transform="translateY(-50%)"
                      zIndex={10}
                      w="36px"
                      h="36px"
                      borderRadius="full"
                      bg="white"
                      border="1px solid"
                      borderColor="gray.200"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      boxShadow="md"
                      _hover={{ bg: "gray.100" }}
                      onClick={() =>
                        setReviewImageModal((prev) => ({
                          ...prev,
                          currentIndex:
                            (prev.currentIndex - 1 + prev.photos.length) %
                            prev.photos.length,
                        }))
                      }
                      aria-label="Previous image"
                    >
                      <Text fontSize="lg" lineHeight={1} color="gray.600">
                        ‹
                      </Text>
                    </Box>
                  )}

                  {/* Main image */}
                  <Image
                    src={`${API_URL}/${reviewImageModal.photos[reviewImageModal.currentIndex]}`}
                    alt="Review"
                    maxH="65vh"
                    maxW="100%"
                    objectFit="contain"
                    borderRadius="md"
                    draggable={false}
                  />

                  {/* Right Arrow */}
                  {reviewImageModal.photos.length > 1 && (
                    <Box
                      as="button"
                      position="absolute"
                      right="-16px"
                      top="50%"
                      transform="translateY(-50%)"
                      zIndex={10}
                      w="36px"
                      h="36px"
                      borderRadius="full"
                      bg="white"
                      border="1px solid"
                      borderColor="gray.200"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      boxShadow="md"
                      _hover={{ bg: "gray.100" }}
                      onClick={() =>
                        setReviewImageModal((prev) => ({
                          ...prev,
                          currentIndex:
                            (prev.currentIndex + 1) % prev.photos.length,
                        }))
                      }
                      aria-label="Next image"
                    >
                      <Text fontSize="lg" lineHeight={1} color="gray.600">
                        ›
                      </Text>
                    </Box>
                  )}
                </Box>

                {/* Counter only — no dots */}
                {reviewImageModal.photos.length > 1 && (
                  <Text
                    textAlign="center"
                    fontSize="xs"
                    color="gray.400"
                    mt={3}
                  >
                    {reviewImageModal.currentIndex + 1} /{" "}
                    {reviewImageModal.photos.length}
                  </Text>
                )}
              </ModalBody>
            </ModalContent>
          </Modal>

          {/* ── Product image preview modal ── */}
          <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
            <ModalOverlay bg="blackAlpha.800" />
            <ModalContent
              bg="white"
              borderRadius="xl"
              overflow="hidden"
              mx={4}
              boxShadow="2xl"
            >
              <ModalCloseButton
                zIndex={20}
                color="gray.600"
                bg="white"
                borderRadius="full"
                boxShadow="md"
                top={3}
                right={3}
                _hover={{ bg: "gray.100", color: "gray.800" }}
                size="md"
              />

              <ModalBody p={4} pt={10}>
                <Box
                  overflow="hidden"
                  borderRadius="md"
                  onTouchStart={(e) => {
                    pinch.onTouchStart(e);
                    handleModalTouchStart(e); // keep swipe working when not pinching
                  }}
                  onTouchMove={(e) => {
                    if (e.touches.length === 2) {
                      pinch.onTouchMove(e); // pinch — don't swipe
                    } else {
                      handleModalTouchMove(e); // single finger — swipe
                    }
                  }}
                  onTouchEnd={(e) => {
                    pinch.onTouchEnd(e);
                    if (pinch.scale <= 1) handleModalTouchEnd(); // only swipe when not zoomed
                  }}
                  userSelect="none"
                >
                  <Image
                    src={
                      typeof modalIndex === "number" && product.images
                        ? `${API_URL}/${product.images[modalIndex]}`
                        : `${API_URL}/${modalIndex}`
                    }
                    alt="Preview"
                    w="100%"
                    h="auto"
                    maxH="70vh"
                    objectFit="contain"
                    borderRadius="md"
                    draggable={false}
                    style={{
                      transform: `scale(${pinch.scale}) translate(${pinch.translate.x}px, ${pinch.translate.y}px)`,
                      transformOrigin: "center center",
                      transition:
                        pinch.scale === 1 ? "transform 0.2s ease" : "none",
                      touchAction: "none",
                    }}
                  />
                </Box>

                {/* Double-tap to reset zoom hint */}
                {pinch.scale > 1 && (
                  <Text
                    textAlign="center"
                    fontSize="xs"
                    color="gray.400"
                    mt={1}
                    cursor="pointer"
                    onClick={pinch.reset}
                  >
                    Tap to reset zoom
                  </Text>
                )}

                {product.images &&
                  product.images.length > 1 &&
                  pinch.scale === 1 && (
                    <Text
                      textAlign="center"
                      fontSize="xs"
                      color="gray.400"
                      mt={2}
                    >
                      Swipe to navigate · Pinch to zoom
                    </Text>
                  )}

                {product.images && product.images.length > 1 && (
                  <Flex justify="center" gap={2} mt={3} pb={1}>
                    {product.images.map((_, idx) => (
                      <Box
                        key={idx}
                        w={modalIndex === idx ? "20px" : "8px"}
                        h="8px"
                        borderRadius="full"
                        bg={modalIndex === idx ? "blue.500" : "gray.300"}
                        transition="all 0.2s ease"
                        cursor="pointer"
                        onClick={() => {
                          setModalIndex(idx);
                          pinch.reset();
                        }}
                        flexShrink={0}
                      />
                    ))}
                  </Flex>
                )}
              </ModalBody>
            </ModalContent>
          </Modal>

          {/* ── Write review modal ── */}
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

        {/* Related Products */}
        <div
          className="related-products-section"
          style={{ padding: "0 1rem", margin: "2rem 0" }}
        >
          <Heading as="h3" size="sm" mb={4} ml={20}>
            Recommended Products
          </Heading>
          {relatedLoading ? (
            <HashLoader color={"#36D7B7"} />
          ) : (
            <div className="related-products-container">
              {relatedProducts
                .filter((p) => p._id !== product._id)
                .slice(0, 6)
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
