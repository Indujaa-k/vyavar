import React, { useEffect } from "react";
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
} from "@chakra-ui/react";
import { FaClipboardList, FaCheckCircle, FaBox, FaTruck } from "react-icons/fa";
import { listOrders } from "../../actions/orderActions";

const OrderStatusSummary = () => {
  const dispatch = useDispatch();

  const orderList = useSelector((state) => state.orderList);
  const { loading, orders = [] } = orderList;

  useEffect(() => {
    dispatch(listOrders());
  }, [dispatch]);

  const totalOrders = orders.length;
  const confirmed = orders.filter((order) => order.orderStatus === "confirmed").length;
  const packed = orders.filter((order) => order.orderStatus === "packed").length;
  const delivered = orders.filter((order) => order.orderStatus === "delivered").length;

  const lastFiveOrders = orders.slice(-5).reverse(); // last 5 orders

  if (loading)
    return (
      <Flex justify="center" align="center" h="200px">
        <Spinner size="xl" />
      </Flex>
    );

  return (
    <Box p={8} mt={8}>
      <Heading mb={6} textAlign="center">
        Order Status Summary
      </Heading>

      {/* Stats Cards */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6} mb={8}>
        <Stat
          p={4}
          shadow="md"
          borderRadius="md"
          bg="pink.100"
          _hover={{ transform: "scale(1.05)", transition: "0.2s" }}
        >
          <StatLabel>
            <Icon as={FaClipboardList} mr={2} /> Total Orders
          </StatLabel>
          <StatNumber>{totalOrders}</StatNumber>
          <Progress value={100} mt={2} colorScheme="pink" />
        </Stat>

        <Stat
          p={4}
          shadow="md"
          borderRadius="md"
          bg="yellow.100"
          _hover={{ transform: "scale(1.05)", transition: "0.2s" }}
        >
          <StatLabel>
            <Icon as={FaCheckCircle} mr={2} /> Confirmed
          </StatLabel>
          <StatNumber>{confirmed}</StatNumber>
          <Progress value={totalOrders ? (confirmed / totalOrders) * 100 : 0} mt={2} colorScheme="yellow" />
        </Stat>

        <Stat
          p={4}
          shadow="md"
          borderRadius="md"
          bg="orange.100"
          _hover={{ transform: "scale(1.05)", transition: "0.2s" }}
        >
          <StatLabel>
            <Icon as={FaBox} mr={2} /> Packed
          </StatLabel>
          <StatNumber>{packed}</StatNumber>
          <Progress value={totalOrders ? (packed / totalOrders) * 100 : 0} mt={2} colorScheme="orange" />
        </Stat>

        <Stat
          p={4}
          shadow="md"
          borderRadius="md"
          bg="green.100"
          _hover={{ transform: "scale(1.05)", transition: "0.2s" }}
        >
          <StatLabel>
            <Icon as={FaTruck} mr={2} /> Delivered
          </StatLabel>
          <StatNumber>{delivered}</StatNumber>
          <Progress value={totalOrders ? (delivered / totalOrders) * 100 : 0} mt={2} colorScheme="green" />
        </Stat>
      </SimpleGrid>

      {/* Recent Orders Table */}
      <Box>
        <Heading size="md" mb={4}>
          Recent Orders
        </Heading>
        {lastFiveOrders.length === 0 ? (
          <Text>No recent orders</Text>
        ) : (
          <Table variant="simple" bg="gray.50" borderRadius="md">
            <Thead>
              <Tr>
                <Th>Order ID</Th>
                <Th>Status</Th>
                <Th>Total Price</Th>
                <Th>Date</Th>
              </Tr>
            </Thead>
            <Tbody>
              {lastFiveOrders.map((order) => (
                <Tr key={order._id}>
                  <Td>{order._id}</Td>
                  <Td>
                    <Badge
                      colorScheme={
                        order.orderStatus === "confirmed"
                          ? "yellow"
                          : order.orderStatus === "packed"
                          ? "yellow"
                          : order.orderStatus === "delivered"
                          ? "green"
                          : "gyellow"
                      }
                    >
                      {order.orderStatus.toUpperCase()}
                    </Badge>
                  </Td>
                  <Td>₹{order.totalPrice.toFixed(2)}</Td>
                  <Td>{new Date(order.createdAt).toLocaleDateString()}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
    </Box>
  );
};

export default OrderStatusSummary;
