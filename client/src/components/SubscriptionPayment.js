

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createSubscriptionOrder,
  confirmSubscriptionPayment,
  getActiveSubscription,
} from "../actions/subscriptionActions";
import { getUserDetails } from "../actions/userActions";
import {
  Box,
  Button,
  Text,
  Spinner,
  Flex,
  List,
  ListItem,
  ListIcon,
  HStack,
  Badge,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";

const SubscriptionPayment = () => {
  const dispatch = useDispatch();

  /* ================= REDUX STATE ================= */
  const { userInfo } = useSelector((state) => state.userLogin);
  const { loading: userLoading, user } = useSelector((state) => state.userDetails);
  const { subscriptions = [], loading: subsLoading } = useSelector(
    (state) => state.subscriptionList
  );
  const { loading: orderLoading, order, error: orderError } = useSelector(
    (state) => state.subscriptionOrder
  );
  const { success: confirmSuccess } = useSelector(
    (state) => state.subscriptionConfirm
  );

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    dispatch(getUserDetails("profile"));

    // fetch active plan ONLY if user is not already subscribed
    if (!user?.isSubscribed) {
      dispatch(getActiveSubscription());
    }
  }, [dispatch, user?.isSubscribed, confirmSuccess]);

  /* ================= ACTIVE ADMIN PLAN ================= */
  const today = new Date();
  const activeAdminPlan = subscriptions.find(
    (p) =>
      p.isActive &&
      new Date(p.startDate) <= today &&
      new Date(p.endDate) >= today
  );

  /* ================= USER SUBSCRIPTION (FROM USER DB) ================= */
  const userSubscription = user?.isSubscribed ? user.subscription : null;

  /* ================= PLAN TO SHOW ================= */
  const planToShow = userSubscription || activeAdminPlan;

  /* ================= PAYMENT ================= */
  const handlePayment = () => {
    if (!activeAdminPlan) return;
    dispatch(createSubscriptionOrder(activeAdminPlan._id));
  };

  /* ================= RAZORPAY ================= */
  useEffect(() => {
    if (!order) return;

    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: "INR",
      name: "Subscription",
      description: order.subscription.title,
      order_id: order.orderId,
      handler: function (response) {
        dispatch(
          confirmSubscriptionPayment({
            subscriptionId: order.subscription._id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          })
        )
        .then(() => {
          // ✅ REFRESH USER DATA AFTER SUCCESSFUL PAYMENT
          dispatch(getUserDetails("profile"));
        });
      },
      prefill: {
        name: userInfo?.name,
        email: userInfo?.email,
      },
      theme: { color: "#29ab51" },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  }, [order, dispatch, userInfo]);

  /* ================= LOADING ================= */
  if (userLoading || subsLoading) {
    return (
      <Box textAlign="center" mt="150px">
        <Spinner size="xl" />
      </Box>
    );
  }

  /* ================= NO PLAN AT ALL ================= */
  if (!planToShow) {
    return (
      <Box bg="#1a2b33" minH="100vh" py={20} px={10}>
        <Flex
          align="center"
          justify="center"
          minH="60vh"
          direction="column"
          color="white"
        >
          <Text fontSize="3xl" fontWeight="bold" mb={4}>
            No Subscription Available
          </Text>
          <Text fontSize="lg" color="gray.300">
            Please come back later
          </Text>
        </Flex>
      </Box>
    );
  }

  /* ================= UI ================= */
  return (
    <Box bg="#1a2b33" minH="100vh" py={20} px={10}>
      <Flex
        maxW="1200px"
        mx="auto"
        direction={{ base: "column", md: "row" }}
        align="center"
        justify="space-between"
      >
        {/* LEFT SIDE */}
        <Box color="white" flex="1" pr={{ md: 10 }} mb={{ base: 10, md: 0 }}>
          <Text fontSize={{ base: "4xl", md: "6xl" }} fontWeight="bold">
            {planToShow.title}
          </Text>
          <Text fontSize="xl" mt={6}>
            {planToShow.description}
          </Text>
        </Box>

        {/* RIGHT CARD */}
        <Box
          bg="white"
          p={8}
          borderRadius="md"
          boxShadow="2xl"
          width={{ base: "100%", md: "420px" }}
        >
          <HStack bg="#f4f6f8" p={3} borderRadius="md" mb={6}>
            <Text fontSize="2xl" fontWeight="bold">
              {planToShow.title}
            </Text>
          </HStack>

          <Text fontSize="2xl" fontWeight="bold" mb={1}>
            ₹{planToShow.price}
          </Text>

          {/* DISCOUNT */}
          {planToShow.discountPercent > 0 && (
            <Badge colorScheme="green" mb={4}>
              {planToShow.discountPercent}% OFF
            </Badge>
          )}

          {/* OFFERS */}
          <List spacing={3} mb={6} color="gray.700">
            {Array.isArray(planToShow.offers) &&
              planToShow.offers.map((offer, index) => (
                <ListItem key={index} fontSize="sm">
                  <ListIcon as={CheckIcon} color="green.500" />
                  {offer}
                </ListItem>
              ))}
          </List>

          {/* DATES */}
          <Text fontSize="xs" color="gray.500" mb={4}>
            Valid from {new Date(planToShow.startDate).toLocaleDateString()} –{" "}
            {new Date(planToShow.endDate).toLocaleDateString()}
          </Text>

          {/* ACTION */}
          {user?.isSubscribed ? (
            <Badge colorScheme="green" width="100%" textAlign="center" p={2} bg="orange">
               Subscribed
            </Badge>
          ) : (
            <Button
              bg="#29ab51"
              color="white"
              size="lg"
              width="100%"
              _hover={{ bg: "#239445" }}
              onClick={handlePayment}
              isLoading={orderLoading}
            >
              Pay Now
            </Button>
          )}

          {orderError && (
            <Text color="red.500" fontSize="xs" mt={2} textAlign="center">
              {orderError}
            </Text>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default SubscriptionPayment;
