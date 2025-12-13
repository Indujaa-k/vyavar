import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  SimpleGrid,
  Text,
  Flex,
  Image,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { listTransactions } from "../../actions/orderActions";

const AdminWallet = () => {
  const dispatch = useDispatch();

  // Fetch transactions from Redux store
  const transactionList = useSelector((state) => state.transactionList) || {
    transactions: [],
  };
  const { loading, error, transactions = [] } = transactionList;

  useEffect(() => {
    dispatch(listTransactions({})); // Fetch all transactions
  }, [dispatch]);

  // Calculate financial data
  const totalEarnings = transactions.reduce(
    (acc, order) => acc + order.totalPrice,
    0
  );
  const commissionEarned = transactions.reduce(
    (acc, order) => acc + (order.commission || 0),
    0
  );
  const deliveryChargeEarned = transactions.reduce(
    (acc, order) => acc + (order.shippingPrice || 0),
    0
  );
  const totalTaxCollected = transactions.reduce(
    (acc, order) => acc + (order.taxPrice || 0),
    0
  );
  const pendingAmount = transactions.reduce(
    (acc, order) => (!order.isPaid ? acc + order.totalPrice : acc),
    0
  );

  // Wallet data with emojis
  const walletData = [
    {
      title: "In-House Earning 💰",
      amount: `₹${totalEarnings.toFixed(2)}`,
      icon: "📈",
    },
    {
      title: "Commission Earned 📊",
      amount: `₹${commissionEarned.toFixed(2)}`,
      icon: "📉",
    },
    {
      title: "Delivery Charge Earned 🚚",
      amount: `₹${deliveryChargeEarned.toFixed(2)}`,
      icon: "🚀",
    },
    {
      title: "Total Tax Collected 🏛",
      amount: `₹${totalTaxCollected.toFixed(2)}`,
      icon: "📋",
    },
    {
      title: "Pending Amount ⏳",
      amount: `₹${pendingAmount.toFixed(2)}`,
      icon: "🕒",
    },
  ];

  return (
    <Box bg="gray.50" p={6} borderRadius="md" boxShadow="sm">
      {/* Header */}
      <Flex align="center" mb={4}>
        <Text fontSize="lg" fontWeight="bold">
          💼 Admin Wallet
        </Text>
      </Flex>

      {/* Loading & Error Handling */}
      {loading ? (
        <Center>
          <Spinner size="xl" color="blue.500" />
        </Center>
      ) : error ? (
        <Center>
          <Text color="red.500" fontSize="xl">
            {error}
          </Text>
        </Center>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          {walletData.map((item, index) => (
            <Box
              key={index}
              bg="white"
              p={6}
              borderRadius="md"
              boxShadow="md"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              minW="250px"
            >
              <Box>
                <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                  {item.amount}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {item.title}
                </Text>
              </Box>
              <Text fontSize="2xl">{item.icon}</Text>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default AdminWallet;
