import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendOrderStatusEmail } from "../actions/emailActions";
import { getOrderDetails, updateOrderStatus } from "../actions/orderActions";
import { useParams } from "react-router-dom";
import { Box, Button, Heading, Spinner, Alert } from "@chakra-ui/react";

const EmailStatus = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { loading, order, error } = orderDetails;

  const emailStatus = useSelector((state) => state.email);
  const {
    loading: emailLoading,
    success: emailSuccess,
    error: emailError,
  } = emailStatus;

  useEffect(() => {
    dispatch(getOrderDetails(id));
  }, [dispatch, id]);

  const handleStatusUpdate = (newStatus) => {
    if (order) {
      dispatch(updateOrderStatus(id, newStatus));
      dispatch(sendOrderStatusEmail(order.customerEmail, newStatus, id));
    }
  };

  return (
    <Box p={8}>
      <Heading as="h2" size="lg" mb={4}>
        Order Details
      </Heading>
      {loading ? (
        <Spinner size="xl" />
      ) : error ? (
        <Alert status="error">{error}</Alert>
      ) : (
        <>
          <p>
            <strong>Customer:</strong> {order.customerName}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
          <Box mt={4}>
            <Button
              onClick={() => handleStatusUpdate("Ordered")}
              colorScheme="blue"
              mr={2}
            >
              Set as Ordered
            </Button>
            <Button
              onClick={() => handleStatusUpdate("Shipped")}
              colorScheme="yellow"
              mr={2}
            >
              Set as Shipped
            </Button>
            <Button
              onClick={() => handleStatusUpdate("Delivered")}
              colorScheme="green"
              mr={2}
            >
              Set as Delivered
            </Button>
            <Button
              onClick={() => handleStatusUpdate("Completed")}
              colorScheme="purple"
              mr={2}
            >
              Set as Completed
            </Button>
            <Button
              onClick={() => handleStatusUpdate("Returned")}
              colorScheme="red"
            >
              Set as Returned
            </Button>
          </Box>
          {emailLoading && <p>Sending email...</p>}
          {emailSuccess && (
            <Alert status="success">Email sent successfully!</Alert>
          )}
          {emailError && <Alert status="error">Error: {emailError}</Alert>}
        </>
      )}
    </Box>
  );
};

export default EmailStatus;
