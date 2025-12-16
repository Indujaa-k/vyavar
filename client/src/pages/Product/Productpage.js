import React, { useEffect, useState, useRef, Profiler } from "react";
import Rating from "../../components/Rating";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import {
  listProductDetails,
  createproductReview,
} from "../../actions/productActions";
import { IoLogoFacebook } from "react-icons/io";
import { AiFillTwitterCircle, AiFillInstagram } from "react-icons/ai";
import { addToCart } from "../../actions/cartActions";
import { AiFillShop } from "react-icons/ai";
import ShareButton from "./ShareButton";
import { MdDoNotDisturb } from "react-icons/md";
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

  // Update the useEffect that checks for purchased products
  useEffect(() => {
    if (orders && orders.length > 0) {
      console.log("Full order items structure:", orders[0].orderItems);
      console.log("First order item product:", orders[0].orderItems[0].product);
      console.log("Type of product:", typeof orders[0].orderItems[0].product);

      const purchased = orders.some((order) => {
        return (
          order.isDelivered &&
          order.orderItems.some((item) => {
            const productId = item.product._id
              ? item.product._id.toString()
              : item.product.toString();
            console.log("Comparing:", productId, "with", id);
            return productId === id;
          })
        );
      });

      setIsPurchased(purchased);
    }
  }, [orders, id]);
  useEffect(() => {
    if (successProductReview) {
      alert("Review Submitted!");
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
    if (product?.productdetails?.stockBySize) {
      const stockMap = {};

      product.productdetails.stockBySize.forEach((item) => {
        stockMap[item.size] = item.stock;
      });

      setSizeStock(stockMap);
    }
  }, [product]);

  // product.reviews
  const submithanlder = () => {
    dispatch(
      createproductReview(id, {
        rating,
        comment,
      })
    );
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
                  {product.images.map((image, index) => (
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
                <Text fontSize="20px" fontWeight="bold" mb={1} mt={3}>
                  ₹{product.price}{" "}
                  <Text
                    as="span"
                    fontSize="20px"
                    fontWeight="normal"
                    color="black"
                    textDecoration="line-through"
                  >
                    MRP: ₹{product.oldPrice}
                  </Text>
                  <Text fontSize="13px" color="gray.500" mb={3}>
                    (Inclusive of all taxes)
                  </Text>
                </Text>
                <Divider my={3} />
                <p
                  style={{
                    fontWeight: "bold",
                    fontSize: "16px",
                    marginBottom: "5px",
                  }}
                >
                  Color: {product.productdetails?.color || "Not Available"}
                </p>
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
                          borderColor="black"
                          bg={selectedSize === size ? "black" : "white"}
                          color={selectedSize === size ? "white" : "black"}
                          _hover={{
                            bg: selectedSize === size ? "black" : "gray.100",
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
                    {product.sizeChart ? (
                      <>
                        <Button
                          background="black"
                          color={"white"}
                          size="sm"
                          onClick={togglePDF}
                          mb={2}
                        >
                          {showPDF ? "Close" : "Size Chart"}
                        </Button>

                        {showPDF && (
                          <iframe
                            src={`https://docs.google.com/gview?url=${encodeURIComponent(
                              product.sizeChart
                            )}&embedded=true`}
                            title="Size Chart PDF"
                            width="100%"
                            height="500px"
                            style={{
                              border: "1px solid #ccc",
                              borderRadius: "8px",
                              marginTop: "10px",
                            }}
                          />
                        )}
                      </>
                    ) : (
                      <p
                        style={{
                          fontWeight: "bold",
                          fontSize: "16px",
                          marginBottom: "5px",
                        }}
                      >
                        Sizechart: Not Available
                      </p>
                    )}

                    <HStack spacing={4} mt="5" mb="5">
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
        {/* {isPurchased && (
          <div className="REVIEWS">
            <h1>Reviews :</h1>
            {product.reviews.length === 0 && <h2>NO REVIEWS</h2>}
            <div>
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

              <div className="createreview">
                <h1>Create New Review :</h1>
                {errorProductReview && <h2>{errorProductReview}</h2>}
                {userInfo ? (
                  <FormControl>
                    <FormLabel>Rating :</FormLabel>
                    <Select onChange={(e) => setrating(e.target.value)}>
                      <option value="5">5 EXCELLENT</option>
                      <option value="4">4 VERY GOOD</option>
                      <option value="3">3 GOOD</option>
                      <option value="2">2 FAIR</option>
                      <option value="1">1 POOR</option>
                    </Select>
                    <FormLabel>Comment :</FormLabel>
                    <Textarea
                      onChange={(e) => setcomment(e.target.value)}
                      placeholder="Leave Comment here :"
                    />
                    <Button
                      className="
                    submitbutton"
                      colorScheme="blue"
                      onClick={submithanlder}
                    >
                      Submit
                    </Button>
                  </FormControl>
                ) : (
                  <>
                    Please <Link to="/login">Sign In</Link> To write a review.
                  </>
                )}
              </div>
            </div>
          </div>
        )} */}

        {/* === REVIEW SECTION === */}
        <div className="REVIEWS">
          <h1>Reviews :</h1>

          {/* No Reviews */}
          {product.reviews.length === 0 && <h2>NO REVIEWS</h2>}

          {/* Show Approved Reviews */}
          <div>
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
          </div>

          {/* === CREATE REVIEW SECTION === */}
          <div className="createreview">
            <h1>Create New Review :</h1>

            {errorProductReview && <h2>{errorProductReview}</h2>}

            {/* If user not logged in */}
            {!userInfo && (
              <p>
                Please <Link to="/login">Sign In</Link> to write a review.
              </p>
            )}

            {/* If user logged in but has NOT purchased */}

            {/* If user logged in AND has purchased */}
            {userInfo && (
              <FormControl>
                <FormLabel>Rating :</FormLabel>
                <Select onChange={(e) => setrating(e.target.value)}>
                  <option value="5">5 EXCELLENT</option>
                  <option value="4">4 VERY GOOD</option>
                  <option value="3">3 GOOD</option>
                  <option value="2">2 FAIR</option>
                  <option value="1">1 POOR</option>
                </Select>

                <FormLabel>Comment :</FormLabel>
                <Textarea
                  onChange={(e) => setcomment(e.target.value)}
                  placeholder="Leave Comment here :"
                />

                <Button
                  className="submitbutton"
                  colorScheme="blue"
                  onClick={submithanlder}
                >
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
