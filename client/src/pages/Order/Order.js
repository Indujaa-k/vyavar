import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from "react-redux";
import { IoMdDoneAll } from "react-icons/io";
import { getInvoice } from "../../actions/orderActions";

import {
  getOrderDetails,
  payOrder,
  deliverOrder,
} from "../../actions/orderActions";
import "./Order.css";
import {
  ORDER_PAY_RESET,
  ORDER_DELIVER_RESET,
} from "../../constants/orderConstants";
import { Button } from "@chakra-ui/button";
import OrderTracking from "../Tracking/OrderTracking";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Text,
  VStack,
  HStack,
  Alert,
  Divider,
  Stack,
  Badge,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react";
const Order = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;
  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const invoiceDetails = useSelector((state) => state.invoiceDetails);
  const {
    loading: invoiceLoading,
    error: invoiceError,
    invoice,
  } = invoiceDetails;

  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };
  if (!loading) {
    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
  }
  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }

    if (!order || successDeliver || order._id !== orderId) {
      dispatch({
        type: ORDER_DELIVER_RESET,
      });
      dispatch(getOrderDetails(orderId));
      dispatch(getInvoice(orderId));
    }
  }, [dispatch, orderId, navigate, order, successDeliver, userInfo]);

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };
  console.log("Invoice Details in orderpage:", invoiceDetails);
  return (
    <Box mx="auto" px={40} py={10} bg="white">
      <Helmet>
        <title>Order Details</title>
      </Helmet>

      {loading || loadingDeliver ? (
        <VStack justify="center" minH="80vh">
          <Spinner size="xl" />
        </VStack>
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : (
        <Box maxW="container.md" mx="auto" p={4}>
          <Stack
            direction={{ base: "column", md: "row" }}
            spacing={6}
            justify="center"
          >
            {/* Left Side - Order Info */}
            <VStack
              flex="2"
              bg="white"
              p={6}
              borderRadius="md"
              boxShadow="lg"
              align="stretch"
            >
              <Text fontSize="lg" fontWeight="bold" color="black">
                Order ID:{" "}
                <Text as="span" color="blueviolet">
                  {order._id}
                </Text>
              </Text>
              <Alert
                status="success"
                variant="subtle"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                borderRadius="md"
                mt={4}
              >
                <AlertIcon boxSize="40px" mr={0} />
                <AlertTitle mt={4} mb={1} fontSize="lg">
                  🎉 Thank You for Your Order! 🎉
                </AlertTitle>
                <AlertDescription maxW="sm">
                  Your order is being processed and will be delivered soon.
                </AlertDescription>
              </Alert>
              <Text fontSize="lg" fontWeight="bold">
                Shipping Information
              </Text>
              <Divider />
              <Text>
                <strong>Name:</strong> {order.user.name}
              </Text>
              <Text>
                <strong>Address:</strong> {order.shippingAddress.doorNo},{" "}
                {order.shippingAddress.street},
                {order.shippingAddress.nearestLandmark},{" "}
                {order.shippingAddress.city}, {order.shippingAddress.state} -{" "}
                {order.shippingAddress.pin}, {order.shippingAddress.country}
                {order.shippingAddress.phoneNumber}
              </Text>
              <Text>
                {order.isDelivered ? (
                  <Badge colorScheme="green">
                    Delivered at {order.deliveredAt}
                  </Badge>
                ) : (
                  <Badge colorScheme="red">Not Delivered</Badge>
                )}
              </Text>

              <Text fontSize="lg" fontWeight="bold" mt={4}>
                Payment Method
              </Text>
              <Divider />
              <Text>
                <strong>Method:</strong> {order.paymentMethod}
              </Text>
              <Text>
                {order.isPaid ? (
                  <Badge colorScheme="green">Paid at {order.paidAt}</Badge>
                ) : (
                  <Badge colorScheme="red">Not Paid</Badge>
                )}
              </Text>

              <Text fontSize="lg" fontWeight="bold" mt={4}>
                Order Items
              </Text>
              {order.orderItems.map((item) => (
                <HStack
                  key={item.product}
                  justify="space-between"
                  w="full"
                  mb={4}
                >
                  {/* Left side: Image and Name */}
                  <HStack spacing={2}>
                    {/* Product Image */}
                    {/* <Link to={`/product/${item.product._id}`}> */}
                    <Link to={`/product/${item.product?._id || item.product}`}>
                      <img
                        src={item.product.images?.[0] || "/placeholder.jpg"}
                        alt={item.name}
                        style={{
                          width: "80px",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                      />
                    </Link>

                    {/* Product Name */}
                    <Text fontWeight="bold" textAlign="center">
                      <Link
                        to={`/product/${item.product._id}`}
                        style={{
                          color: "deeppink",
                          textDecoration: "underline",
                        }}
                      >
                        {item.name}
                      </Link>
                    </Text>
                  </HStack>
                  <Text>
                    {item.qty} x Rs. {item.price} = Rs. {item.qty * item.price}
                  </Text>
                </HStack>
              ))}

              {/* invoice */}
              <Text fontSize="lg" fontWeight="bold">
                Invoice
              </Text>

              <Button
                bg="pink"
                color="brown"
                size="sm"
                mr="auto"
                fontWeight="600"
                p={2}
                onClick={() => navigate(`/admin/order/${orderId}/invoice`)}
              >
                View Invoice
              </Button>

              <Text fontSize="lg" fontWeight="bold">
                Order Summary
              </Text>
              <Divider />

              <HStack justify="space-between" w="full">
                <Text>Items:</Text>
                <Text color={"grey"}>Rs. {order.itemsPrice}</Text>
              </HStack>
              <HStack justify="space-between" w="full">
                <Text>Shipping:</Text>
                <Text color={"grey"}>Rs. {order.shippingPrice}</Text>
              </HStack>
              <HStack justify="space-between" w="full">
                <Text>Tax:</Text>
                <Text color={"grey"}>Rs. {order.taxPrice}</Text>
              </HStack>
              <HStack justify="space-between" w="full">
                <Text fontSize="xl" fontWeight="bold">
                  Total:
                </Text>
                <Text fontSize="xl" fontWeight="bold">
                  Rs. {order.totalPrice}
                </Text>
              </HStack>
              <OrderTracking order={order} />
            </VStack>
            {userInfo?.isAdmin && order.isPaid && !order.isDelivered && (
              <Button
                colorScheme="blue"
                onClick={deliverHandler}
                leftIcon={<IoMdDoneAll size="16" />}
              >
                Mark as Delivered
              </Button>
            )}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default Order;
