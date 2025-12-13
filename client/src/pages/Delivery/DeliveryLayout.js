import React, { useState } from "react";
import {
  Box,
  Grid,
  GridItem,
  Button,
  VStack,
  Collapse,
  IconButton,
  Text,
  Spinner,
  Flex,
} from "@chakra-ui/react";

import { useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import DeliveryNavbar from "./DeliveryNavbar";
import { FaClipboardList, FaListAlt } from "react-icons/fa";
import { MdPendingActions, MdLocalShipping, MdCancel } from "react-icons/md";
import { GiCardboardBox } from "react-icons/gi";
import { ImCross } from "react-icons/im";

const DeliveryLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");
  const orderStatusCounts = useSelector((state) => state.orderStatuses) || {};
  const { loading: loadingOrderStatuses, orderStatuses = {} } =
    orderStatusCounts;

  const orders = useSelector((state) => state.deliveryOrders.orders) || [];

  // Compute order counts dynamically
  const assignedCount = orders.filter(
    (order) => !order.isDelivered && !order.isReturned
  ).length;
  const pausedCount = orders.filter(
    (order) => order.status === "paused"
  ).length;
  const deliveredCount = orders.filter((order) => order.isDelivered).length;
  const returnedCount = orders.filter((order) => order.isReturned).length;
  const canceledCount = orders.filter(
    (order) => order.status === "canceled"
  ).length;
  const outForDeliveryCount = orders.filter(
    (order) => order.isAcceptedByDelivery && !order.isDelivered
  ).length;

  // Order Status Categories
  const orderStatusList = [
    {
      label: "Assigned",
      key: "asigned",
      icon: FaListAlt,
      color: "purple.500",
      count: assignedCount,
    },
    {
      label: "Paused",
      key: "paused",
      icon: MdPendingActions,
      color: "blue.500",
      count: pausedCount,
    },
    {
      label: "Delivered",
      key: "delivered",
      icon: FaClipboardList,
      color: "green.500",
      count: deliveredCount,
    },
    {
      label: "Returned",
      key: "returned",
      icon: GiCardboardBox,
      color: "orange.500",
      count: returnedCount,
    },
    {
      label: "Out for delivery",
      key: "outForDelivery",
      icon: MdLocalShipping,
      color: "green.500",
      count: outForDeliveryCount,
    },

    {
      label: "Canceled",
      key: "canceled",
      icon: MdCancel,
      color: "red.500",
      count: canceledCount,
    },
  ];

  return (
    <>
      <DeliveryNavbar />
      <Box display="flex">
        {/* Sidebar */}
        <Box
          bg="#000000"
          p={4}
          color="white"
          width={isSidebarOpen ? "280px" : "60px"}
          height="100vh"
          position="fixed"
          top="56px"
          transition="width 0.3s ease-in-out"
          overflow="hidden"
        >
          <VStack spacing={4} align="stretch" fontSize="md">
            {/* Toggle Sidebar Button */}
            <IconButton
              icon={
                isSidebarOpen ? (
                  <ArrowLeftIcon boxSize={6} color="white" />
                ) : (
                  <ArrowRightIcon boxSize={6} color="white" />
                )
              }
              bg="transparent"
              _hover={{ bg: "gray.700" }}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Toggle Sidebar"
            />

            {isSidebarOpen && (
              <>
                <Button
                  justifyContent="flex-start"
                  bg="transparent"
                  color="white"
                  onClick={() => setActiveTab("orders")}
                  as={RouterLink}
                  to="/deliveryhomepage"
                >
                  🏠 Home
                </Button>

                <VStack pl={4} align="stretch" spacing={2} fontSize="md">
                  {loadingOrderStatuses ? (
                    <Spinner size="lg" />
                  ) : (
                    orderStatusList.map((status) => (
                      <Button
                        key={status.label}
                        as={RouterLink}
                        to={`/deliveryorders/${status.key}`}
                        bg="transparent"
                        color="white"
                        justifyContent="flex-start"
                        variant="ghost"
                        fontSize="md"
                      >
                        <Flex alignItems="center">
                          <status.icon
                            style={{ marginRight: 8, color: status.color }}
                          />
                          {status.label}
                        </Flex>
                        <Box
                          ml="auto"
                          bg={status.color}
                          color="white"
                          fontSize="sm"
                          fontWeight="bold"
                          px={2}
                          py={1}
                          borderRadius="full" // Ensures a rounded background
                          minW="30px"
                          textAlign="center"
                        >
                          {status.count}
                        </Box>
                      </Button>
                    ))
                  )}{" "}
                </VStack>
                <Button
                  justifyContent="flex-start"
                  bg="transparent"
                  color="white"
                  onClick={() => setActiveTab("transactions")}
                  as={RouterLink}
                  to="/delivery/transactions"
                >
                  💰 Transactions
                </Button>

                <Button
                  justifyContent="flex-start"
                  bg="transparent"
                  color="white"
                  onClick={() => setActiveTab("profile")}
                  as={RouterLink}
                  to="/profile"
                >
                  🔧 Settings
                </Button>
              </>
            )}
          </VStack>
        </Box>

        {/* Right Side Content */}
        <Box
          ml={isSidebarOpen ? "250px" : "60px"}
          p={8}
          height="100vh"
          width="full"
          bg="white"
          overflowY="auto"
          transition="margin-left 0.3s ease-in-out"
        >
          <Grid templateColumns="repeat(1, 1fr)" gap={6}>
            <GridItem>{children}</GridItem>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default DeliveryLayout;
