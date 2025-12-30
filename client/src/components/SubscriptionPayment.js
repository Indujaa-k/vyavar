import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "../actions/userActions";
import { Box, Button, Text, Spinner, Badge } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const SubscriptionPayment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🔹 Logged-in user
  const { userInfo } = useSelector((state) => state.userLogin);

  // 🔹 User details
  const { loading, error, user } = useSelector(
    (state) => state.userDetails
  );

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      dispatch(getUserDetails("profile"));
    }
  }, [dispatch, userInfo, navigate]);

  const subscribeHandler = () => {
    // 👉 Next step: redirect to payment page / create payment
    navigate("/subscription/checkout");
  };

  if (loading) return <Spinner size="xl" />;
  if (error) return <Text color="red.500">{error}</Text>;

  return (
    <Box maxW="600px" mx="auto" mt={10} p={6} borderWidth="1px" borderRadius="lg">
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Subscription Details
      </Text>

      {/* USER INFO */}
      <Box mb={4}>
        <Text><b>Name:</b> {user?.name}</Text>
        <Text><b>Email:</b> {user?.email}</Text>
      </Box>

      {/* SUBSCRIPTION STATUS */}
      {user?.isSubscribed ? (
        <Box p={4} bg="green.50" borderRadius="md">
          <Badge colorScheme="green" mb={2}>
            Active Subscription
          </Badge>

          <Text><b>Plan:</b> {user.subscription.planName}</Text>
          <Text>
            <b>Discount:</b> {user.subscription.discountPercent}%
          </Text>
          <Text>
            <b>Start:</b>{" "}
            {new Date(user.subscription.startDate).toLocaleDateString()}
          </Text>
          <Text>
            <b>End:</b>{" "}
            {new Date(user.subscription.endDate).toLocaleDateString()}
          </Text>

          <Button mt={4} colorScheme="gray" isDisabled>
            Already Subscribed
          </Button>
        </Box>
      ) : (
        <Box p={4} bg="gray.50" borderRadius="md">
          <Badge colorScheme="red" mb={2}>
            No Active Subscription
          </Badge>

          <Text mb={3}>
            Subscribe now to get exclusive discounts on every order.
          </Text>

          <Button
            colorScheme="blue"
            width="100%"
            onClick={subscribeHandler}
          >
            Buy Subscription
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default SubscriptionPayment;
