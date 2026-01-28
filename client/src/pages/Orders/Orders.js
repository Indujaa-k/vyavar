import React, { useEffect } from "react";
import {
  Box,
  Heading,
  Grid,
  GridItem,
  Select,
  Spinner,
  Image,
  Alert,
  Button,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  VStack,
  Badge,
  HStack,
  Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { useDispatch, useSelector } from "react-redux";
import {
  getSalesData,
  getRevenueData,
  getDashboardOrders,
  getTotalOrders,
} from "../../actions/dashboardActions";
import { FaBox, FaDollarSign, FaChartLine } from "react-icons/fa";

const Orders = () => {
  const dispatch = useDispatch();

  // Redux states
  const salesDataState = useSelector((state) => state.sales);
  const { loading: loadingSales, sales, error: errorSales } = salesDataState;
  const API_URL = process.env.REACT_APP_API_URL;
  const revenueDataState = useSelector((state) => state.revenue);
  const {
    loading: loadingRevenue,
    revenue,
    error: errorRevenue,
  } = revenueDataState;
  const totalOrdersState = useSelector((state) => state.totalOrders);
  const {
    loading: loadingTotalOrders,
    totalOrders,
    error: errortotalOrders,
  } = totalOrdersState;
  const ordersDataState = useSelector((state) => state.orders);
  const {
    loading: loadingOrders,
    orders,
    error: errorOrders,
  } = ordersDataState;

  const [filter, setFilter] = React.useState("Day"); // Default filter

  // Calculate totals
  const totalOrdersCount = totalOrders || 0;
  const totalSales = sales?.reduce((acc, item) => acc + item.value, 0) || 0;
  const totalRevenue = revenue?.reduce((acc, item) => acc + item.value, 0) || 0;

  // Fetch dashboard data
  useEffect(() => {
    dispatch(getSalesData(filter));
    dispatch(getRevenueData(filter));
    dispatch(getTotalOrders(filter));
    dispatch(getDashboardOrders());
  }, [dispatch, filter]);

  // Format chart data
  const formatChartData = (data) =>
    data?.map((item) => ({
      name: item.label,
      value: item.value,
    }));
  console.log("orders", orders);
  // Function to determine the status of the order

  return (
    <Box p={14}>
      {/* Key Metrics */}
      <Grid templateColumns="repeat(3, 1fr)" gap={6} mb={10}>
        <GridItem>
          <Stat p={5} bg="blue.50" borderRadius="md" shadow="sm">
            <StatLabel textAlign={"center"}> 📦 Total Orders</StatLabel>
            <StatNumber textAlign={"center"}> {totalOrdersCount}</StatNumber>
            <StatHelpText textAlign={"center"}>Across all time</StatHelpText>
          </Stat>
        </GridItem>
        <GridItem>
          <Stat p={5} bg="blue.50" borderRadius="md" shadow="sm">
            <StatLabel textAlign={"center"}> 📊 Total Sales</StatLabel>
            <StatNumber textAlign={"center"}>{totalSales} Nos</StatNumber>
            <StatHelpText textAlign={"center"}>Across all time</StatHelpText>
          </Stat>
        </GridItem>
        <GridItem>
          <Stat p={5} bg="blue.50" borderRadius="md" shadow="sm">
            <StatLabel textAlign={"center"}> 💰 Total Revenue</StatLabel>
            <StatNumber textAlign={"center"}>
              Rs. {totalRevenue.toFixed(2)}
            </StatNumber>
            <StatHelpText textAlign={"center"}>Across all time</StatHelpText>
          </Stat>
        </GridItem>
      </Grid>

      {/* Filter Dropdown */}
      <Box mb={8}>
        <Select
          placeholder="UptoDate"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          mb={5}
          maxW="300px"
        >
          <option value="Day">Day</option>
          <option value="Week">Week</option>
          <option value="Month">Month</option>
          <option value="Year">Year</option>
        </Select>
      </Box>

      {/* Charts and Tables */}
      {loadingSales || loadingRevenue || loadingOrders || loadingTotalOrders ? (
        <Box textAlign="center" mt={10}>
          <Spinner size="xl" />
        </Box>
      ) : errorSales || errorRevenue || errorOrders || errortotalOrders ? (
        <Alert status="error" mt={4}>
          {errorSales || errorRevenue || errorOrders || errortotalOrders}
        </Alert>
      ) : (
        <Box>
          {/* Charts Section */}
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
            gap={10}
            mb={10}
          >
            {/* Sales Chart */}
            <GridItem>
              <Heading as="h3" size="md" mb={3} textAlign="center">
                Sales Data
              </Heading>

              <Box w="100%" h={{ base: "250px", md: "300px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={formatChartData(sales)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="violet"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </GridItem>

            {/* Revenue Chart */}
            <GridItem>
              <Heading as="h3" size="md" mb={3} textAlign="center">
                Revenue Data
              </Heading>

              <Box w="100%" h={{ base: "250px", md: "300px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={formatChartData(revenue)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="gold"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </GridItem>
          </Grid>

          {/* Latest Orders Table */}
          <Box>
            <Heading as="h3" size="md" mb={5} textAlign="center">
              Latest Orders
            </Heading>

            <VStack spacing={4} align="stretch">
              {orders?.length > 0 ? (
                orders.map((order) => (
                  <Box
                    key={order._id}
                    borderWidth="1px"
                    borderRadius="lg"
                    p={4}
                    bg="white"
                    boxShadow="md"
                  >
                    {/* 🔹 Order ID */}
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

                    {/* 🔹 Header */}
                    <Grid
                      templateColumns="1fr 1fr 1fr 1fr 3fr 1fr"
                      alignItems="center"
                      fontSize="sm"
                      justifyContent="space-between"
                      columnGap={1}
                    >
                      <Text>User</Text>
                      <Text>Date</Text>
                      <Text>Total</Text>
                      <Text>Status</Text>
                      <Text textAlign="center">Images</Text>
                      <Text textAlign="center">Action</Text>
                    </Grid>

                    {/* 🔹 Data */}
                    <Grid
                      templateColumns="1fr 1fr 1fr 1fr 3fr 1fr"
                      alignItems="center"
                      fontSize="sm"
                      justifyContent="space-between"
                      columnGap={2}
                    >
                      <Text>{order.customerName || "N/A"}</Text>

                      <Text>
                        {order.createdAt
                          ? order.createdAt.substring(0, 10)
                          : "N/A"}
                      </Text>

                      <Text>₹ {order.total}</Text>

                      <Badge
                        display="inline-flex"
                        alignItems="center"
                        width="fit-content"
                        px={2}
                        py={1}
                        borderRadius="md"
                        colorScheme={
                          order.orderStatus === "OUT_FOR_DELIVERY"
                            ? "blue"
                            : order.orderStatus === "PACKED"
                              ? "orange"
                              : "green"
                        }
                      >
                        {order.orderStatus || "CONFIRMED"}
                      </Badge>

                      {/* Images */}

                      <HStack spacing={1} justify="center">
                        {order.orderItems?.slice(0, 6).map((item, index) => (
                          <Image
                            key={index}
                            src={
                              item?.productImage?.[0]
                                ? `${API_URL}/${item.productImage[0]}`
                                : "/placeholder.png"
                            }
                            alt="product"
                            boxSize="40px"
                            objectFit="cover"
                            borderRadius="md"
                          />
                        ))}

                        {order.orderItems?.length > 3 && (
                          <Box
                            boxSize="40px"
                            bg="gray.200"
                            borderRadius="md"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            fontSize="xs"
                            fontWeight="bold"
                            color="gray.700"
                          >
                            +{order.orderItems.length - 3}
                          </Box>
                        )}
                      </HStack>

                      {/* Action */}
                      <Box textAlign="center">
                        <Link to={`/order/${order._id}`}>
                          <Button size="xs" colorScheme="teal">
                            Details
                          </Button>
                        </Link>
                      </Box>
                    </Grid>
                  </Box>
                ))
              ) : (
                <Text textAlign="center" color="gray.500">
                  No orders available
                </Text>
              )}
            </VStack>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Orders;
