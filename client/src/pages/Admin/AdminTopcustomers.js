import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ListUsers } from "../../actions/userActions";
import {
  Box,
  Heading,
  Grid,
  GridItem,
  Avatar,
  Text,
  Badge,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { FaMedal } from "react-icons/fa";

const AdminTopCustomers = () => {
  const dispatch = useDispatch();

  // Get user list from Redux store
  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;

  useEffect(() => {
    dispatch(ListUsers()); // Fetch users from the database
  }, [dispatch]);

  // Sort users by number of orders (descending) and get the top 6 customers
  const topCustomers = users
    ? [...users]
        .filter((user) => user.orderHistory?.length > 0) // Only include users with orders
        .sort((a, b) => b.orderHistory.length - a.orderHistory.length)
        .slice(0, 6)
    : [];

  return (
    <Box p={6} bg="white" borderRadius="md" boxShadow="sm">
      {/* Title */}
      <Heading as="h3" size="md" mb={5} display="flex" alignItems="center">
        <FaMedal color="gold" style={{ marginRight: 8 }} /> Top Customers
      </Heading>

      {/* Show Loading Spinner */}
      {loading ? (
        <Center py={10}>
          <Spinner size="xl" color="blue.500" />
        </Center>
      ) : error ? (
        <Text color="red.500">Failed to load customers</Text>
      ) : (
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          {topCustomers.map((customer) => (
            <GridItem
              key={customer._id}
              p={5}
              bg="gray.50"
              borderRadius="md"
              textAlign="center"
              boxShadow="xs"
            >
              <Avatar
                size="xl"
                src={
                  customer.profilePicture || "https://via.placeholder.com/100"
                }
                mb={3}
              />
              <Text fontWeight="bold">{customer.name}</Text>
              <Badge colorScheme="blue" mt={2}>
                Orders: {customer.orderHistory.length}
              </Badge>
            </GridItem>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default AdminTopCustomers;
