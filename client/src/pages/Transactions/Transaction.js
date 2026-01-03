import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listTransactions } from "../../actions/orderActions";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Flex,
  Spinner,
  Text,
  Center,
} from "@chakra-ui/react";

const TransactionTable = () => {
  const dispatch = useDispatch();

  // Fetch transactions from Redux store
  const transactionList = useSelector((state) => state.transactionList) || {
    transactions: [],
  };
  const { loading, error, transactions = [] } = transactionList;
  const [filter, setFilter] = useState("all"); // all | week | month

  // Fetch transactions on component mount
  useEffect(() => {
    dispatch(listTransactions({})); // Fetch all transactions
  }, [dispatch]);

  // Debugging: Check transactions data
  console.log("Transactions data:", transactions);
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const filteredTransactions = useMemo(() => {
    const now = new Date();

    return sortedTransactions.filter((order) => {
      const orderDate = new Date(order.createdAt);

      if (filter === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return orderDate >= weekAgo;
      }

      if (filter === "month") {
        return (
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      }

      return true; // all
    });
  }, [sortedTransactions, filter]);
  const stats = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, order) => {
        acc.totalAmount += order.totalPrice;
        acc.totalTax += order.taxPrice;
        acc.totalOrders += 1;
        return acc;
      },
      { totalAmount: 0, totalTax: 0, totalOrders: 0 }
    );
  }, [filteredTransactions]);

  // Format transaction data for display
  const formattedTransactions = filteredTransactions.map((order) => {
    const dateObj = new Date(order.createdAt);

    return {
      date: dateObj.toLocaleDateString(),
      time: dateObj.toLocaleTimeString(),
      paymentType: order.paymentMethod,
      status: order.isPaid ? "✅ Paid" : "❌ Unpaid",
      totalPrice: order.totalPrice,
      taxPrice: order.taxPrice,
      shippingPrice: order.shippingPrice,
      qty: order.orderItems.reduce((acc, item) => acc + item.qty, 0),
    };
  });

  return (
    <Box p={6} minH="100vh" m={10}>
      {/* Loading & Error Handling */}
      <Flex
        justify="space-between"
        align="center"
        mb={8}
        flexWrap="wrap"
        gap={4}
      >
        <Text fontSize="2xl" fontWeight="bold" color="black">
          💰 Transactions Overview
        </Text>

        <Flex gap={3}>
          {["all", "week", "month"].map((type) => (
            <Box
              key={type}
              as="button"
              px={5}
              py={2}
              bg={filter === type ? "purple.500" : "gray.700"}
              color="white"
              borderRadius="full"
              fontWeight="semibold"
              _hover={{ bg: "purple.400" }}
              onClick={() => setFilter(type)}
            >
              {type === "all"
                ? "All"
                : type === "week"
                ? "Last 7 Days"
                : "This Month"}
            </Box>
          ))}
        </Flex>
        <Flex gap={6} mb={10} flexWrap="wrap">
          <Box
            bg="linear-gradient(135deg, #38A169, #2F855A)"
            p={6}
            borderRadius="xl"
            color="white"
            minW="240px"
            boxShadow="lg"
          >
            <Text fontSize="sm" opacity={0.8}>
              Total Amount
            </Text>
            <Text fontSize="3xl" fontWeight="bold">
              ₹{stats.totalAmount.toFixed(2)}
            </Text>
          </Box>

          <Box
            bg="linear-gradient(135deg, #3182CE, #2C5282)"
            p={6}
            borderRadius="xl"
            color="white"
            minW="240px"
            boxShadow="lg"
          >
            <Text fontSize="sm" opacity={0.8}>
              Total Tax Collected
            </Text>
            <Text fontSize="3xl" fontWeight="bold">
              ₹{stats.totalTax.toFixed(2)}
            </Text>
          </Box>

          <Box
            bg="linear-gradient(135deg, #805AD5, #553C9A)"
            p={6}
            borderRadius="xl"
            color="white"
            minW="240px"
            boxShadow="lg"
          >
            <Text fontSize="sm" opacity={0.8}>
              Total Orders
            </Text>
            <Text fontSize="3xl" fontWeight="bold">
              {stats.totalOrders}
            </Text>
          </Box>
        </Flex>
      </Flex>

      {loading ? (
        <Flex justify="center" align="center" height="200px">
          <Spinner size="xl" color="white" />
        </Flex>
      ) : error ? (
        <Center>
          <Text color="red.500" fontSize="xl">
            {error}
          </Text>
        </Center>
      ) : transactions.length === 0 ? (
        <Center>
          <Text color="white" fontSize="xl">
            No transactions available.
          </Text>
        </Center>
      ) : (
        <TableContainer>
          <Table variant="striped" colorScheme="blue">
            <Thead bg="purple.500">
              <Tr>
                <Th color="white">📅 Date</Th>
                <Th color="white">⏰ Time</Th>
                <Th color="white">💳 Payment Type</Th>
                <Th color="white">📌 Status</Th>
                <Th color="white">💰 Price</Th>
                <Th color="white">📦 Qty</Th>
                <Th color="white">⚖ Tax</Th>
                <Th color="white">🚚 Shipping</Th>
                <Th color="white">🏷 Total</Th>
              </Tr>
            </Thead>
            <Tbody>
              {formattedTransactions.map((t, index) => (
                <Tr
                  key={index}
                  bg={index % 2 === 0 ? "gray.100" : "gray.200"} // Alternating row colors
                  _hover={{ bg: "cyan.200" }} // Hover effect
                >
                  <Td fontWeight="bold">{t.date}</Td>
                  <Td fontWeight="bold">{t.time}</Td>
                  <Td>{t.paymentType}</Td>
                  <Td
                    fontWeight="bold"
                    color={t.status === "✅ Paid" ? "green.500" : "red.500"}
                  >
                    {t.status}
                  </Td>
                  <Td>₹{t.totalPrice.toFixed(2)}</Td>
                  <Td>{t.qty}</Td>
                  <Td>₹{t.taxPrice.toFixed(2)}</Td>
                  <Td>₹{t.shippingPrice.toFixed(2)}</Td>
                  <Td fontWeight="bold">₹{t.totalPrice.toFixed(2)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default TransactionTable;
