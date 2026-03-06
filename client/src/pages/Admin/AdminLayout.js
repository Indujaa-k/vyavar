import React, { useState, useEffect } from "react";
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
import { AiOutlineCheckCircle } from "react-icons/ai";

import { Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@chakra-ui/icons";
import { MdPendingActions, MdLocalShipping, MdCancel } from "react-icons/md";
import { AiOutlineDeliveredProcedure, AiOutlineRollback } from "react-icons/ai";
import { FaClipboardList, FaUsers, FaBoxOpen, FaListAlt } from "react-icons/fa";
import AdminNavbar from "./AdminNavbar";
import { getOrderStatusCounts } from "../../actions/orderActions";
import { GiCardboardBox } from "react-icons/gi";
import { ImCross } from "react-icons/im";

const AdminLayout = ({ children }) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("users");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isBannersOpen, setIsBannersOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);

  useEffect(() => {
    dispatch(getOrderStatusCounts());
  }, [dispatch]);
  const orderStatusCounts = useSelector((state) => state.orderStatuses) || {};
  const { loading: loadingOrderStatuses, orderStatuses = {} } =
    orderStatusCounts;

  // Order Status Categories
  const orderStatusList = [
    {
      label: "All Orders",
      key: "allorders",
      icon: FaListAlt,
      color: "purple.500",
    },

    {
      label: "Confirmed",
      key: "confirmed",
      icon: FaClipboardList,
      color: "green.500",
    },

    {
      label: "Packed",
      key: "packed",
      icon: GiCardboardBox,
      color: "orange.500",
    },

    {
      label: "Out For Delivery",
      key: "out-for-delivery",
      icon: MdLocalShipping,
      color: "green.500",
    },

    {
      label: "Delivered",
      key: "delivered",
      icon: AiOutlineDeliveredProcedure,
      color: "blue.500",
    },

    {
      label: "Return Approved",
      key: "return-approved",
      icon: AiOutlineRollback,
      color: "purple.500",
    },

    {
      label: "Return Completed",
      key: "return-completed",
      icon: AiOutlineCheckCircle,
      color: "teal.500",
    },
  ];
  console.log(orderStatuses);

  return (
    <>
      {/* Admin Navbar */}
      <AdminNavbar setIsSidebarOpen={setIsSidebarOpen} />

      <Box display="flex">
        {/* Sidebar */}
        <Box
          bg="#DBA751"
          p={4}
          color="white"
          width={isSidebarOpen ? "280px" : "60px"}
          height="calc(100vh - 56px)" // Adjust height to account for navbar
          position="fixed"
          top="71px"
          transition="width 0.3s ease-in-out"
          overflowX="hidden"
          overflowY="auto"
          zIndex={1000}
          sx={{
            // Hide scrollbar for WebKit (Chrome, Safari)
            "&::-webkit-scrollbar": {
              display: "none",
            },
            // Hide scrollbar for Firefox
            scrollbarWidth: "none",
            // Hide scrollbar for IE/Edge
            msOverflowStyle: "none",
          }}
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
              _hover={{ bg: "rgba(0,0,0,0.15)" }}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Toggle Sidebar"
            />

            {isSidebarOpen && (
              <>
                <Button
                  onClick={() => setActiveTab("home")}
                  as={RouterLink}
                  to="/adminDashboard"
                  bg="transparent"
                  justifyContent="flex-start"
                  color="white"
                  variant="ghost"
                  fontSize="md"
                >
                  🏠 Home
                </Button>
                <Button
                  onClick={() => setActiveTab("users")}
                  as={RouterLink}
                  to="/admin/userlist"
                  bg="transparent"
                  color="white"
                  justifyContent="flex-start"
                  colorScheme={activeTab === "users" ? "teal" : "gray"}
                  variant="ghost"
                  fontSize="md"
                >
                  🧑‍💼 Users
                </Button>
                <Button
                  onClick={() => setActiveTab("subscription")}
                  as={RouterLink}
                  to="/admin/subscription"
                  bg="transparent"
                  color="white"
                  justifyContent="flex-start"
                  variant="ghost"
                  fontSize="md"
                >
                  💳 Subscriptions
                </Button>

                <Button
                  as={RouterLink}
                  to="/admin/coupon"
                  variant="ghost"
                  color="white"
                  justifyContent="flex-start"
                  _hover={{ bg: "rgba(0,0,0,0.15)" }}
                  fontSize="md"
                >
                  🎟️ Coupon Code
                </Button>

                {/* Orders Dropdown */}

                <Button
                  onClick={() => setIsOrdersOpen(!isOrdersOpen)}
                  bg="transparent"
                  color="white"
                  justifyContent="space-between"
                  rightIcon={
                    isOrdersOpen ? <ChevronUpIcon /> : <ChevronDownIcon />
                  }
                  variant="ghost"
                  fontSize="md"
                >
                  📦Orders
                </Button>
                <Collapse in={isOrdersOpen} animateOpacity>
                  <VStack pl={4} align="stretch" spacing={2} fontSize="md">
                    <Button
                      as={RouterLink}
                      to="/admin/orderlist"
                      bg="transparent"
                      color="white"
                      justifyContent="flex-start"
                      variant="ghost"
                      leftIcon="•"
                      fontSize="md"
                    >
                      Order Status
                    </Button>
                    {/* <Button
                      as={RouterLink}
                      to="/admin/assignorders"
                      bg="transparent"
                      color="white"
                      justifyContent="flex-start"
                      variant="ghost"
                      leftIcon="•"
                      fontSize="md"
                    >
                      Assign Orders
                    </Button> */}
                    {loadingOrderStatuses ? (
                      <Spinner size="lg" />
                    ) : (
                      orderStatusList.map((status) => (
                        <Button
                          key={status.label}
                          as={RouterLink}
                          to={`/orders/${status.key}`}
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
                            {orderStatuses[
                              {
                                allorders: "allOrders",
                                confirmed: "confirmed",
                                packed: "packed",
                                "out-for-delivery": "outForDelivery",
                                delivered: "delivered",
                                "return-approved": "returnApproved",
                                "return-completed": "returnCompleted",
                              }[status.key]
                            ] || 0}
                          </Box>
                        </Button>
                      ))
                    )}
                  </VStack>
                </Collapse>
                {/* Products Dropdown */}
                <Button
                  onClick={() => setIsProductsOpen(!isProductsOpen)}
                  bg="transparent"
                  color="white"
                  justifyContent="space-between"
                  rightIcon={
                    isProductsOpen ? <ChevronUpIcon /> : <ChevronDownIcon />
                  }
                  variant="ghost"
                >
                  🏷️ Products
                </Button>
                <Collapse in={isProductsOpen} animateOpacity>
                  <VStack pl={4} align="stretch" spacing={2} fontSize="md">
                    <Button
                      as={RouterLink}
                      to="/admin/productlist"
                      variant="ghost"
                      color="white"
                      justifyContent="flex-start"
                      _hover={{ bg: "rgba(0,0,0,0.15)" }}
                      leftIcon="•"
                      fontSize="md"
                    >
                      Product List
                    </Button>

                    <Button
                      as={RouterLink}
                      to="/admin/product/create"
                      variant="ghost"
                      color="white"
                      justifyContent="flex-start"
                      _hover={{ bg: "rgba(0,0,0,0.15)" }}
                      leftIcon="•"
                      fontSize="md"
                    >
                      Create Product
                    </Button>

                    <Button
                      as={RouterLink}
                      to="/admin/bulkupload"
                      variant="ghost"
                      color="white"
                      justifyContent="flex-start"
                      _hover={{ bg: "rgba(0,0,0,0.15)" }}
                      leftIcon="•"
                      fontSize="md"
                    >
                      Bulk Upload
                    </Button>
                    <Button
                      as={RouterLink}
                      to="/productsoverview"
                      variant="ghost"
                      color="white"
                      justifyContent="flex-start"
                      _hover={{ bg: "rgba(0,0,0,0.15)" }}
                      leftIcon="•"
                      fontSize="md"
                    >
                      Product Overview
                    </Button>
                  </VStack>
                </Collapse>
                {/* Delivery Dropdown */}
                {/* <Button
                  onClick={() => setIsDeliveryOpen(!isDeliveryOpen)}
                  bg="transparent"
                  color="white"
                  justifyContent="space-between"
                  rightIcon={
                    isDeliveryOpen ? <ChevronUpIcon /> : <ChevronDownIcon />
                  }
                  variant="ghost"
                >
                  🛵 Delivery
                </Button> */}
                {/* <Collapse in={isDeliveryOpen} animateOpacity>
                  <VStack pl={4} align="stretch" spacing={2} fontSize="md">
                    <Button
                      onClick={() => setActiveTab("deliverydetails")}
                      as={RouterLink}
                      to="/deliverydetails"
                      bg="transparent"
                      color="white"
                      justifyContent="flex-start"
                      variant="ghost"
                      fontSize="md"
                    >
                      📦Delivery Details
                    </Button> */}
                {/* <Button
                      onClick={() => setActiveTab("deliverytransactions")}
                      as={RouterLink}
                      to="/admin/delivery/transactions"
                      bg="transparent"
                      color="white"
                      justifyContent="flex-start"
                      variant="ghost"
                      fontSize="md"
                    >
                      📊 Delivery Transactions
                    </Button> */}
                {/* </VStack>
                </Collapse> */}

                <Button
                  onClick={() => setActiveTab("incomestats")}
                  as={RouterLink}
                  to="/admin/incomebycity"
                  bg="transparent"
                  color="white"
                  justifyContent="flex-start"
                  variant="ghost"
                  fontSize="md"
                >
                  📈 Statistics
                </Button>

                {/* Banners Dropdown */}
                <Button
                  onClick={() => setIsBannersOpen(!isBannersOpen)}
                  bg="transparent"
                  color="white"
                  justifyContent="space-between"
                  rightIcon={
                    isBannersOpen ? <ChevronUpIcon /> : <ChevronDownIcon />
                  }
                  variant="ghost"
                >
                  📊 Banners
                </Button>
                <Collapse in={isBannersOpen} animateOpacity>
                  <VStack pl={4} align="stretch" spacing={2} fontSize="md">
                    <Button
                      as={RouterLink}
                      to="/adminbanner"
                      variant="ghost"
                      color="white"
                      justifyContent="flex-start"
                      _hover={{ bg: "rgba(0,0,0,0.15)" }}
                      leftIcon="•"
                      fontSize="md"
                    >
                      Image Banner
                    </Button>
                    <Button
                      as={RouterLink}
                      to="/adminvideobanner"
                      variant="ghost"
                      color="white"
                      justifyContent="flex-start"
                      _hover={{ bg: "rgba(0,0,0,0.15)" }}
                      leftIcon="•"
                      fontSize="md"
                    >
                      Video Banner
                    </Button>
                    <Button
                      as={RouterLink}
                      to="/admin/offerbanner"
                      variant="ghost"
                      color="white"
                      justifyContent="flex-start"
                      _hover={{ bg: "rgba(0,0,0,0.15)" }}
                      leftIcon="•"
                      fontSize="md"
                    >
                      Top PromoText
                    </Button>
                  </VStack>
                </Collapse>

                <Button
                  onClick={() => setActiveTab("review")}
                  as={RouterLink}
                  to="/adminreview"
                  bg="transparent"
                  justifyContent="flex-start"
                  color="white"
                  variant="ghost"
                  fontSize="md"
                >
                  🌟 Reviews
                </Button>
                <Button
                  onClick={() => setActiveTab("transactions")}
                  as={RouterLink}
                  to="/transactions"
                  bg="transparent"
                  justifyContent="flex-start"
                  color="white"
                  variant="ghost"
                  fontSize="md"
                >
                  💸 Transactions
                </Button>
                <Button
                  onClick={() => setActiveTab("Billing")}
                  as={RouterLink}
                  to="/billinginvoice"
                  bg="transparent"
                  justifyContent="flex-start"
                  color="white"
                  variant="ghost"
                  fontSize="md"
                >
                  🧾 Billing
                </Button>
                <Button
                  onClick={() => setActiveTab("ShippingCost")}
                  as={RouterLink}
                  to="/admin/shippingcost"
                  bg="transparent"
                  justifyContent="flex-start"
                  color="white"
                  variant="ghost"
                  fontSize="md"
                >
                  🚚 Shipping Cost
                </Button>
                {/* <Button
                  onClick={() => setActiveTab("settings")}
                  as={RouterLink}
                  to="/profile"
                  bg="transparent"
                  color="white"
                  justifyContent="flex-start"
                  variant="ghost"
                  fontSize="md"
                >
                  🔧 Settings
                </Button> */}
              </>
            )}
          </VStack>
        </Box>

        {/* Right Side Content */}
        <Box
          ml={isSidebarOpen ? "280px" : "60px"}
          p={6}
          height="100vh"
          width="full"
          bg={"white"}
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

export default AdminLayout;
