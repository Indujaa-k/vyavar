import React from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const RecentOrders = () => {
  const orders = useSelector((state) => state.deliveryOrders.orders) || [];
  const navigate = useNavigate();
  // Filter only pending orders (not delivered, not returned, not canceled)
  const pendingOrders = orders.filter(
    (order) =>
      !order.isDelivered && !order.isReturned && order.status !== "canceled"
  );

  // Sort pending orders by date (newest first)
  const sortedOrders = [...pendingOrders].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Show only the 5 most recent pending orders
  const recentOrders = sortedOrders.slice(0, 5);
  const handleRowClick = () => {
    navigate("/deliveryorders/asigned");
  };
  return (
    <Box mt={6} bg="white" p={4} borderRadius="lg">
      <Text fontSize="lg" fontWeight="bold" textAlign="center" mb={4}>
        Pending Orders
      </Text>

      {pendingOrders.length === 0 ? (
        <Text textAlign="center">No pending orders.</Text>
      ) : (
        <Table variant="striped" size={"lg"} bg={"pink"}>
          <Thead>
            <Tr>
              <Th>Order ID</Th>
              <Th>Name</Th>
              <Th>Address</Th>
              <Th>Status</Th>
              <Th>Date</Th>
              <Th>Amount</Th>
            </Tr>
          </Thead>
          <Tbody>
            {recentOrders.map((order) => (
              <Tr
                key={order._id}
                onClick={handleRowClick}
                cursor="pointer"
                _hover={{ bg: "gray.200" }} // Highlight row on hover
              >
                <Td>{order._id}</Td>
                <Td>{order.user?.name}</Td>
                <Td>
                  {order.shippingAddress.doorNo}, {order.shippingAddress.street}
                  , {order.shippingAddress.city}, {order.shippingAddress.state}-
                  {order.shippingAddress.pin}, {order.shippingAddress.country},
                  {order.shippingAddress.phoneNumber}
                </Td>
                <Td>Pending</Td>
                <Td>{new Date(order.createdAt).toLocaleDateString()}</Td>
                <Td>${order.totalPrice.toFixed(2)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default RecentOrders;
