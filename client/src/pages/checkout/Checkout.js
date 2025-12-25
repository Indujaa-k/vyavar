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
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  saveAddressshipping,
  savepaymentmethod,
  fetchCart,
} from "../../actions/cartActions";
import Payment from "./PaypalPayment";
import { fetchShippingRates } from "../../actions/deliveryActions";
import { saveShippingCost } from "../../actions/cartActions";
import { saveShippingRates } from "../../actions/cartActions";
import StripePayment from "./Stripepayment";
import { createShipment } from "../../actions/deliveryActions";
import { CreateOrder } from "../../actions/orderActions";
import { getUserDetails } from "../../actions/userActions";
import PaymentModal from "./PaymentModal";
import { useToast } from "@chakra-ui/react";

const Checkout = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const cart = useSelector((state) => state.cart);
  const itemsPrice = cart.cartItems.reduce((acc, item) => {
    if (item.product && item.product.price) {
      return acc + item.qty * item.product.price;
    }
    return acc;
  }, 0);

  const { shippingAddress } = cart;
  const { rates, loading, error } = useSelector((state) => state.shipping);
  const [doorNo, setDoorNo] = useState(shippingAddress?.doorNo || "");
  const [street, setStreet] = useState(shippingAddress?.street || "");
  const [nearestLandmark, setNearestLandmark] = useState(
    shippingAddress?.nearestLandmark || ""
  );
  const [selectedRate, setSelectedRate] = useState(null);
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [state, setState] = useState(shippingAddress?.state || "");
  const [pin, setPin] = useState(shippingAddress?.pin || "");
  const [country, setCountry] = useState(shippingAddress?.country || "");
  const [phoneNumber, setPhoneNumber] = useState(
    shippingAddress?.phoneNumber || ""
  );
  const [paymentMethod, setPaymentMethod] = useState("Card");
  const dispatch = useDispatch();
  const taxPercentage = 5;
  const shippingRates = cart.shippingRates;
  const subtotal = cart.cartItems.reduce(
    (acc, item) => acc + item.qty * item.product.price,
    0
  );
  const taxAmount = (subtotal * taxPercentage) / 100;
  const [shippingCost, setShippingCost] = useState(0);
  const totalPrice = subtotal + taxAmount + shippingCost;
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
  const handleShippingRateChange = (rate) => {
    setSelectedRate(rate);

    const netCharge =
      (rate.ratedShipmentDetails &&
        rate.ratedShipmentDetails[0]?.totalNetCharge) ||
      0;
    const currency = rate.ratedShipmentDetails?.[0]?.currency || "USD";
    const estimatedDeliveryDate =
      rate.operationalDetail?.astraDescription || "N/A";

    setShippingCost(netCharge);
    dispatch(saveShippingCost(netCharge));
    dispatch(
      saveShippingRates([
        {
          serviceType: rate.serviceType,
          totalNetCharge: parseFloat(netCharge),
          estimatedDeliveryDate,
          currency,
        },
      ])
    );
    console.log("✅ Shipping Rate Saved in Redux:", {
      serviceType: rate.serviceType,
      totalNetCharge: parseFloat(netCharge),
      estimatedDeliveryDate: rate.estimatedDeliveryDate || "N/A",
      currency: rate.currency || "USD",
    });
  };

  const handleFetchRates = () => {
    if (cart.cartItems.length > 0) {
      const firstProduct = cart.cartItems[0].product;
      dispatch(
        fetchShippingRates(
          { street, city, state, zip: pin, country },
          firstProduct._id
        )
      );
    }
  };

  useEffect(() => {
    if (cart.cartItems.length > 0) {
      handleFetchRates();
    }
  }, [pin, country]);
  useEffect(() => {
    if (rates) {
      console.log("FedEx API Response:", rates);
    }
  }, [rates]);

  const handlePayClick = () => {
    // 1️⃣ Address validation
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

    // 2️⃣ SIZE VALIDATION (🔥 THIS IS THE FIX)
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

    // 3️⃣ Open payment modal ONLY if everything is valid
    onOpen();
  };

  const handleOrder = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    dispatch(
      saveAddressshipping({
        doorNo,
        street,
        nearestLandmark,
        city,
        state,
        pin,
        country,
        phoneNumber,
      })
    );

    const selectedPaymentMethod = cart.paymentMethod;

    try {
      const orderData = {
        user: userInfo._id,
        orderItems: cart.cartItems.map((item) => {
          if (!item.size) {
            throw new Error(`Size not selected for ${item.product.brandname}`);
          }

          return {
            product: item.product._id,
            name: item.product.brandname,
            price: item.product.price,
            qty: item.qty,
            size: item.size, // ✅ CRITICAL
          };
        }),
        shippingAddress: recipientAddress,
        shippingRates,
        paymentMethod,
        itemsPrice,
        shippingPrice: shippingCost,
        taxPrice: taxAmount,
        totalPrice,
      };

      console.log("Final Order Payload:", orderData);
      dispatch(CreateOrder(orderData));
    } catch (error) {
      console.error("❌ Error creating order:", error);
    }
  };
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    if (userInfo) {
      dispatch(getUserDetails("profile"));
    }
  }, [dispatch, userInfo]);

  useEffect(() => {
    if (success) {
      console.log(order._id);
      navigate(`/order/${order._id}`);
    }
  }, [navigate, success, order]);

  return (
    <Box p={6} maxW="container.xl" mx="auto">
      <Grid templateColumns={{ base: "1fr" }} gap={8}>
        {/* Right Side - Order Summary */}
        <VStack
          align="start"
          spacing={4}
          p={4}
          borderWidth="1px"
          borderRadius="lg"
          shadow="md"
        >
          <Box
            borderWidth="2px"
            borderRadius="md"
            p={4}
            mb={5}
            w="full"
            bg="white"
            borderColor="gray.100"
            shadow="md"
          >
            <Text fontSize="m" fontWeight="bold" mb={2}>
              DELIVERY OPTION
            </Text>
            <Divider />
            {rates && rates.length > 0 ? (
              rates.map((rate, index) => {
                const serviceName =
                  rate.serviceDescription?.description || "Unknown Service";
                const netCharge =
                  rate.ratedShipmentDetails[0]?.totalNetCharge || "N/A";

                return (
                  <Box
                    key={index}
                    borderWidth="2px"
                    borderRadius="md"
                    p={4}
                    mt="3"
                    mb={3}
                    w="full"
                    bg={
                      selectedRate?.serviceType === rate.serviceType
                        ? "red.50"
                        : "gray.50"
                    }
                    borderColor={
                      selectedRate?.serviceType === rate.serviceType
                        ? "red.200"
                        : "gray.100"
                    }
                  >
                    <HStack spacing={4}>
                      <input
                        type="radio"
                        name="shippingRate"
                        value={rate.serviceType}
                        onChange={() => handleShippingRateChange(rate)}
                      />
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="bold" fontSize="md">
                          {serviceName}
                        </Text>
                        <Text color="gray.600">
                          RS. <strong>{netCharge.toFixed(2)}</strong>
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          Estimated Delivery: 2-3 days
                        </Text>
                      </VStack>
                    </HStack>
                  </Box>
                );
              })
            ) : (
              <Text>
                No shipping rates available. Please check your address details.
              </Text>
            )}
          </Box>
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
              <Text color={"grey"}>Rs. {shippingCost.toFixed(2)}</Text>
            </HStack>
            <HStack justify="space-between" w="full" p="3">
              <Text>Taxes (5%):</Text>
              <Text color={"grey"}>Rs. {taxAmount.toFixed(2)}</Text>
            </HStack>
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
          >
            Pay ₹{totalPrice}
          </Button>
        </VStack>
      </Grid>
      <PaymentModal
        isOpen={isOpen}
        onClose={onClose}
        handleOrder={handleOrder}
        totalPrice={totalPrice}
      />
    </Box>
  );
};

export default Checkout;
