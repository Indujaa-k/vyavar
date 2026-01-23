import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Divider,
  Grid,
  useDisclosure,
  Input,
  Spinner,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  saveAddressshipping,
  savepaymentmethod,
  fetchCart,
  saveShippingCost,
} from "../../actions/cartActions";
import { getOfferByCouponCode } from "../../actions/offerActions";
import { getShippingCost } from "../../actions/shippingActions";
import { CreateOrder } from "../../actions/orderActions";
import { getUserDetails } from "../../actions/userActions";
import PaymentModal from "./PaymentModal";
import { useToast } from "@chakra-ui/react";

const Checkout = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const cart = useSelector((state) => state.cart);

  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  const dispatch = useDispatch();
  const taxPercentage = 5;

  const subtotal = cart.cartItems.reduce((acc, item) => acc + item.price, 0);
  const roundedSubtotal = parseFloat(subtotal.toFixed(2));

  const offerValidate = useSelector((state) => state.offerValidate);
  const { loading: couponLoading, offer, error: couponError } = offerValidate;

  const shippingGet = useSelector((state) => state.checkoutShipping);
  const {
    shippingCost: fetchedShippingCost,
    freeShippingAbove,
    loading: shippingLoading,
    error: shippingError,
  } = shippingGet || {};

  const shippingCost = cart.shippingCost ?? 0;

  const taxAmount = parseFloat(((roundedSubtotal * 5) / 100).toFixed(2));

  // Check if free shipping applies
  const isFreeShipping =
    freeShippingAbove && roundedSubtotal >= freeShippingAbove;
  const shippingCostFinal = isFreeShipping ? 0 : shippingCost;
  const roundedShippingCost = parseFloat(shippingCostFinal.toFixed(2));
  const discountAmountFinal = offer
    ? parseFloat(
        Math.min(
          (roundedSubtotal * offer.offerPercentage) / 100,
          roundedSubtotal + taxAmount + roundedShippingCost - 1,
        ).toFixed(2),
      )
    : 0;
  const totalPrice = parseFloat(
    (
      roundedSubtotal +
      taxAmount +
      roundedShippingCost -
      discountAmountFinal
    ).toFixed(2),
  );

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, ordererror } = orderCreate;
  const userProfile = useSelector((state) => state.userDetails);
  const { user, loading: userLoading } = userProfile;
  const defaultAddress =
    user?.addresses?.find((addr) => addr.isDefault) || user?.addresses?.[0];

  const recipientAddress = defaultAddress;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const applyCouponHandler = () => {
    if (!couponCode.trim()) {
      toast({
        title: "Enter coupon code",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    dispatch(getOfferByCouponCode(couponCode));
  };

  useEffect(() => {
    if (offer) {
      const discount = parseFloat(
        Math.min(
          (roundedSubtotal * offer.offerPercentage) / 100,
          roundedSubtotal + taxAmount + roundedShippingCost - 1,
        ).toFixed(2),
      );

      setDiscountAmount(discount);
      setCouponApplied(true);
    } else {
      setDiscountAmount(0);
      setCouponApplied(false);
    }
  }, [offer, roundedSubtotal, taxAmount, roundedShippingCost]);

  useEffect(() => {
    if (couponError) {
      setDiscountAmount(0);
      setCouponApplied(false);

      toast({
        title: "Invalid Coupon",
        description: couponError,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [couponError, toast]);

  useEffect(() => {
    if (fetchedShippingCost !== undefined) {
      dispatch(saveShippingCost(fetchedShippingCost));
    }
  }, [fetchedShippingCost, dispatch]);

  // Reset coupon after cart clears or order success
  useEffect(() => {
    setDiscountAmount(0);
    setCouponCode("");
    setCouponApplied(false);
  }, [cart.cartItems.length, success]);

  // Fetch user details
  useEffect(() => {
    if (userInfo) {
      dispatch(getUserDetails("profile"));
    }
  }, [dispatch, userInfo]);

  // Fetch shipping cost when user profile loads
  useEffect(() => {
    if (userInfo && user && user.addresses && user.addresses.length > 0) {
      dispatch(getShippingCost());
    }
  }, [dispatch, userInfo, user]);

  // Update shipping cost when fetched from backend

  // Show shipping error
  useEffect(() => {
    if (shippingError) {
      toast({
        title: "Shipping Error",
        description: shippingError,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  }, [shippingError, toast]);

  const handlePayClick = () => {
    if (
      !defaultAddress?.doorNo ||
      !defaultAddress?.street ||
      !defaultAddress?.city ||
      !defaultAddress?.state ||
      !defaultAddress?.pin
    ) {
      toast({
        title: "Address Required",
        description: "Please select delivery address.",
        status: "warning",
        duration: 4000,
        isClosable: true,
      });
      navigate("/profile");
      return;
    }

    const hasMissingSize = cart.cartItems.some((item) => !item.size);

    if (hasMissingSize) {
      toast({
        title: "Size Required",
        description: "Please select size for all products.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    onOpen();
  };

  const handleOrder = async (e) => {
    if (e?.preventDefault) e.preventDefault();

    try {
      const orderData = {
        user: userInfo._id,

        orderItems: cart.cartItems.map((item) => ({
          product: item.product._id,
          name: item.product.brandname,
          price: item.price,
          qty: item.qty,
          size: item.size,
        })),

        shippingAddress: recipientAddress,
        paymentMethod: "Razorpay",
        taxPrice: taxAmount,
        shippingPrice: roundedShippingCost,
        itemsPrice: subtotal,
        totalPrice: totalPrice,

        // ✅ FIX: SEND FULL COUPON OBJECT
        coupon: couponApplied
          ? {
              code: couponCode,
              percentage: offer.offerPercentage,
              discountAmount: discountAmount,
            }
          : null,
      };

      console.log("🚚 STORE CHECK", {
        shippingGet,
        shippingCost: shippingGet?.shippingCost,
      });
      dispatch(CreateOrder(orderData));
    } catch (err) {
      console.error("❌ Order creation error:", err.message);
    }
  };

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      navigate(`/order/${order._id}`);

      dispatch({ type: "ORDER_CREATE_RESET" });
      dispatch({ type: "CART_CLEAR_ITEMS" });
      dispatch({ type: "OFFER_VALIDATE_RESET" });
      setDiscountAmount(0);
      setCouponCode("");
      setCouponApplied(false);
    }
  }, [success, navigate, order, dispatch]);

  return (
    <Box p={6} maxW="container.xl" mx="auto">
      <Grid templateColumns={{ base: "1fr" }} gap={8}>
        <VStack
          align="start"
          spacing={4}
          p={4}
          borderWidth="1px"
          borderRadius="lg"
          shadow="md"
        >
          {/* Delivery Address Display */}
          {/* Bill Details */}
          <Box
            borderWidth="2px"
            borderRadius="lg"
            p={4}
            shadow="lg"
            w="full"
            bg="white"
            borderColor="gray.200"
          >
            <Text fontSize="l" fontWeight="bold" p="2">
              BILL DETAILS
            </Text>

            <Divider />

            <HStack justify="space-between" w="full" p="3">
              <Text>Subtotal:</Text>
              <Text color={"grey"}>Rs. {subtotal.toFixed(2)}</Text>
            </HStack>

            <HStack justify="space-between" w="full" p="3">
              <Text>Shipping:</Text>
              {shippingLoading ? (
                <Spinner size="sm" />
              ) : isFreeShipping ? (
                <Text color="green.600" fontWeight="bold">
                  FREE
                </Text>
              ) : (
                <Text color={"grey"}>Rs. {shippingCost.toFixed(2)}</Text>
              )}
            </HStack>

            {isFreeShipping && (
              <Text fontSize="sm" color="green.600" px="3" pb="2">
                🎉 Free shipping applied! (Orders above Rs. {freeShippingAbove})
              </Text>
            )}

            <HStack justify="space-between" w="full" p="3">
              <Text>Taxes (5%):</Text>
              <Text color={"grey"}>Rs. {taxAmount.toFixed(2)}</Text>
            </HStack>
            <Divider my={3} />

            <VStack w="full" align="stretch" spacing={2}>
              <HStack w="full">
                <Input
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value.toUpperCase());
                    setCouponApplied(false);
                  }}
                  isInvalid={couponError && couponCode.trim().length > 0}
                  errorBorderColor="red.300"
                  borderColor={couponApplied ? "green.300" : "gray.200"}
                  focusBorderColor={couponApplied ? "green.400" : "blue.500"}
                />
                <Button
                  onClick={applyCouponHandler}
                  isLoading={couponLoading}
                  bg="black"
                  color="white"
                  isDisabled={!couponCode.trim() || couponApplied}
                  _disabled={{
                    bg: "gray.400",
                    cursor: "not-allowed",
                  }}
                >
                  {couponApplied ? "Applied" : "Apply"}
                </Button>
              </HStack>

              {/* Error message below input */}
              {couponError && couponCode.trim() && !couponApplied && (
                <Text color="red.500" fontSize="sm" pl={1}>
                  {couponError}
                </Text>
              )}

              {/* Success message */}
              {couponApplied && offer && (
                <Text color="green.600" fontSize="sm" pl={1}>
                  ✓ {offer.offerPercentage}% discount applied
                </Text>
              )}
            </VStack>

            {discountAmount > 0 && (
              <HStack justify="space-between" w="full" p="3">
                <Text color="green.600">Coupon Discount</Text>
                <Text color="green.600">- Rs. {discountAmount.toFixed(2)}</Text>
              </HStack>
            )}

            <HStack justify="space-between" w="full" p="3">
              <Text fontSize="lg" fontWeight="bold">
                Final Total:
              </Text>
              <Text fontSize="lg" fontWeight="bold">
                Rs. {totalPrice.toFixed(2)}
              </Text>
            </HStack>
          </Box>

          <Button
            bg="black"
            color="white"
            size="lg"
            w="full"
            onClick={handlePayClick}
            isLoading={shippingLoading}
          >
            Pay ₹{totalPrice}
          </Button>
        </VStack>
      </Grid>

      <PaymentModal
        isOpen={isOpen}
        onClose={onClose}
        handleOrder={handleOrder}
        cartItems={cart.cartItems}
        couponCode={couponCode}
        totalPrice={totalPrice}
      />
    </Box>
  );
};

export default Checkout;
