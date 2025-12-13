import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Select,
  Button,
  VStack,
  Spinner,
  Text,
  Card,
  CardBody,
  Divider,
} from "@chakra-ui/react";
import { updateOrderStatus, getOrderDetails } from "../../actions/orderActions";

const OrderStatusScreen = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [status, setStatus] = useState("");

  const orderDetails = useSelector((state) => state.orderDetails);
  const { loading, error, order } = orderDetails;
  const { success } = useSelector((state) => state.orderStatusUpdate);

  useEffect(() => {
    if (!order || order._id !== orderId) {
      dispatch(getOrderDetails(orderId));
    } else {
      setStatus(
        order.isReturned
          ? "Returned"
          : order.isDelivered
          ? "Delivered"
          : order.isAcceptedByDelivery
          ? "Shipped"
          : order.isPacked
          ? "Packed"
          : "Ordered"
      );
    }
  }, [dispatch, orderId, order]);

  const handleStatusUpdate = () => {
    dispatch(updateOrderStatus(orderId, status));
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      boxShadow="xl"
      borderRadius="lg"
      p={6}
      bg="white"
    >
      <Card width="500px" boxShadow="xl" borderRadius="lg" p={6} bg="white">
        <CardBody>
          <Heading fontSize="lg" fontWeight={600} textAlign="center" mb={4}>
            Order Status
          </Heading>
          <Divider mb={4} />

          {loading ? (
            <Spinner size="xl" display="block" mx="auto" />
          ) : error ? (
            <Text color="red.500">{error}</Text>
          ) : (
            <VStack spacing={4} align="stretch">
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                size="lg"
                borderColor="gray.400"
                _hover={{ borderColor: "gray.600" }}
              >
                <option value="Ordered">Ordered</option>
                <option value="Packed">Packed</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Returned">Returned</option>
              </Select>
              <Button
                colorScheme="green"
                onClick={handleStatusUpdate}
                size="lg"
                _hover={{ bg: "pink.600" }}
              >
                Update Status
              </Button>
              <Button
                colorScheme="gray"
                onClick={() => navigate("/orders")}
                size="lg"
                _hover={{ bg: "gray.500", color: "white" }}
              >
                Back to Orders
              </Button>
            </VStack>
          )}
        </CardBody>
      </Card>
    </Box>
  );
};

export default OrderStatusScreen;
