import { React, useState, useEffect } from "react";
import {
  HiOutlineShoppingCart,
  HiShoppingCart,
  HiOutlineEye,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";
import {
  Image,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  IconButton,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import { addToCart } from "../actions/cartActions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { HiOutlineHeart, HiHeart } from "react-icons/hi";
import { toggleFavorite } from "../actions/userActions";
import "./CardProduct.css";

const CardProduct = ({ product }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const [showbtn, setShowbtn] = useState(false);
  const [Incart, setIncart] = useState(false);
  const dispatch = useDispatch();
  const Cart = useSelector((state) => state.cart);
  const { favoriteItems } = useSelector((state) => state.favorites);
  const { cartItems } = Cart;
  const userLogin = useSelector((state) => state.userLogin);
  const userInfo = userLogin?.userInfo;
  const isFavorite = favoriteItems?.some((item) => item._id === product._id);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const isincart = cartItems.find((x) => x.product === product._id);
    if (isincart) {
      setIncart(true);
    }
  }, [cartItems, product._id]);

  const addcart = (e) => {
    e.preventDefault();
    e.stopPropagation();
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
    toast({
      title: "Product added to cart.",
      description: `Click to view details.`,
      status: "success",
      duration: 5000,
      position: "bottom",
      isClosable: true,
    });
    setIncart(true);
    dispatch(addToCart(product._id, 1));
    dispatch(toggleFavorite(product._id));
  };
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev > 0 ? prev - 1 : product.images.length - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev < product.images.length - 1 ? prev + 1 : 0
    );
  };
  return (
    <>
      <Link to={`/product/${product._id}`}>
        <div
          className="cardProduct"
          onMouseOver={() => setShowbtn(true)}
          onMouseLeave={() => setShowbtn(false)}
        >
          <div className="imgDiv" style={{ position: "relative" }}>
            <HiOutlineEye
              className="viewImageIcon"
              size={28}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onOpen();
              }}
            />
            {/* Discount Badge on Top-Left */}
            {product.discount > 0 && (
              <div className="discountBadge">
                <span>{product.discount}%</span>
                <span>OFF</span>
              </div>
            )}

            <Image
              className="imgProduct"
              boxSize="450px"
              objectFit="cover"
              src={product.images[0]}
            />
          </div>
          <div className="bottomcard">
            <Link to={`/product/${product._id}`} exact>
              <span>{product.brandname}</span>
              <p className="productDescription">{product.description}</p>
            </Link>
            {/* if error use this */}
            {/* Favorite Button (Adds to Cart & Wishlist) */}
            {/* {isFavorite ? (
            <HiHeart className="iconFav" size="26" fill="red" />
          ) : (
            <HiOutlineHeart
              className="iconFav"
              size="26"
              onClick={handleAddToCartAndWishlist}
            />
          )} */}

            {/* Shopping Cart Icon */}
            {Incart ? (
              <HiHeart className="iconFav " size="26" fill="red" />
            ) : (
              <HiOutlineHeart className="iconFav" size="26" onClick={addcart} />
            )}

            {/* Price Section with Discount & Old Price */}
            <div className="productpricecard">
              {product.oldPrice && product.oldPrice > product.price && (
                <span
                  className="oldPrice"
                  style={{
                    textDecoration: "line-through",
                    color: "#999",
                    marginRight: "5px",
                    fontSize: "14px",
                  }}
                >
                  Rs. {product.oldPrice}
                </span>
              )}
              <span
                className="newPrice"
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#000",
                }}
              >
                Rs. {product.price}
              </span>
            </div>

            {/* Rating Component */}
            {/* <div className="Rating">
            <Rating
              value={product.rating}
              text={`${product.numReviews} reviews`}
            />
          </div> */}
          </div>
        </div>
      </Link>
      {/* Image Preview Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="3xl">
        <ModalOverlay />
        <ModalContent background="black" borderRadius="md">
          <ModalBody p={0} position="relative">
            <IconButton
              position="absolute"
              left="10px"
              top="50%"
              transform="translateY(-50%)"
              colorScheme="whiteAlpha"
              onClick={handlePrevImage}
              icon={<HiChevronLeft />}
            />
            <Image
              src={product.images[currentImageIndex]}
              objectFit="contain"
              w="100%"
              maxH="90vh"
            />
            <IconButton
              position="absolute"
              right="10px"
              top="50%"
              transform="translateY(-50%)"
              colorScheme="whiteAlpha"
              onClick={handleNextImage}
              icon={<HiChevronRight />}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CardProduct;
