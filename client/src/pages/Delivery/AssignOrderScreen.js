import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Spinner,
  useToast,
  VStack,
  Image,
  Text,
  HStack,
  Avatar,
  Card,
  CardBody,
  Flex,
  Heading,
  Badge,
  Img,
} from "@chakra-ui/react";
import { ListUsers } from "../../actions/userActions";
import { assignOrder, listUndeliveredOrders } from "../../actions/orderActions";
import { Link } from "react-router-dom";

const AssignOrderScreen = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  const orderList = useSelector((state) => state.undeliveredOrderList);
  const { loading: loadingOrders, error: errorOrders, orders = [] } = orderList;

  const userList = useSelector((state) => state.userList);
  const { loading: loadingUsers, error: errorUsers, users = [] } = userList;

  const orderAssign = useSelector((state) => state.orderAssign);
  const {
    loading: loadingAssign,
    success: successAssign,
    error: errorAssign,
  } = orderAssign;

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedDeliveryPerson, setSelectedDeliveryPerson] = useState(null);

  useEffect(() => {
    dispatch(listUndeliveredOrders());
    dispatch(ListUsers());
  }, [dispatch]);

  useEffect(() => {
    if (successAssign) {
      toast({
        title: "Order assigned successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      dispatch(listUndeliveredOrders());
    }
    if (errorAssign) {
      toast({
        title: "Error assigning order.",
        description: errorAssign,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  }, [successAssign, errorAssign, toast]);

  const handleAssignOrder = () => {
    if (selectedOrder && selectedDeliveryPerson) {
      dispatch(assignOrder(selectedOrder._id, selectedDeliveryPerson._id));
    }
  };

  return (
    <Box p={8} maxW="1200px" mx="auto" mt={8}>
      <Heading
        bg={"pink.200"}
        colorScheme="pink"
        fontSize="lg"
        p={2}
        color="purple"
        textAlign="center"
        mb={8}
      >
        Assign Orders 🚚
      </Heading>

      {(loadingOrders || loadingUsers) && (
        <Flex justify="center" mb={8}>
          <Spinner size="xl" color="teal.500" />
        </Flex>
      )}

      {!(loadingOrders || loadingUsers) && (
        <VStack spacing={8} align="stretch">
          {/* Box for Selecting an Order */}
          <Box
            borderWidth="1px"
            borderRadius="lg"
            p={6}
            bg="white"
            boxShadow="md"
          >
            <Badge colorScheme="pink" fontSize="md" p={2} mb="2">
              Select Order
            </Badge>
            <HStack spacing={4} pb={4}>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <Card
                    key={order._id}
                    borderWidth={
                      selectedOrder?._id === order._id ? "2px" : "1px"
                    }
                    borderColor={
                      selectedOrder?._id === order._id ? "teal.500" : "gray.200"
                    }
                    cursor="pointer"
                    onClick={() => setSelectedOrder(order)}
                    _hover={{ shadow: "lg" }}
                    minW="300px"
                  >
                    <CardBody>
                      <Avatar
                        src={
                          order.user?.profilePicture ||
                          "https://via.placeholder.com/100"
                        }
                        name={order.user?.name}
                        size="sm"
                        mb={2}
                      />
                      <Text fontSize="md">
                        {order.user?.name || "Unknown User"}
                      </Text>
                      <Image
                        src={
                          order?.orderItems?.length > 0 &&
                          order.orderItems[0]?.product?.images?.length > 0
                            ? order.orderItems[0].product.images[0]
                            : "https://via.placeholder.com/100"
                        }
                        alt="Order"
                        boxSize="100px"
                        borderRadius={20}
                        objectFit="cover"
                        mx="auto"
                      />
                      <Text
                        fontSize="md"
                        fontWeight="bold"
                        mt={2}
                        textAlign="center"
                      >
                        {order._id}
                      </Text>
                      <Text fontSize="sm" textAlign="center">
                        Total: Rs.{order.totalPrice}
                      </Text>

                      <Button
                        colorScheme="blue"
                        textAlign="center"
                        display="block"
                        w="full"
                        fontSize="sm"
                      >
                        <Link to={`/order/${order._id}`}>View Order</Link>
                      </Button>
                    </CardBody>
                  </Card>
                ))
              ) : (
                <Text>No orders available</Text>
              )}
            </HStack>
          </Box>

          {/* Box for Selecting a Delivery Person */}
          <Box
            borderWidth="1px"
            borderRadius="lg"
            p={6}
            bg="white"
            boxShadow="md"
          >
            <Badge colorScheme="pink" fontSize="md" p={2} mb="2">
              Select Person
            </Badge>
            <HStack overflowX="auto" spacing={4} pb={4}>
              {users.length > 0 ? (
                users
                  .filter((user) => user.isDelivery)
                  .map((user) => {
                    // Count completed orders assigned to this user
                    const completedOrdersCount = orders.filter(
                      (order) => order.deliveredBy === user._id
                    ).length;

                    return (
                      <Card
                        key={user._id}
                        p={4}
                        borderWidth={
                          selectedDeliveryPerson?._id === user._id
                            ? "2px"
                            : "1px"
                        }
                        borderColor={
                          selectedDeliveryPerson?._id === user._id
                            ? "teal.500"
                            : "gray.200"
                        }
                        cursor="pointer"
                        onClick={() => setSelectedDeliveryPerson(user)}
                        _hover={{ shadow: "lg" }}
                        minW="200px"
                      >
                        <CardBody>
                          <Flex direction="column" align="center">
                            <Avatar
                              src={
                                user.photo || "https://via.placeholder.com/100"
                              }
                              name={user.name}
                              size="lg"
                              mb={2}
                            />
                            <Text fontSize="md" fontWeight="bold">
                              {user.name}
                            </Text>
                            {/* Show completed orders count */}
                            <Badge colorScheme="green" fontSize="sm" mt={2}>
                              Completed Orders: {completedOrdersCount}
                            </Badge>
                          </Flex>
                        </CardBody>
                      </Card>
                    );
                  })
              ) : (
                <Text>No delivery personnel available</Text>
              )}
            </HStack>
          </Box>

          {/* Assign Order Button */}
          <Flex justify="center" mt={8}>
            <Button
              colorScheme="green"
              size="md"
              onClick={handleAssignOrder}
              isLoading={loadingAssign}
              isDisabled={!selectedOrder || !selectedDeliveryPerson}
            >
              Assign Order
            </Button>
          </Flex>
        </VStack>
      )}
    </Box>
  );
};

export default AssignOrderScreen;
