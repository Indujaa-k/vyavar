import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
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
  Tabs,
  TabList,
  Tab,
  HStack,
  Image,
  Badge,
  Select,
  Button,
  Stack,
  Grid,
} from "@chakra-ui/react";
import { AiOutlineEdit } from "react-icons/ai";

const OrdersScreen = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [statusUpdates, setStatusUpdates] = useState({}); // For storing dropdown selections
  const { status } = useParams();
  const statusLower = status?.toLowerCase();
  // ✅ HERE (THIS LINE)
  console.log("STATUS FROM URL:", status);
  const dispatch = useDispatch();
  // const [activeTab, setActiveTab] = useState("ALL");

  const orderList = useSelector((state) => state.orderList);
  const { loading, error, orders } = orderList;
  const API_URL = process.env.REACT_APP_API_URL;

  const orderStatusUpdate = useSelector((state) => state.orderStatusUpdate);
  const { success } = orderStatusUpdate;

  useEffect(() => {
    dispatch(listOrders());
  }, [dispatch, success]);
  // refetch on status change success

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleStatusChange = (orderId, newStatus) => {
    axios
      .put(`/api/orders/${orderId}/updateorderstatus`, { status: newStatus })
      .then((res) => {
        console.log("Order updated", res.data);
        // update local state to show new status immediately
      })
      .catch((err) => console.log(err));
  };

  const handleStatusUpdate = (orderId) => {
    const newStatus = statusUpdates[orderId];
    if (newStatus) {
      dispatch(updateOrderStatus(orderId, newStatus));
    }
  };

  const filteredOrders = orders
    ?.slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    ?.filter((order) => {
      if (!statusLower || statusLower === "all orders") return true;

      if (statusLower === "confirmed") return order.orderStatus === "CONFIRMED";

      if (statusLower === "packed") return order.orderStatus === "PACKED";

      if (statusLower === "dispatched" || statusLower === "outfordelivery")
        return order.orderStatus === "OUT_FOR_DELIVERY";

      return true;
    })

    .filter((order) =>
      selectedDate ? order.createdAt.substring(0, 10) === selectedDate : true,
    );

  const getOrderStatus = (order) => {
    if (order.isReturned) return { label: "Returned", color: "red" };
    else if (order.isDelivered) return { label: "Delivered", color: "green" };
    else if (order.isAcceptedByDelivery)
      return { label: "Shipped", color: "blue" };
    else if (order.isPacked) return { label: "Packed", color: "orange" };
    else return { label: "Ordered", color: "gray" };
  };

  return (
    <Box p={8} pt={0}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
        mt={0}
        w="100%"
      >
        <Heading fontSize="lg">
          {statusLower ? `${statusLower.toUpperCase()} ` : "All Orders"}
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
              const getStatusOptions = (currentPageStatus) => {
                if (!currentPageStatus || currentPageStatus === "allorders") {
                  return ["CONFIRMED", "PACKED", "OUT_FOR_DELIVERY"];
                }

                if (currentPageStatus === "confirmed") {
                  return ["PACKED", "OUT_FOR_DELIVERY"];
                }

                if (currentPageStatus === "packed") {
                  return ["OUT_FOR_DELIVERY"];
                }

                return [];
              };

              return (
                <Box
                  key={order._id}
                  borderWidth="1px"
                  borderRadius="lg"
                  p={4}
                  bg="white"
                  boxShadow="md"
                >
                  {/* 🔹 Order ID – Full Width */}
                  <Box
                    bg="gray.100"
                    p={2}
                    borderRadius="md"
                    mb={3}
                    fontWeight="bold"
                    fontSize="sm"
                  >
                    Order ID : {order._id}
                  </Box>

                  {/* 🔹 Header Row */}
                  <Grid
                    templateColumns="repeat(8, 1fr)"
                    fontSize="sm"
                    fontWeight="bold"
                    color="gray.600"
                    mb={2}
                  >
                    <Text>Customer</Text>
                    <Text>Date</Text>
                    <Text>Total</Text>
                    <Text>Paid</Text>
                    <Text>Payment</Text>
                    <Text>Status</Text>
                    <Text textAlign="center">Images</Text>
                    <Text textAlign="center">Actions</Text>
                  </Grid>

                  {/* 🔹 Data Row */}
                  <Grid
                    templateColumns="repeat(8, 1fr)"
                    alignItems="center"
                    fontSize="sm"
                    gap={2}
                  >
                    <Text>{order.user?.name || "N/A"}</Text>

                    <Text>{order.createdAt.substring(0, 10)}</Text>

                    <Text>₹{order.totalPrice.toFixed(2)}</Text>

                    <Box>
                      {order.isPaid ? (
                        <Badge colorScheme="green">
                          {order.paidAt?.substring(0, 10)}
                        </Badge>
                      ) : (
                        <Badge colorScheme="red">Not Paid</Badge>
                      )}
                    </Box>

                    <Text>{order.paymentMethod || "N/A"}</Text>

                    {/* Status */}
                    <Box>
                      {statusLower === "dispatched" ||
                      order.orderStatus === "OUT_FOR_DELIVERY" ? (
                        <Badge colorScheme="blue">Dispatched</Badge>
                      ) : (
                        <Select
                          size="sm"
                          value={statusUpdates[order._id] || ""}
                          onChange={(e) =>
                            setStatusUpdates((prev) => ({
                              ...prev,
                              [order._id]: e.target.value,
                            }))
                          }
                        >
                          {/* Default showing current page status */}
                          <option value="" disabled>
                            {statusLower === "confirmed" && "CONFIRMED"}
                            {statusLower === "packed" && "PACKED"}
                            {(!statusLower || statusLower === "allorders") &&
                              "CONFIRMED"}
                          </option>

                          {getStatusOptions(statusLower).map((status) => (
                            <option key={status} value={status}>
                              {status === "OUT_FOR_DELIVERY"
                                ? "Dispatched"
                                : status}
                            </option>
                          ))}
                        </Select>
                      )}
                    </Box>

                    {/* Images */}
                    <HStack spacing={1} justify="center">
                      {order.orderItems?.map((item, index) => (
                        <Image
                          key={index}
                          src={
                            item?.product?.images?.[0]
                              ? `${API_URL}/${item.product.images[0]}`
                              : "/placeholder.jpg"
                          }
                          boxSize="35px"
                          objectFit="cover"
                          borderRadius="md"
                        />
                      ))}
                    </HStack>

                    {/* Actions */}
                    <VStack spacing={1}>
                      {statusLower !== "dispatched" &&
                        order.orderStatus !== "OUT_FOR_DELIVERY" && (
                          <Button
                            size="xs"
                            colorScheme="green"
                            onClick={() => handleStatusUpdate(order._id)}
                            
                          >
                            Update
                          </Button>
                        )}

                      <Button size="xs" colorScheme="blue">
                        <Link to={`/order/${order._id}`}>Details</Link>
                      </Button>
                    </VStack>
                  </Grid>
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
