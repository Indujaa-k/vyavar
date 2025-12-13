import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  listOrdersForDelivery,
  acceptOrder,
  rejectOrder,
  completeOrder,
  returnOrder,
} from "../../actions/orderActions";
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
} from "@chakra-ui/react";

const DeliveryOrdersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { loading, error, orders } = useSelector(
    (state) => state.deliveryOrders
  );
  const { userInfo } = useSelector((state) => state.userLogin);

  useEffect(() => {
    if (!userInfo || !userInfo.isDelivery) {
      navigate("/login");
    } else {
      dispatch(listOrdersForDelivery());
    }
  }, [dispatch, userInfo, navigate]);

  const handleViewOnMap = (address) => {
    const query = `${address.street}, ${address.city}, ${address.state}, ${address.country}, ${address.pin}`;
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      query
    )}`;
    window.open(mapUrl, "_blank");
  };

  const handleAction = (id, actionType, reason = "") => {
    switch (actionType) {
      case "accept":
        dispatch(acceptOrder(id)).then(() => dispatch(listOrdersForDelivery()));
        toast({ title: "Order Accepted", status: "success", duration: 3000 });
        break;
      case "reject":
        dispatch(rejectOrder(id)).then(() => dispatch(listOrdersForDelivery()));
        toast({ title: "Order Rejected", status: "warning", duration: 3000 });
        break;
      case "complete":
        dispatch(completeOrder(id)).then(() =>
          dispatch(listOrdersForDelivery())
        );
        toast({ title: "Order Completed", status: "success", duration: 3000 });
        break;
      case "return":
        dispatch(returnOrder(id, reason)).then(() =>
          dispatch(listOrdersForDelivery())
        );
        toast({ title: "Order Returned", status: "warning", duration: 3000 });
        break;
      default:
        break;
    }
  };

  const renderOrders = (filterFn) => (
    <Table variant="striped" bg="yellow.300">
      <Thead>
        <Tr>
          <Th>ID</Th>
          <Th>Customer</Th>
          <Th>Total</Th>
          <Th>Delivery Address</Th>
          <Th>Payment Method</Th>
          <Th>Status</Th>
          <Th>Actions</Th>
          <Th>Map</Th>
        </Tr>
      </Thead>
      <Tbody>
        {orders.filter(filterFn).map((order) => (
          <Tr key={order._id}>
            <Td>{order._id}</Td>
            <Td>{order.user.name}</Td>
            <Td>${order.totalPrice}</Td>
            <Td>
              {order.shippingAddress.doorNo}, {order.shippingAddress.street},{" "}
              {order.shippingAddress.city}, {order.shippingAddress.state}-
              {order.shippingAddress.pin}, {order.shippingAddress.country},{" "}
              {order.shippingAddress.phoneNumber}
            </Td>
            <Td>{order.paymentMethod}</Td>
            <Td>
              {order.isReturned
                ? "Returned"
                : order.isDelivered
                ? "Completed"
                : order.isAcceptedByDelivery
                ? "Accepted"
                : "Pending"}
            </Td>
            <Td>
              {!order.isAcceptedByDelivery && (
                <Box display="flex" gap={2}>
                  <Button
                    size="sm"
                    bg="green.300"
                    onClick={() => handleAction(order._id, "accept")}
                  >
                    Accept
                  </Button>
                  <Button
                    size="sm"
                    bg="red.300"
                    ml={2}
                    onClick={() => handleAction(order._id, "reject")}
                  >
                    Reject
                  </Button>
                </Box>
              )}
              {order.isAcceptedByDelivery && !order.isDelivered && (
                <Button
                  size="sm"
                  bg={"blue.300"}
                  onClick={() => handleAction(order._id, "complete")}
                >
                  Complete
                </Button>
              )}
              {order.isDelivered && (
                <Button
                  size="sm"
                  bg="red.300"
                  onClick={() =>
                    handleAction(
                      order._id,
                      "return",
                      prompt("Enter return reason")
                    )
                  }
                >
                  Return
                </Button>
              )}
            </Td>
            <Td>
              <Button
                colorScheme="green"
                size="sm"
                onClick={() => handleViewOnMap(order.shippingAddress)}
              >
                View on Map
              </Button>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );

  return (
    <Box p={4} bg="white" height="100vh" m={30}>
      {loading && (
        <Spinner size="xl" color="blue.500" display="block" mx="auto" />
      )}

      {error && (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Error:</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {!loading && !error && (
        <Tabs>
          <TabList>
            <Tab>Pending</Tab>
            <Tab>Accepted</Tab>
            <Tab>Completed</Tab>
            <Tab>Returned</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {renderOrders((order) => !order.isAcceptedByDelivery)}
            </TabPanel>
            <TabPanel>
              {renderOrders(
                (order) => order.isAcceptedByDelivery && !order.isDelivered
              )}
            </TabPanel>
            <TabPanel>{renderOrders((order) => order.isDelivered)}</TabPanel>
            <TabPanel>{renderOrders((order) => order.isReturned)}</TabPanel>
          </TabPanels>
        </Tabs>
      )}
    </Box>
  );
};

export default DeliveryOrdersPage;
