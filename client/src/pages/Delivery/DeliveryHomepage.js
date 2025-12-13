import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Text, SimpleGrid, Flex, Icon, Avatar } from "@chakra-ui/react";
import { FaWallet, FaClock, FaCheckCircle, FaTruck } from "react-icons/fa";
import { getUserDetails } from "../../actions/userActions";
import { useNavigate } from "react-router-dom";
import RecentOrders from "./RecentOrders";

const DeliveryDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Combine user-related state selectors
  const { userInfo } = useSelector((state) => state.userLogin);
  const { user } = useSelector((state) => state.userDetails);
  const orders = useSelector((state) => state.deliveryOrders.orders) || [];

  useEffect(() => {
    if (userInfo) {
      dispatch(getUserDetails("profile"));
    }
  }, [dispatch, userInfo]);

  const handleStatusClick = (status) => {
    navigate(`/deliveryorders/${status}`);
  };

  // Compute order counts dynamically
  const assignedCount =
    orders?.filter((order) => !order.isDelivered && !order.isReturned).length ||
    0;
  const pausedCount =
    orders?.filter((order) => order.status === "paused").length || 0;
  const deliveredCount =
    orders?.filter((order) => order.isDelivered).length || 0;
  const returnedCount = orders?.filter((order) => order.isReturned).length || 0;
  const canceledCount =
    orders?.filter((order) => order.status === "canceled").length || 0;
  const outForDeliveryCount =
    orders?.filter((order) => order.isAcceptedByDelivery && !order.isDelivered)
      .length || 0;

  // Calculate Cash in Hand from completed orders
  const cashInHand = orders
    .filter((order) => order.isDelivered)
    .reduce((sum, order) => sum + (order.totalPrice || 0), 0)
    .toFixed(2);

  return (
    <>
      <Box
        p={5}
        m="30"
        bg="yellow"
        borderRadius="lg"
        color="black"
        textAlign="center"
      >
        {/* User Profile */}
        <Flex align="center" justify="center" mb={4}>
          <Avatar
            size="xl"
            name={user?.name}
            src={user?.profilePicture || "https://via.placeholder.com/150"}
          />
          <Box ml={3}>
            <Text fontSize="xl">Hi, {user?.name || "User"}</Text>
            <Text fontSize="2xl" fontWeight="bold">
              Rs. {cashInHand}
            </Text>
            <Text fontSize="sm">Balance</Text>
          </Box>
        </Flex>

        {/* Balance Stats */}
        <SimpleGrid columns={3} spacing={3}>
          {[
            { label: "Cash in hand", value: `Rs. ${cashInHand}` },
            { label: "Pending withdraw", value: "₹0K" },
            { label: "Withdrawn", value: "₹0K" },
          ].map((item, index) => (
            <Box
              key={index}
              p={3}
              bg="white"
              borderRadius="lg"
              cursor="pointer"
              _hover={{ bg: "gray.200" }}
            >
              <Text fontSize="lg" fontWeight="bold">
                {item.value}
              </Text>
              <Text fontSize="sm">{item.label}</Text>
            </Box>
          ))}
        </SimpleGrid>

        <Text mt={4} fontSize="lg" fontWeight="bold">
          ₹0K
        </Text>
        <Text fontSize="sm">Withdrawable balance</Text>
      </Box>

      {/* Order Status */}
      <Box mt={6} bg="white" p={4} borderRadius="lg" color="black">
        <Text fontSize="lg" fontWeight="bold" textAlign={"center"} m="5">
          Order Status
        </Text>
        <Flex gap="5" justifyContent="center">
          {[
            {
              label: "Assigned",
              value: assignedCount,
              color: "blue.100",
              icon: FaTruck,
              query: "asigned",
            },
            {
              label: "Paused",
              value: pausedCount,
              color: "yellow.100",
              icon: FaClock,
              query: "paused",
            },
            {
              label: "Delivered",
              value: deliveredCount,
              color: "green.100",
              icon: FaCheckCircle,
              query: "delivered",
            },
            {
              label: "returned",
              value: returnedCount,
              color: "yellow.100",
              icon: FaClock,
              query: "returned",
            },
            {
              label: "canceled",
              value: canceledCount,
              color: "red.100",
              icon: FaClock,
              query: "canceled",
            },
            {
              label: "Out for Delivery",
              value: outForDeliveryCount,
              color: "green.100",
              icon: FaTruck,
              query: "outForDelivery",
            },
          ].map((status, index) => (
            <Flex
              key={index}
              justify="space-between"
              align="center"
              bg={status.color}
              p={5}
              borderRadius="lg"
              w="100%"
              maxWidth={300}
              mt={2}
              cursor="pointer"
              _hover={{ bg: "gray.200" }}
              onClick={() => handleStatusClick(status.query)}
            >
              <Flex align="center">
                <Icon as={status.icon} boxSize={6} mr={2} />
                <Text fontSize="md">{status.label}</Text>
              </Flex>
              <Text fontSize="lg" fontWeight="bold">
                {status.value}
              </Text>
            </Flex>
          ))}
        </Flex>
      </Box>
      <RecentOrders />
    </>
  );
};

export default DeliveryDashboard;
