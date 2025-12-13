import React, { useEffect } from "react";
import {
  Box,
  Heading,
  Grid,
  GridItem,
  Stack,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Spinner,
  Image,
  Alert,
  Button,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
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
          <Grid templateColumns="repeat(2, 1fr)" gap={10} mb={10}>
            <GridItem>
              <Heading as="h3" size="md" mb={3} textAlign={"center"}>
                Sales Data
              </Heading>
              <LineChart
                width={500}
                height={300}
                data={formatChartData(sales)}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="violet"
                  strokeWidth={8}
                />
              </LineChart>
            </GridItem>
            <GridItem>
              <Heading as="h3" size="md" mb={3} textAlign={"center"}>
                Revenue Data
              </Heading>
              <LineChart
                width={500}
                height={300}
                data={formatChartData(revenue)}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="yellow"
                  strokeWidth={8}
                />
              </LineChart>
            </GridItem>
          </Grid>

          {/* Latest Orders Table */}
          <Box>
            <Heading as="h3" size="md" mb={5} textAlign={"center"}>
              Latest Orders
            </Heading>
            <Table className="tableusers" variant="striped">
              <Thead>
                <Tr>
                  <Th textAlign="center">ID</Th>
                  <Th textAlign="center">User</Th>
                  <Th textAlign="center">Date</Th>
                  <Th textAlign="center">TOTAL</Th>
                  <Th textAlign="center">PAID</Th>
                  <Th textAlign="center">Status</Th>
                  <Th textAlign="center">ProductImage</Th>
                  <Th textAlign="center">Order Details</Th>
                </Tr>
              </Thead>
              <Tbody>
                {orders?.map((order) => {
                  const status = order.status;
                  return (
                    <Tr key={order._id}>
                      <Td>{order._id}</Td>
                      <Td>{order.customerName}</Td>
                      <Td>
                        {order.createdAt
                          ? order.createdAt.substring(0, 10)
                          : "N/A"}
                      </Td>
                      <Td>${order.total}</Td>
                      <Td>
                        {order.isPaid ? (
                          <div className="paid">
                            {order.paidAt.substring(0, 10)}
                          </div>
                        ) : (
                          <div className="notpaid">NO</div>
                        )}
                      </Td>
                      <Td textAlign="center">
                        <Button
                          size="sm"
                          colorScheme={status.color}
                          borderRadius="20px"
                          fontWeight="bold"
                          textTransform="uppercase"
                          px={4}
                          py={1}
                        >
                          {status.label}
                        </Button>
                      </Td>
                      <Td>
                        {order.orderItems.map((item) => (
                          <Stack
                            key={item.productId}
                            spacing={2}
                            align="center"
                          >
                            {/* Display the first image from the images array */}
                            {item.productImage.length > 0 && (
                              <Image
                                src={item.productImage[0]} // Access the first image
                                alt={item.productName}
                                boxSize="80px"
                                objectFit="cover"
                                borderRadius="5px"
                              />
                            )}
                            {/* Product Link */}
                            <Link to={`/product/${item.productId}`}>
                              <Button colorScheme="blue" size="xs">
                                View Product
                              </Button>
                            </Link>
                          </Stack>
                        ))}
                      </Td>
                      <Td>
                        <Link to={`/order/${order._id}`}>
                          <Button colorScheme="teal" size="sm">
                            Details
                          </Button>
                        </Link>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Orders;
