import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { listOrders, updateOrderStatus } from "../../actions/orderActions";
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
  HStack,
  Image,
  Badge,
  Select,
  Button,
  Stack,
} from "@chakra-ui/react";
import { AiOutlineEdit } from "react-icons/ai";

const OrdersScreen = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [statusUpdates, setStatusUpdates] = useState({}); // For storing dropdown selections
  const { status } = useParams();
  const dispatch = useDispatch();

  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders } = orderList;

  const orderStatusUpdate = useSelector((state) => state.orderStatusUpdate);
  const { success } = orderStatusUpdate;

  useEffect(() => {
    dispatch(listOrders(status));
  }, [dispatch, status, success]); // refetch on status change success

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleStatusChange = (orderId, newStatus) => {
    setStatusUpdates({ ...statusUpdates, [orderId]: newStatus });
  };

  const handleStatusUpdate = (orderId) => {
    const newStatus = statusUpdates[orderId];
    if (newStatus) {
      dispatch(updateOrderStatus(orderId, newStatus));
    }
  };

  const filteredOrders = selectedDate
    ? orders.filter(
        (order) => order.createdAt.substring(0, 10) === selectedDate
      )
    : orders;

  const getOrderStatus = (order) => {
    if (order.isReturned) return { label: "Returned", color: "red" };
    else if (order.isDelivered) return { label: "Delivered", color: "green" };
    else if (order.isAcceptedByDelivery)
      return { label: "Shipped", color: "blue" };
    else if (order.isPacked) return { label: "Packed", color: "orange" };
    else return { label: "Ordered", color: "gray" };
  };

  return (
    <Box p={8}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
        mt={8}
        w="100%"
      >
        <Heading fontSize="lg">
          {status ? `${status.toUpperCase()} Orders` : "All Orders"}
        </Heading>
        <Box maxW="200px" flexShrink={0}>
          <Input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            bg="white"
          />
        </Box>
      </Box>

      {loading ? (
        <Spinner size="xl" />
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : (
        <VStack spacing={4} align="stretch">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              console.log("ORDER ITEMS:", order.orderItems); 
              const statusObj = getOrderStatus(order);
              const shipment = order.shipmentDetails?.[0] || {};
              const currentStatus = statusUpdates[order._id] || statusObj.label;

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
                        <Th textAlign="center">size</Th>
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
                          <Select
                            value={
                              statusUpdates[order._id] ||
                              getOrderStatus(order).label
                            }
                            onChange={(e) =>
                              handleStatusChange(order._id, e.target.value)
                            }
                            minW="150px"
                          >
                            <option value="Ordered">Ordered</option>
                            <option value="Packed">Packed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Returned">Returned</option>
                          </Select>
                        </Td>
                        <Td textAlign="center">
                          {shipment.trackingNumber || "N/A"}
                        </Td>
                        <Td textAlign="center">
                          <HStack spacing={2} justify="center">
                            {order.orderItems?.map((item, index) => (
  <Box key={index} textAlign="center">
    {item?.product?.images?.length > 0 ? (
      <Image
        src={item.product.images[0]}
        alt={item.product.brandname || "Product"}
        boxSize="50px"
        objectFit="cover"
        borderRadius="5px"
      />
    ) : (
      <Text fontSize="xs" color="gray.500">
        No Image
      </Text>
    )}
  </Box>
))}

                          </HStack>
                        </Td>
                        <Td textAlign="center">
                          <VStack spacing={1}>
                            {order.orderItems.map((item) => (
                              <Text
                                key={item._id}
                                fontSize="sm"
                                fontWeight="bold"
                              >
                                {item.size || "N/A"}
                              </Text>
                            ))}
                          </VStack>
                        </Td>
                        
                        <Td textAlign="center">
                          <Stack spacing={2}>
                            <Button
                              size="xs"
                              colorScheme="green"
                              onClick={() => handleStatusUpdate(order._id)}
                            >
                              Update
                            </Button>
                            <Button size="xs" colorScheme="blue">
                               <Link to={`/order/${order._id}`}>
                                <AiOutlineEdit size={14} /> Details
                              </Link>
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
