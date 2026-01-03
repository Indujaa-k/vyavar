// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   createSubscriptionOrder,
//   confirmSubscriptionPayment,
//   getActiveSubscription,
// } from "../actions/subscriptionActions";
// import { getUserDetails } from "../actions/userActions";
// import { Box, Button, Text, Spinner, Badge, Divider } from "@chakra-ui/react";

// const SubscriptionPayment = () => {
//   const dispatch = useDispatch();

//   const { user } = useSelector((state) => state.userDetails);
//   const { subscriptions, loading: subsLoading } = useSelector(
//     (state) => state.subscriptionList
//   );
//   const { loading: orderLoading, order } = useSelector(
//     (state) => state.subscriptionOrder
//   );

//   useEffect(() => {
//     dispatch(getUserDetails("profile"));
//     if (!user?.isSubscribed) {
//       dispatch(getActiveSubscription());
//     }
//   }, [dispatch, user?.isSubscribed]);

//   // ✅ SIMPLE & SAFE
//   const activePlan = subscriptions?.[0];

//   const handlePayment = () => {
//     if (!activePlan) return;
//     dispatch(createSubscriptionOrder(activePlan._id));
//   };

//   if (subsLoading) {
//     return (
//       <Box textAlign="center" mt="150px">
//         <Spinner size="xl" />
//       </Box>
//     );
//   }

//   return (
//     <Box
//       maxW="420px"
//       mx="auto"
//       mt="150px"
//       p={6}
//       borderWidth={1}
//       borderRadius="lg"
//       boxShadow="md"
//     >
//       <Text fontSize="xl" fontWeight="bold" mb={4}>
//         Subscription Plan
//       </Text>

//       <Divider mb={4} />

//       {!activePlan ? (
//         <>
//           <Badge colorScheme="red">NO ACTIVE PLAN</Badge>
//           <Text mt={2}>Subscription unavailable</Text>
//         </>
//       ) : user?.isSubscribed ? (
//         <>
//           <Badge colorScheme="green">ACTIVE SUBSCRIPTION</Badge>

//           <Text fontSize="lg" fontWeight="bold" mt={2}>
//             {activePlan?.title}
//           </Text>

//           <Text color="gray.600">{activePlan?.description}</Text>

//           <Text fontSize="2xl" fontWeight="bold" my={4}>
//             ₹{activePlan?.price}
//           </Text>

//           <Text>
//             Valid till:{" "}
//             <strong>
//               {new Date(user.subscription.endDate).toLocaleDateString()}
//             </strong>
//           </Text>
//         </>
//       ) : (
//         <>
//           <Text fontSize="lg" fontWeight="bold">
//             {activePlan?.title}
//           </Text>

//           <Text color="gray.600">{activePlan?.description}</Text>

//           <Text fontSize="2xl" fontWeight="bold" my={4}>
//             ₹{activePlan?.price}
//           </Text>

//           <Button
//             colorScheme="blue"
//             width="100%"
//             onClick={handlePayment}
//             isLoading={orderLoading}
//           >
//             Pay Subscription
//           </Button>
//         </>
//       )}
//     </Box>
//   );
// };

// export default SubscriptionPayment; 

import React, { useEffect, useState } from "react";
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
  const [billingCycle, setBillingCycle] = useState("yearly");

  /* ================= REDUX STATE ================= */
  const { userInfo } = useSelector((state) => state.userLogin);
  const { loading: userLoading, user } = useSelector(
    (state) => state.userDetails
  );
  const { subscriptions, loading: subsLoading } = useSelector(
    (state) => state.subscriptionList
  );
  const {
    loading: orderLoading,
    order,
    error: orderError,
  } = useSelector((state) => state.subscriptionOrder);
  const { success: confirmSuccess } = useSelector(
    (state) => state.subscriptionConfirm
  );

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    dispatch(getUserDetails("profile"));
    if (!user?.isSubscribed) {
      dispatch(getActiveSubscription());
    }
  }, [dispatch, user?.isSubscribed, confirmSuccess]);

  /* ================= ACTIVE PLAN LOGIC (UNCHANGED) ================= */
  const today = new Date();

  const activePlan = subscriptions?.find(
    (p) =>
      p.isActive &&
      new Date(p.startDate) <= today &&
      new Date(p.endDate) >= today
  );

  /* ================= PAY ================= */
  const handlePayment = () => {
    if (!activePlan) return;
    dispatch(createSubscriptionOrder(activePlan._id));
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
        );
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

  /* ================= NO ACTIVE SUBSCRIPTION ================= */
if (!activePlan) {
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
            {activePlan?.title || "Subscription"}
          </Text>

          <Text fontSize="xl" mt={6}>
            {activePlan?.description}
          </Text>
        </Box>

        {/* RIGHT SIDE CARD */}
        <Box
          bg="white"
          p={8}
          borderRadius="md"
          boxShadow="2xl"
          width={{ base: "100%", md: "420px" }}
        >
          {/* TOGGLE (UI ONLY) */}
          <HStack bg="#f4f6f8" p={1} borderRadius="md" mb={6}>
            {/* <Button
              flex="1"
              size="sm"
              bg={billingCycle === "monthly" ? "white" : "transparent"}
              onClick={() => setBillingCycle("monthly")}
            >
              Monthly
            </Button>
            <Button
              flex="1"
              size="sm"
              bg={billingCycle === "yearly" ? "gray.500" : "transparent"}
              color={billingCycle === "yearly" ? "white" : "gray.600"}
              onClick={() => setBillingCycle("yearly")}
            >
              Yearly
            </Button> */}
            <Text fontSize="2xl" fontWeight="bold">
              {activePlan?.title || "Subscription"}
            </Text>
          </HStack>

          {/* PRICE */}
          <Text fontSize="2xl" fontWeight="bold" mb={1}>
            ₹{activePlan?.price}
          </Text>

          {activePlan?.discount > 0 && (
            <Badge colorScheme="green" mb={4}>
              {activePlan.discount}% OFF
            </Badge>
          )}

          {/* OFFERS */}
          <List spacing={3} mb={6} color="gray.700">
            {activePlan?.offers?.map((offer, index) => (
              <ListItem key={index} fontSize="sm">
                <ListIcon as={CheckIcon} color="green.500" />
                {offer}
              </ListItem>
            ))}
          </List>

          {/* DATE INFO */}
          <Text fontSize="xs" color="gray.500" mb={4}>
            Valid from
            {new Date(activePlan?.startDate).toLocaleDateString()} –{" "}
            {new Date(activePlan?.endDate).toLocaleDateString()}
          </Text>

          {/* ACTION */}
          {user?.isSubscribed ? (
            <Badge colorScheme="green" width="100%" textAlign="center" p={2}>
              You already have an active subscription
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