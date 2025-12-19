import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Spinner,
  Progress,
  Flex,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Icon,
  Badge,
  Button,
} from "@chakra-ui/react";
import { FaClipboardList, FaCheckCircle, FaBox, FaTruck } from "react-icons/fa";
import { listOrders } from "../../actions/orderActions";

const OrderStatusSummary = () => {
  const dispatch = useDispatch();
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const orderList = useSelector((state) => state.orderList);
  const { loading, orders = [] } = orderList;

  useEffect(() => {
    dispatch(listOrders());
  }, [dispatch]);

  /* ===== STATUS COUNTS ===== */
  const totalOrders = orders.length;
  const confirmed = orders.filter(
    (order) =>
      order.isPaid &&
      !order.isPacked &&
      !order.isAcceptedByDelivery &&
      !order.isDelivered
  ).length;

  const packed = orders.filter(
    (order) =>
      order.isPacked && !order.isAcceptedByDelivery && !order.isDelivered
  ).length;

  const shipped = orders.filter(
    (order) => order.isAcceptedByDelivery && !order.isDelivered
  ).length;

  const delivered = orders.filter((order) => order.isDelivered).length;

  /* ===== FILTER BASED ON CLICK ===== */
  const filteredOrders = orders.filter((order) => {
    if (selectedStatus === "CONFIRMED") {
      return (
        order.isPaid === true &&
        order.isPacked === false &&
        order.isAcceptedByDelivery === false &&
        order.isDelivered === false
      );
    }

    if (selectedStatus === "PACKED") {
      return (
        order.isPacked === true &&
        order.isAcceptedByDelivery === false &&
        order.isDelivered === false
      );
    }

    if (selectedStatus === "SHIPPED") {
      return order.isAcceptedByDelivery === true && order.isDelivered === false;
    }

    if (selectedStatus === "DELIVERED") {
      return order.isDelivered === true;
    }

    return true; // ALL
  });

  /* ===== STATUS BADGE ===== */
  const getStatusBadge = (order) => {
    if (order.isDelivered) return <Badge colorScheme="green">DELIVERED</Badge>;
    if (order.isAcceptedByDelivery)
      return <Badge colorScheme="blue">SHIPPED</Badge>;
    if (order.isPacked) return <Badge colorScheme="orange">PACKED</Badge>;
    return <Badge colorScheme="yellow">CONFIRMED</Badge>;
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" h="200px">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box p={8} mt={8}>
      <Heading mb={6} textAlign="center">
        Order Status Summary
      </Heading>

      {/* ===== STATUS CARDS ===== */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6} mb={6}>
        <Stat
          p={4}
          shadow="md"
          borderRadius="md"
          bg="pink.100"
          cursor="pointer"
          onClick={() => setSelectedStatus("ALL")}
        >
          <StatLabel>
            <Icon as={FaClipboardList} mr={2} /> Total Orders
          </StatLabel>
          <StatNumber>{totalOrders}</StatNumber>
          <Progress value={100} mt={2} />
        </Stat>

        <Stat
          p={4}
          shadow="md"
          borderRadius="md"
          bg="yellow.100"
          cursor="pointer"
          onClick={() => setSelectedStatus("CONFIRMED")}
        >
          <StatLabel>
            <Icon as={FaCheckCircle} mr={2} /> Confirmed
          </StatLabel>
          <StatNumber>{confirmed}</StatNumber>
        </Stat>

        <Stat
          p={4}
          shadow="md"
          borderRadius="md"
          bg="orange.100"
          cursor="pointer"
          onClick={() => setSelectedStatus("PACKED")}
        >
          <StatLabel>
            <Icon as={FaBox} mr={2} /> Packed
          </StatLabel>
          <StatNumber>{packed}</StatNumber>
        </Stat>

        <Stat
          p={4}
          shadow="md"
          borderRadius="md"
          bg="green.100"
          cursor="pointer"
          onClick={() => setSelectedStatus("DELIVERED")}
        >
          <StatLabel>
            <Icon as={FaTruck} mr={2} /> Delivered
          </StatLabel>
          <StatNumber>{delivered}</StatNumber>
        </Stat>
      </SimpleGrid>

      {/* ===== RESET BUTTON ===== */}
      <Button
        mb={4}
        colorScheme="gray"
        onClick={() => setSelectedStatus("ALL")}
      >
        Show All Orders
      </Button>

      {/* ===== ORDERS TABLE ===== */}
      {filteredOrders.length === 0 ? (
        <Text>No orders found</Text>
      ) : (
        <Table variant="simple" bg="gray.50" borderRadius="md">
          <Thead>
            <Tr>
              <Th>Order ID</Th>
              <Th>Status</Th>
              <Th>Total</Th>
              <Th>Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredOrders.map((order) => (
              <Tr key={order._id}>
                <Td>{order._id}</Td>
                <Td>{getStatusBadge(order)}</Td>
                <Td>₹{order.totalPrice.toFixed(2)}</Td>
                <Td>{order.createdAt.substring(0, 10)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default OrderStatusSummary;
