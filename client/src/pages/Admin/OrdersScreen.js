import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { listOrders } from "../../actions/orderActions";
import {
  Box,
  Spinner,
  VStack,
  Text,
  Input,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Stack,
  HStack,
  Image,
  Badge,
  Button,
} from "@chakra-ui/react";
import { AiOutlineEdit } from "react-icons/ai";
import { useState } from "react";

const OrdersScreen = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const { status } = useParams(); // Get status from URL
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders } = orderList;

  useEffect(() => {
    dispatch(listOrders(status)); // Fetch orders based on status
  }, [dispatch, status]);

 

  const getOrderStatus = (order) => {
    if (order.isReturned) {
      return { label: "Returned", color: "red" };
    } else if (order.isDelivered) {
      return { label: "Delivered", color: "green" };
    } else if (order.isAcceptedByDelivery) {
      return { label: "Shipped", color: "blue" };
    } else if (order.isPacked) {
      return { label: "Packed", color: "orange" };
    } else {
      return { label: "Ordered", color: "gray" };
    }
  };
  // Handle Date Change
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  // Filter orders based on selected date
  const filteredOrders = selectedDate
    ? orders.filter(
        (order) => order.createdAt.substring(0, 10) === selectedDate
      )
    : orders;
  return (
    <Box p={8}>
      <Heading fontSize="lg" mb={4} mt="10">
        {status ? `${status.toUpperCase()} Orders` : "All Orders"}
      </Heading>
      <Box mb={4} display="flex" alignItems="center" gap={4}>
        <Input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          width="200px"
          placeholder="Select Date"
          bg="white"
        />
      </Box>
      {loading ? (
        <Spinner size="xl" />
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : (
        <VStack spacing={4} align="stretch">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              const status = getOrderStatus(order);
              const shipment = order.shipmentDetails?.[0] || {};

              return (
                <Box
                  key={order._id}
                  borderWidth="1px"
                  borderRadius="lg"
                  p={4}
                  bg="white"
                  boxShadow="md"
                  _hover={{ shadow: "lg" }}
                >
                  {/* Order Table */}
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th textAlign="center">Order ID</Th>
                        <Th textAlign="center">Customer</Th>
                        <Th textAlign="center">Date</Th>
                        <Th textAlign="center">Total</Th>
                        <Th textAlign="center">Paid</Th>
                        <Th textAlign="center">Payment Method</Th>
                        <Th textAlign="center">Status</Th>
                        <Th textAlign="center">Tracking No</Th>
                        <Th textAlign="center">Product Image</Th>
                        <Th textAlign="center">Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td textAlign="center">{order._id}</Td>
                        <Td textAlign="center">{order.user?.name || "N/A"}</Td>
                        <Td textAlign="center">
                          {order.createdAt.substring(0, 10)}
                        </Td>
                        <Td textAlign="center">
                          Rs.{order.totalPrice.toFixed(2)}
                        </Td>
                        <Td textAlign="center">
                          {order.isPaid ? (
                            <Badge colorScheme="green">
                              {order.paidAt?.substring(0, 10)}
                            </Badge>
                          ) : (
                            <Badge colorScheme="red">Not Paid</Badge>
                          )}
                        </Td>
                        <Td textAlign="center">
                          {order.paymentMethod || "N/A"}
                        </Td>
                        <Td textAlign="center">
                          <Badge colorScheme={status.color}>
                            {status.label}
                          </Badge>
                        </Td>
                        <Td textAlign="center">
                          {shipment.trackingNumber || "N/A"}
                        </Td>
                        <Td textAlign="center">
                          <HStack spacing={2} justify="center">
                            {order.orderItems.map((item) => (
                              <Box key={item._id} textAlign="center">
                                {item.product?.images?.[0] && (
                                  <Image
                                    src={item.product.images[0]}
                                    alt={item.product.brandname}
                                    boxSize="50px"
                                    objectFit="cover"
                                    borderRadius="5px"
                                  />
                                )}
                              </Box>
                            ))}
                          </HStack>
                        </Td>
                        <Td textAlign="center">
                          <Stack spacing={2}>
                            <Button size="xs" colorScheme="blue">
                              <Link to={`/order/${order._id}`}>
                                <AiOutlineEdit size="14" /> Details
                              </Link>
                            </Button>
                            <Button
                              size="xs"
                              colorScheme="teal"
                              onClick={() =>
                                navigate(`/${order._id}/orderscreenstatus`)
                              }
                            >
                              Order Status
                            </Button>
                          </Stack>
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </Box>
              );
            })
          ) : (
            <Text>No orders available</Text>
          )}
        </VStack>
      )}
    </Box>
  );
};

export default OrdersScreen;
