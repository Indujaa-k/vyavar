import React, { useEffect } from "react";
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

  // Fetch transactions on component mount
  useEffect(() => {
    dispatch(listTransactions({})); // Fetch all transactions
  }, [dispatch]);

  // Debugging: Check transactions data
  console.log("Transactions data:", transactions);

  // Format transaction data for display
  const formattedTransactions = transactions.map((order) => {
    const dateObj = new Date(order.createdAt);
    const formattedDate = dateObj.toLocaleDateString(); // Extract Date (MM/DD/YYYY or local format)
    const formattedTime = dateObj.toLocaleTimeString(); // Extract Time (HH:MM AM/PM)

    return {
      date: formattedDate,
      time: formattedTime,
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
      <h1 className="titlepanel">💰 Transaction</h1>
      {/* Loading & Error Handling */}
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
                  <Td>${t.totalPrice.toFixed(2)}</Td>
                  <Td>{t.qty}</Td>
                  <Td>${t.taxPrice.toFixed(2)}</Td>
                  <Td>${t.shippingPrice.toFixed(2)}</Td>
                  <Td fontWeight="bold">${t.totalPrice.toFixed(2)}</Td>
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
